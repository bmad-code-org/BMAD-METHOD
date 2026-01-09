/**
 * Synthesis Engine - LLM-powered feedback synthesis with conflict resolution
 *
 * Groups feedback by section, identifies conflicts/tensions,
 * and generates proposed resolutions with rationale.
 */

const SYNTHESIS_PROMPTS = {
  prd: {
    grouping: `Analyze the following feedback items for a PRD section and group them by theme:

SECTION: {{section}}

FEEDBACK ITEMS:
{{feedbackItems}}

Group these into themes and identify:
1. Common requests (multiple people asking for similar things)
2. Conflicts (opposing viewpoints)
3. Quick wins (low-effort, high-value changes)
4. Major changes (significant scope implications)

Format your response as JSON.`,

    resolution: `You are helping synthesize stakeholder feedback on a PRD.

SECTION: {{section}}
ORIGINAL TEXT:
{{originalText}}

CONFLICT DETECTED:
{{conflictDescription}}

FEEDBACK FROM STAKEHOLDERS:
{{feedbackDetails}}

Propose a resolution that:
1. Addresses the core concerns of all parties
2. Maintains product coherence
3. Is actionable and specific

Provide:
- proposed_text: The updated section text
- rationale: Why this resolution works (2-3 sentences)
- trade_offs: What compromises were made
- confidence: high/medium/low

Format as JSON.`,

    merge: `Incorporate the following approved feedback into the PRD section:

SECTION: {{section}}
ORIGINAL TEXT:
{{originalText}}

FEEDBACK TO INCORPORATE:
{{feedbackToIncorporate}}

Generate the updated section text that:
1. Addresses all feedback points
2. Maintains consistent tone and format
3. Is clear and actionable

Return the complete updated section text.`,
  },

  epic: {
    grouping: `Analyze the following feedback items for an Epic and group them by theme:

EPIC: {{epicKey}}

FEEDBACK ITEMS:
{{feedbackItems}}

Group these into:
1. Scope concerns (too big, should split)
2. Story split suggestions
3. Dependency/blocking issues
4. Technical risks
5. Missing stories
6. Priority questions

Format your response as JSON.`,

    storySplit: `Based on stakeholder feedback, suggest how to split this epic into stories:

EPIC: {{epicKey}}
EPIC DESCRIPTION:
{{epicDescription}}

CURRENT STORIES:
{{currentStories}}

FEEDBACK SUGGESTING CHANGES:
{{feedbackItems}}

Propose an updated story breakdown that:
1. Addresses the split/scope concerns
2. Maintains logical grouping
3. Respects dependencies
4. Keeps stories appropriately sized (3-8 tasks each)

Format as JSON with:
- stories: Array of { key, title, description, tasks_estimate }
- changes_made: What changed from original
- rationale: Why this split works better`,
  },
};

class SynthesisEngine {
  constructor(options = {}) {
    this.documentType = options.documentType || 'prd'; // 'prd' or 'epic'
  }

  /**
   * Analyze feedback and generate a synthesis report
   */
  async analyzeFeedback(feedbackBySection, originalDocument) {
    const analysis = {
      sections: {},
      conflicts: [],
      themes: [],
      suggestedChanges: [],
      summary: {},
    };

    for (const [section, feedbackList] of Object.entries(feedbackBySection)) {
      const sectionAnalysis = await this._analyzeSection(section, feedbackList, originalDocument[section]);

      analysis.sections[section] = sectionAnalysis;

      if (sectionAnalysis.conflicts.length > 0) {
        analysis.conflicts.push(
          ...sectionAnalysis.conflicts.map((c) => ({
            ...c,
            section,
          })),
        );
      }

      analysis.suggestedChanges.push(
        ...sectionAnalysis.suggestedChanges.map((c) => ({
          ...c,
          section,
        })),
      );
    }

    // Generate overall summary
    analysis.summary = this._generateSummary(analysis);

    return analysis;
  }

