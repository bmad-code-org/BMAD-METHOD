/**
 * Sign-off Manager - Configurable sign-off logic for PRDs and Epics
 *
 * Supports three threshold types:
 * - count: Minimum number of approvals needed
 * - percentage: Percentage of stakeholders must approve
 * - required_approvers: Specific people must approve + minimum optional
 */

const SIGNOFF_STATUS = {
  pending: 'signoff:pending',
  approved: 'signoff:approved',
  approved_with_note: 'signoff:approved-with-note',
  blocked: 'signoff:blocked'
};

const THRESHOLD_TYPES = {
  count: 'count',
  percentage: 'percentage',
  required_approvers: 'required_approvers'
};

const DEFAULT_CONFIG = {
  threshold_type: THRESHOLD_TYPES.count,
  minimum_approvals: 2,
  approval_percentage: 66,
  required: [],
  optional: [],
  minimum_optional: 0,
  allow_blocks: true,
  block_threshold: 1
};

class SignoffManager {
  constructor(githubConfig) {
    this.owner = githubConfig.owner;
    this.repo = githubConfig.repo;
  }

  /**
   * Request sign-off from stakeholders
   */
  async requestSignoff({
    documentKey,
    documentType,       // 'prd' or 'epic'
    reviewIssueNumber,
    stakeholders,       // Array of @usernames
    deadline,           // ISO date string
    config = {}         // Sign-off configuration
  }) {
    const signoffConfig = { ...DEFAULT_CONFIG, ...config };

    // Validate configuration
    this._validateConfig(signoffConfig, stakeholders);

    // Update the review issue to signoff status
    const labels = [
      `type:${documentType}-review`,
      `${documentType}:${documentKey.split(':')[1]}`,
      'review-status:signoff'
    ];

    // Build stakeholder checklist
    const checklist = stakeholders.map(user =>
      `- [ ] @${user.replace('@', '')} - ⏳ Pending`
    ).join('\n');

    const body = this._formatSignoffRequestBody({
      documentKey,
      documentType,
      stakeholders,
      deadline,
      config: signoffConfig,
      checklist
    });

    // Add comment to review issue
    await this._addComment(reviewIssueNumber, body);

    return {
      reviewIssueNumber,
      documentKey,
      stakeholders,
      deadline,
      config: signoffConfig,
      status: 'signoff_requested'
    };
  }