  /**
   * Analyze a single section's feedback
   */
  async _analyzeSection(section, feedbackList, originalText) {
    const result = {
      feedbackCount: feedbackList.length,
      byType: this._groupByType(feedbackList),
      themes: [],
      conflicts: [],
      suggestedChanges: [],
    };

    // Identify conflicts (multiple feedback on same aspect)
    result.conflicts = this._identifyConflicts(feedbackList);

    // Group into themes
    result.themes = this._identifyThemes(feedbackList);

    // Generate suggested changes for non-conflicting feedback
    const nonConflicting = feedbackList.filter((f) => !result.conflicts.some((c) => c.feedbackIds.includes(f.id)));

    for (const feedback of nonConflicting) {
      result.suggestedChanges.push({
        feedbackId: feedback.id,
        type: feedback.feedbackType,
        priority: feedback.priority,
        description: feedback.title,
        suggestedChange: feedback.suggestedChange,
        submittedBy: feedback.submittedBy,
      });
    }

    return result;
  }

  /**
   * Identify conflicts in feedback
   */
  _identifyConflicts(feedbackList) {
    const conflicts = [];

    // Group by topic/keywords
    const byTopic = {};
    for (const fb of feedbackList) {
      const keywords = this._extractKeywords(fb.title + ' ' + (fb.body || ''));
      for (const kw of keywords) {
        if (!byTopic[kw]) byTopic[kw] = [];
        byTopic[kw].push(fb);
      }
    }

    // Find topics with multiple conflicting opinions
    for (const [topic, items] of Object.entries(byTopic)) {
      if (items.length < 2) continue;

      // Check if they have different suggestions
      const uniqueSuggestions = new Set(items.map((i) => i.suggestedChange).filter(Boolean));
      if (uniqueSuggestions.size > 1) {
        conflicts.push({
          topic,
          feedbackIds: items.map((i) => i.id),
          stakeholders: items.map((i) => ({ user: i.submittedBy, position: i.title })),
          description: `Conflicting views on ${topic}`,
        });
      }
    }

    return conflicts;
  }