  /**
   * Submit a sign-off decision
   */
  async submitSignoff({
    reviewIssueNumber,
    documentKey,
    documentType,
    user,
    decision,           // 'approved' | 'approved_with_note' | 'blocked'
    note = null,        // Optional note or blocking reason
    feedbackIssueNumber = null  // If blocked, link to feedback issue
  }) {
    if (!Object.keys(SIGNOFF_STATUS).includes(decision)) {
      throw new Error(`Invalid decision: ${decision}. Must be one of: ${Object.keys(SIGNOFF_STATUS).join(', ')}`);
    }

    const emoji = this._getDecisionEmoji(decision);
    const statusText = this._getDecisionText(decision);

    let comment = `### ${emoji} Sign-off from @${user.replace('@', '')}\n\n`;
    comment += `**Decision:** ${statusText}\n`;
    comment += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;

    if (note) {
      comment += `\n**Note:**\n${note}\n`;
    }

    if (decision === 'blocked' && feedbackIssueNumber) {
      comment += `\n**Blocking Issue:** #${feedbackIssueNumber}\n`;
    }

    await this._addComment(reviewIssueNumber, comment);

    // Store signoff in labels for queryability
    await this._addSignoffLabel(reviewIssueNumber, user, decision);

    return {
      reviewIssueNumber,
      user,
      decision,
      note,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get all sign-offs for a review
   */
  async getSignoffs(reviewIssueNumber) {
    const issue = await this._getIssue(reviewIssueNumber);
    const labels = issue.labels.map(l => l.name);

    // Parse signoff labels: signoff-{user}-{status}
    const signoffs = [];
    for (const label of labels) {
      const match = label.match(/^signoff-(.+)-(approved|approved-with-note|blocked|pending)$/);
      if (match) {
        signoffs.push({
          user: match[1],
          status: match[2].replace(/-/g, '_'),
          label: label
        });
      }
    }

    return signoffs;
  }

  /**
   * Calculate sign-off status based on configuration
   */
  calculateStatus(signoffs, stakeholders, config = DEFAULT_CONFIG) {
    const approvals = signoffs.filter(s =>
      s.status === 'approved' || s.status === 'approved_with_note'
    );
    const blocks = signoffs.filter(s => s.status === 'blocked');
    const pending = stakeholders.filter(user =>
      !signoffs.some(s => s.user === user.replace('@', ''))
    );

    // Check for blockers first
    if (config.allow_blocks && blocks.length >= config.block_threshold) {
      return {
        status: 'blocked',
        blockers: blocks.map(b => b.user),
        message: `Blocked by ${blocks.length} stakeholder(s)`
      };
    }

    switch (config.threshold_type) {
      case THRESHOLD_TYPES.count:
        return this._calculateCountStatus(approvals, config, pending);

      case THRESHOLD_TYPES.percentage:
        return this._calculatePercentageStatus(approvals, stakeholders, config, pending);

      case THRESHOLD_TYPES.required_approvers:
        return this._calculateRequiredApproversStatus(approvals, config, pending);

      default:
        throw new Error(`Unknown threshold type: ${config.threshold_type}`);
    }
  }

  /**
   * Check if document is fully approved
   */
  isApproved(signoffs, stakeholders, config = DEFAULT_CONFIG) {
    const status = this.calculateStatus(signoffs, stakeholders, config);
    return status.status === 'approved';
  }

  /**
   * Get sign-off progress summary
   */
  getProgressSummary(signoffs, stakeholders, config = DEFAULT_CONFIG) {
    const status = this.calculateStatus(signoffs, stakeholders, config);

    const approvalCount = signoffs.filter(s =>
      s.status === 'approved' || s.status === 'approved_with_note'
    ).length;

    const blockCount = signoffs.filter(s => s.status === 'blocked').length;

    const pendingUsers = stakeholders.filter(user =>
      !signoffs.some(s => s.user === user.replace('@', ''))
    );

    return {
      ...status,
      total_stakeholders: stakeholders.length,
      approved_count: approvalCount,
      blocked_count: blockCount,
      pending_count: pendingUsers.length,
      pending_users: pendingUsers,
      progress_percent: Math.round((approvalCount / stakeholders.length) * 100)
    };
  }

  /**
   * Send reminder to pending stakeholders
   */
  async sendReminder(reviewIssueNumber, pendingUsers, deadline) {
    const mentions = pendingUsers.map(u => `@${u.replace('@', '')}`).join(', ');

    const comment = `### ⏰ Reminder: Sign-off Needed\n\n` +
      `${mentions}\n\n` +
      `Your sign-off is still pending for this review.\n` +
      `**Deadline:** ${deadline}\n\n` +
      `Please review and submit your decision.`;

    await this._addComment(reviewIssueNumber, comment);

    return { reminded: pendingUsers, deadline };
  }

  /**
   * Extend sign-off deadline
   */
  async extendDeadline(reviewIssueNumber, newDeadline, reason = null) {
    let comment = `### 📅 Deadline Extended\n\n`;
    comment += `**New Deadline:** ${newDeadline}\n`;

    if (reason) {
      comment += `**Reason:** ${reason}\n`;
    }

    await this._addComment(reviewIssueNumber, comment);

    return { reviewIssueNumber, newDeadline };
  }

  // ============ Private Methods ============

  _validateConfig(config, stakeholders) {
    if (config.threshold_type === THRESHOLD_TYPES.count) {
      if (config.minimum_approvals > stakeholders.length) {
        throw new Error(
          `minimum_approvals (${config.minimum_approvals}) cannot exceed stakeholder count (${stakeholders.length})`
        );
      }
    }

    if (config.threshold_type === THRESHOLD_TYPES.required_approvers) {
      const allRequired = config.required.every(r =>
        stakeholders.some(s => s.replace('@', '') === r.replace('@', ''))
      );
      if (!allRequired) {
        throw new Error('All required approvers must be in stakeholder list');
      }
    }
  }

  _calculateCountStatus(approvals, config, pending) {
    if (approvals.length >= config.minimum_approvals) {
      return { status: 'approved', message: 'Minimum approvals reached' };
    }

    return {
      status: 'pending',
      needed: config.minimum_approvals - approvals.length,
      pending_users: pending,
      message: `Need ${config.minimum_approvals - approvals.length} more approval(s)`
    };
  }

  _calculatePercentageStatus(approvals, stakeholders, config, pending) {
    const percent = (approvals.length / stakeholders.length) * 100;

    if (percent >= config.approval_percentage) {
      return {
        status: 'approved',
        message: `${Math.round(percent)}% approved (threshold: ${config.approval_percentage}%)`
      };
    }

    const needed = Math.ceil((config.approval_percentage / 100) * stakeholders.length) - approvals.length;
    return {
      status: 'pending',
      current_percent: Math.round(percent),
      needed_percent: config.approval_percentage,
      needed: needed,
      pending_users: pending,
      message: `${Math.round(percent)}% approved, need ${config.approval_percentage}%`
    };
  }

  _calculateRequiredApproversStatus(approvals, config, pending) {
    const approvedUsers = approvals.map(a => a.user);

    // Check required approvers
    const missingRequired = config.required.filter(r =>
      !approvedUsers.includes(r.replace('@', ''))
    );

    if (missingRequired.length > 0) {
      return {
        status: 'pending',
        missing_required: missingRequired,
        pending_users: pending,
        message: `Waiting for required approvers: ${missingRequired.join(', ')}`
      };
    }

    // Check optional approvers
    const optionalApproved = approvals.filter(a =>
      config.optional.some(o => o.replace('@', '') === a.user)
    ).length;

    if (optionalApproved < config.minimum_optional) {
      const neededOptional = config.minimum_optional - optionalApproved;
      const pendingOptional = config.optional.filter(o =>
        !approvedUsers.includes(o.replace('@', ''))
      );

      return {
        status: 'pending',
        optional_needed: neededOptional,
        pending_optional: pendingOptional,
        pending_users: pending,
        message: `Need ${neededOptional} more optional approver(s)`
      };
    }

    return { status: 'approved', message: 'All required + minimum optional approvers satisfied' };
  }

  _getDecisionEmoji(decision) {
    switch (decision) {
      case 'approved': return '✅';
      case 'approved_with_note': return '✅📝';
      case 'blocked': return '🚫';
      default: return '⏳';
    }
  }

  _getDecisionText(decision) {
    switch (decision) {
      case 'approved': return 'Approved';
      case 'approved_with_note': return 'Approved with Note';
      case 'blocked': return 'Blocked';
      default: return 'Pending';
    }
  }

  _formatSignoffRequestBody({ documentKey, documentType, stakeholders, deadline, config, checklist }) {
    let body = `## ✍️ Sign-off Requested\n\n`;
    body += `**Document:** \`${documentKey}\`\n`;
    body += `**Type:** ${documentType.toUpperCase()}\n`;
    body += `**Deadline:** ${deadline}\n\n`;

    body += `### Sign-off Configuration\n`;
    body += `- **Threshold:** ${this._formatThreshold(config)}\n`;
    if (config.allow_blocks) {
      body += `- **Block Threshold:** ${config.block_threshold} block(s) will halt approval\n`;
    }
    body += '\n';

    body += `### Stakeholder Status\n\n`;
    body += checklist;
    body += '\n\n';

    body += `---\n\n`;
    body += `**To sign off:**\n`;
    body += `- ✅ **Approve**: Comment with \`/signoff approve\`\n`;
    body += `- ✅📝 **Approve with Note**: Comment with \`/signoff approve-note: [your note]\`\n`;
    body += `- 🚫 **Block**: Comment with \`/signoff block: [reason]\`\n`;

    return body;
  }

  _formatThreshold(config) {
    switch (config.threshold_type) {
      case THRESHOLD_TYPES.count:
        return `${config.minimum_approvals} approval(s) required`;
      case THRESHOLD_TYPES.percentage:
        return `${config.approval_percentage}% must approve`;
      case THRESHOLD_TYPES.required_approvers:
        return `Required: ${config.required.join(', ')} + ${config.minimum_optional} optional`;
      default:
        return 'Unknown';
    }
  }

  async _addSignoffLabel(issueNumber, user, decision) {
    // Normalize user and decision for label
    const normalizedUser = user.replace('@', '').replace(/[^a-zA-Z0-9-]/g, '-');
    const normalizedDecision = decision.replace(/_/g, '-');
    const label = `signoff-${normalizedUser}-${normalizedDecision}`;

    // Get current labels
    const issue = await this._getIssue(issueNumber);
    const currentLabels = issue.labels.map(l => l.name);

    // Remove any existing signoff label for this user
    const newLabels = currentLabels.filter(l =>
      !l.startsWith(`signoff-${normalizedUser}-`)
    );

    // Add new signoff label
    newLabels.push(label);

    await this._updateIssue(issueNumber, { labels: newLabels });
  }

  // GitHub API wrappers (to be called via MCP)
  async _getIssue(issueNumber) {
    // This would be: mcp__github__issue_read({ method: 'get', ... })
    throw new Error('_getIssue must be implemented by caller via GitHub MCP');
  }

  async _updateIssue(issueNumber, updates) {
    // This would be: mcp__github__issue_write({ method: 'update', ... })
    throw new Error('_updateIssue must be implemented by caller via GitHub MCP');
  }

  async _addComment(issueNumber, body) {
    // This would be: mcp__github__add_issue_comment({ ... })
    throw new Error('_addComment must be implemented by caller via GitHub MCP');
  }
}

module.exports = {
  SignoffManager,
  SIGNOFF_STATUS,
  THRESHOLD_TYPES,
  DEFAULT_CONFIG
};