  /**
   * Identify common themes in feedback
   */
  _identifyThemes(feedbackList) {
    const themes = {};

    for (const fb of feedbackList) {
      const keywords = this._extractKeywords(fb.title);
      for (const kw of keywords) {
        if (!themes[kw]) {
          themes[kw] = { keyword: kw, count: 0, feedbackIds: [], types: new Set() };
        }
        themes[kw].count++;
        themes[kw].feedbackIds.push(fb.id);
        themes[kw].types.add(fb.feedbackType);
      }
    }

    // Return themes mentioned by multiple people
    return Object.values(themes)
      .filter((t) => t.count >= 2)
      .map((t) => ({
        ...t,
        types: Array.from(t.types),
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Generate resolution proposal for a conflict
   */
  generateConflictResolution(conflict, originalText, feedbackDetails) {
    // This returns a prompt for the LLM to process
    const prompt = SYNTHESIS_PROMPTS[this.documentType].resolution
      .replace('{{section}}', conflict.section || 'Unknown')
      .replace('{{originalText}}', originalText || 'N/A')
      .replace('{{conflictDescription}}', conflict.description)
      .replace('{{feedbackDetails}}', JSON.stringify(feedbackDetails, null, 2));

    return {
      prompt,
      conflict,
      // The LLM response should be parsed into:
      expectedFormat: {
        proposed_text: 'string',
        rationale: 'string',
        trade_offs: 'string[]',
        confidence: 'high|medium|low',
      },
    };
  }

  /**
   * Generate merge prompt for incorporating feedback
   */
  generateMergePrompt(section, originalText, approvedFeedback) {
    const feedbackText = approvedFeedback
      .map((f) => `- ${f.feedbackType}: ${f.title}\n  Change: ${f.suggestedChange || 'Address the concern'}`)
      .join('\n\n');

    return SYNTHESIS_PROMPTS[this.documentType].merge
      .replace('{{section}}', section)
      .replace('{{originalText}}', originalText)
      .replace('{{feedbackToIncorporate}}', feedbackText);
  }

  /**
   * Generate story split prompt for epics
   */
  generateStorySplitPrompt(epicKey, epicDescription, currentStories, feedback) {
    if (this.documentType !== 'epic') {
      throw new Error('Story split is only available for epics');
    }

    return SYNTHESIS_PROMPTS.epic.storySplit
      .replace('{{epicKey}}', epicKey)
      .replace('{{epicDescription}}', epicDescription)
      .replace('{{currentStories}}', JSON.stringify(currentStories, null, 2))
      .replace('{{feedbackItems}}', JSON.stringify(feedback, null, 2));
  }

  /**
   * Generate synthesis summary
   */
  _generateSummary(analysis) {
    const totalFeedback = Object.values(analysis.sections).reduce((sum, s) => sum + s.feedbackCount, 0);

    const allTypes = {};
    for (const section of Object.values(analysis.sections)) {
      for (const [type, count] of Object.entries(section.byType)) {
        allTypes[type] = (allTypes[type] || 0) + count;
      }
    }

    return {
      totalFeedback,
      sectionsWithFeedback: Object.keys(analysis.sections).length,
      conflictCount: analysis.conflicts.length,
      themeCount: analysis.themes ? analysis.themes.length : 0,
      changeCount: analysis.suggestedChanges.length,
      feedbackByType: allTypes,
      needsAttention: analysis.conflicts.length > 0,
    };
  }

  /**
   * Group feedback by type
   */
  _groupByType(feedbackList) {
    const byType = {};
    for (const fb of feedbackList) {
      byType[fb.feedbackType] = (byType[fb.feedbackType] || 0) + 1;
    }
    return byType;
  }

  /**
   * Extract keywords from text for theme detection
   */
  _extractKeywords(text) {
    if (!text) return [];

    // Simple keyword extraction - can be enhanced
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'being',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'may',
      'might',
      'must',
      'shall',
      'to',
      'of',
      'in',
      'for',
      'on',
      'with',
      'at',
      'by',
      'from',
      'this',
      'that',
      'these',
      'those',
      'it',
      'its',
      'and',
      'or',
      'but',
      'not',
      'no',
      'if',
      'then',
      'else',
      'when',
      'where',
      'why',
      'how',
      'what',
      'which',
      'who',
      'whom',
      'whose',
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stopWords.has(word))
      .slice(0, 10); // Limit to top 10 keywords
  }

  /**
   * Format synthesis results for display
   */
  formatForDisplay(analysis) {
    let output = '';

    output += `## Synthesis Analysis\n\n`;
    output += `**Total Feedback:** ${analysis.summary.totalFeedback}\n`;
    output += `**Sections with Feedback:** ${analysis.summary.sectionsWithFeedback}\n`;
    output += `**Conflicts Detected:** ${analysis.summary.conflictCount}\n`;
    output += `**Suggested Changes:** ${analysis.summary.changeCount}\n\n`;

    if (analysis.summary.needsAttention) {
      output += `### ⚠️ Conflicts Requiring Resolution\n\n`;
      for (const conflict of analysis.conflicts) {
        output += `**${conflict.section}**: ${conflict.description}\n`;
        for (const stakeholder of conflict.stakeholders) {
          output += `  - @${stakeholder.user}: "${stakeholder.position}"\n`;
        }
        output += '\n';
      }
    }

    output += `### By Section\n\n`;
    for (const [section, data] of Object.entries(analysis.sections)) {
      output += `**${section}** (${data.feedbackCount} items)\n`;
      for (const [type, count] of Object.entries(data.byType)) {
        output += `  - ${type}: ${count}\n`;
      }
      output += '\n';
    }

    return output;
  }
}

module.exports = { SynthesisEngine, SYNTHESIS_PROMPTS };
