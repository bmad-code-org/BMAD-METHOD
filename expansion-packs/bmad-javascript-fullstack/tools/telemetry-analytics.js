#!/usr/bin/env node

/**
 * BMAD Telemetry & Analytics System
 * Tracks agent usage patterns, performance metrics, and optimization opportunities
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class TelemetryAnalytics {
  constructor(options = {}) {
    this.dataDir = options.dataDir || path.join(__dirname, '../telemetry-data');
    this.sessionId = crypto.randomBytes(16).toString('hex');
    this.startTime = Date.now();

    // Initialize collectors
    this.collectors = {
      agentUsage: new Map(),
      fileAccess: new Map(),
      tokenPatterns: [],
      checkpoints: [],
      decisions: [],
      errors: [],
      performance: []
    };

    // Configuration
    this.config = {
      autoSave: options.autoSave !== false,
      saveInterval: options.saveInterval || 60000, // 1 minute
      anonymize: options.anonymize !== false,
      verbose: options.verbose || false
    };

    this.initializeDataDir();
    if (this.config.autoSave) {
      this.startAutoSave();
    }
  }

  /**
   * Initialize telemetry data directory
   */
  async initializeDataDir() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await fs.mkdir(path.join(this.dataDir, 'sessions'), { recursive: true });
      await fs.mkdir(path.join(this.dataDir, 'aggregated'), { recursive: true });
    } catch (error) {
      console.error('Failed to initialize telemetry directory:', error);
    }
  }

  /**
   * Track agent usage
   */
  trackAgentUsage(agentName, action, metadata = {}) {
    const agent = this.collectors.agentUsage.get(agentName) || {
      invocations: 0,
      totalTokensUsed: 0,
      totalTimeMs: 0,
      actions: new Map(),
      errors: 0
    };

    agent.invocations++;
    agent.totalTokensUsed += metadata.tokensUsed || 0;
    agent.totalTimeMs += metadata.timeMs || 0;

    // Track specific actions
    const actionCount = agent.actions.get(action) || 0;
    agent.actions.set(action, actionCount + 1);

    this.collectors.agentUsage.set(agentName, agent);

    // Log event
    this.logEvent('agent_usage', {
      agent: agentName,
      action,
      ...metadata,
      timestamp: Date.now()
    });
  }

  /**
   * Track file access patterns
   */
  trackFileAccess(filepath, operation, metadata = {}) {
    const filename = path.basename(filepath);
    const file = this.collectors.fileAccess.get(filename) || {
      accessCount: 0,
      operations: new Map(),
      totalTokens: 0,
      agents: new Set(),
      firstAccess: Date.now(),
      lastAccess: Date.now()
    };

    file.accessCount++;
    file.lastAccess = Date.now();
    file.totalTokens += metadata.tokens || 0;

    if (metadata.agent) {
      file.agents.add(metadata.agent);
    }

    const opCount = file.operations.get(operation) || 0;
    file.operations.set(operation, opCount + 1);

    this.collectors.fileAccess.set(filename, file);

    this.logEvent('file_access', {
      file: filename,
      operation,
      ...metadata,
      timestamp: Date.now()
    });
  }

  /**
   * Track token usage patterns
   */
  trackTokenUsage(context, tokens, metadata = {}) {
    const pattern = {
      context,
      tokens,
      timestamp: Date.now(),
      phase: metadata.phase || 'unknown',
      agent: metadata.agent || 'unknown',
      efficiency: metadata.efficiency || this.calculateEfficiency(tokens, metadata)
    };

    this.collectors.tokenPatterns.push(pattern);

    // Track peak usage
    if (!this.peakTokenUsage || tokens > this.peakTokenUsage.tokens) {
      this.peakTokenUsage = pattern;
    }

    this.logEvent('token_usage', pattern);
  }

  /**
   * Track checkpoint creation
   */
  trackCheckpoint(checkpointId, originalTokens, compressedTokens, metadata = {}) {
    const checkpoint = {
      id: checkpointId,
      originalTokens,
      compressedTokens,
      compressionRatio: ((originalTokens - compressedTokens) / originalTokens * 100).toFixed(1),
      timestamp: Date.now(),
      phase: metadata.phase || 'unknown',
      agent: metadata.agent || 'unknown',
      artifacts: metadata.artifacts || []
    };

    this.collectors.checkpoints.push(checkpoint);

    this.logEvent('checkpoint', checkpoint);
  }

  /**
   * Track decision points
   */
  trackDecision(decisionType, choice, metadata = {}) {
    const decision = {
      type: decisionType,
      choice,
      timestamp: Date.now(),
      agent: metadata.agent || 'unknown',
      rationale: metadata.rationale || '',
      alternatives: metadata.alternatives || [],
      confidence: metadata.confidence || 1.0
    };

    this.collectors.decisions.push(decision);

    this.logEvent('decision', decision);
  }

  /**
   * Track errors and failures
   */
  trackError(errorType, message, metadata = {}) {
    const error = {
      type: errorType,
      message: this.config.anonymize ? this.anonymizeError(message) : message,
      timestamp: Date.now(),
      agent: metadata.agent || 'unknown',
      phase: metadata.phase || 'unknown',
      severity: metadata.severity || 'medium',
      resolved: metadata.resolved || false
    };

    this.collectors.errors.push(error);

    this.logEvent('error', error);
  }

  /**
   * Track performance metrics
   */
  trackPerformance(operation, duration, metadata = {}) {
    const perf = {
      operation,
      duration,
      timestamp: Date.now(),
      success: metadata.success !== false,
      tokensConsumed: metadata.tokens || 0,
      efficiency: duration > 0 ? (metadata.tokens || 0) / duration : 0
    };

    this.collectors.performance.push(perf);

    this.logEvent('performance', perf);
  }

  /**
   * Calculate efficiency metrics
   */
  calculateEfficiency(tokens, metadata) {
    if (!metadata.outputValue) return 1.0;

    // Simple efficiency: output value / tokens used
    return Math.min(metadata.outputValue / tokens, 2.0);
  }

  /**
   * Anonymize error messages
   */
  anonymizeError(message) {
    // Remove file paths, URLs, and potentially sensitive data
    return message
      .replace(/\/[^\s]+/g, '/[path]')
      .replace(/https?:\/\/[^\s]+/g, '[url]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]');
  }

  /**
   * Log event to memory
   */
  logEvent(type, data) {
    if (this.config.verbose) {
      console.log(`[Telemetry] ${type}:`, data);
    }
  }

  /**
   * Analyze collected data
   */
  analyze() {
    const duration = Date.now() - this.startTime;
    const analysis = {
      session: {
        id: this.sessionId,
        duration,
        startTime: this.startTime,
        endTime: Date.now()
      },
      agents: this.analyzeAgents(),
      files: this.analyzeFiles(),
      tokens: this.analyzeTokens(),
      checkpoints: this.analyzeCheckpoints(),
      decisions: this.analyzeDecisions(),
      errors: this.analyzeErrors(),
      performance: this.analyzePerformance(),
      recommendations: this.generateRecommendations()
    };

    return analysis;
  }

  /**
   * Analyze agent usage patterns
   */
  analyzeAgents() {
    const agents = Array.from(this.collectors.agentUsage.entries()).map(([name, data]) => ({
      name,
      invocations: data.invocations,
      avgTokensPerInvocation: data.invocations > 0 ? Math.round(data.totalTokensUsed / data.invocations) : 0,
      avgTimeMs: data.invocations > 0 ? Math.round(data.totalTimeMs / data.invocations) : 0,
      topActions: Array.from(data.actions.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([action, count]) => ({ action, count })),
      errorRate: data.invocations > 0 ? (data.errors / data.invocations * 100).toFixed(1) : 0
    }));

    return {
      totalAgents: agents.length,
      mostUsed: agents.sort((a, b) => b.invocations - a.invocations)[0],
      leastUsed: agents.sort((a, b) => a.invocations - b.invocations)[0],
      agents
    };
  }

  /**
   * Analyze file access patterns
   */
  analyzeFiles() {
    const files = Array.from(this.collectors.fileAccess.entries()).map(([name, data]) => ({
      name,
      accessCount: data.accessCount,
      avgTokens: data.accessCount > 0 ? Math.round(data.totalTokens / data.accessCount) : 0,
      agentCount: data.agents.size,
      accessPattern: this.detectAccessPattern(data),
      operations: Array.from(data.operations.entries())
    }));

    return {
      totalFiles: files.length,
      mostAccessed: files.sort((a, b) => b.accessCount - a.accessCount)[0],
      largestFile: files.sort((a, b) => b.avgTokens - a.avgTokens)[0],
      accessPatterns: this.summarizeAccessPatterns(files),
      files
    };
  }

  /**
   * Detect file access patterns
   */
  detectAccessPattern(fileData) {
    const duration = fileData.lastAccess - fileData.firstAccess;
    const accessRate = fileData.accessCount / (duration / 1000 / 60); // per minute

    if (accessRate > 10) return 'hot';
    if (accessRate > 1) return 'frequent';
    if (fileData.accessCount === 1) return 'one-time';
    return 'occasional';
  }

  /**
   * Analyze token usage patterns
   */
  analyzeTokens() {
    if (this.collectors.tokenPatterns.length === 0) {
      return { totalTokens: 0, patterns: [] };
    }

    const totalTokens = this.collectors.tokenPatterns.reduce((sum, p) => sum + p.tokens, 0);
    const avgTokens = Math.round(totalTokens / this.collectors.tokenPatterns.length);

    // Group by phase
    const byPhase = {};
    for (const pattern of this.collectors.tokenPatterns) {
      if (!byPhase[pattern.phase]) {
        byPhase[pattern.phase] = { count: 0, tokens: 0 };
      }
      byPhase[pattern.phase].count++;
      byPhase[pattern.phase].tokens += pattern.tokens;
    }

    return {
      totalTokens,
      avgTokensPerOperation: avgTokens,
      peakUsage: this.peakTokenUsage,
      byPhase: Object.entries(byPhase).map(([phase, data]) => ({
        phase,
        operations: data.count,
        totalTokens: data.tokens,
        avgTokens: Math.round(data.tokens / data.count)
      })),
      efficiency: this.calculateOverallEfficiency()
    };
  }

  /**
   * Analyze checkpoints
   */
  analyzeCheckpoints() {
    if (this.collectors.checkpoints.length === 0) {
      return { count: 0, avgCompression: 0 };
    }

    const avgCompression = this.collectors.checkpoints
      .reduce((sum, cp) => sum + parseFloat(cp.compressionRatio), 0) / this.collectors.checkpoints.length;

    const totalSaved = this.collectors.checkpoints
      .reduce((sum, cp) => sum + (cp.originalTokens - cp.compressedTokens), 0);

    return {
      count: this.collectors.checkpoints.length,
      avgCompression: avgCompression.toFixed(1),
      totalTokensSaved: totalSaved,
      checkpoints: this.collectors.checkpoints
    };
  }

  /**
   * Analyze decisions
   */
  analyzeDecisions() {
    const decisionTypes = {};
    for (const decision of this.collectors.decisions) {
      if (!decisionTypes[decision.type]) {
        decisionTypes[decision.type] = [];
      }
      decisionTypes[decision.type].push(decision.choice);
    }

    return {
      totalDecisions: this.collectors.decisions.length,
      byType: Object.entries(decisionTypes).map(([type, choices]) => ({
        type,
        count: choices.length,
        choices: [...new Set(choices)]
      })),
      avgConfidence: this.collectors.decisions.length > 0
        ? (this.collectors.decisions.reduce((sum, d) => sum + d.confidence, 0) / this.collectors.decisions.length).toFixed(2)
        : 1.0
    };
  }

  /**
   * Analyze errors
   */
  analyzeErrors() {
    const byType = {};
    const bySeverity = { low: 0, medium: 0, high: 0, critical: 0 };

    for (const error of this.collectors.errors) {
      byType[error.type] = (byType[error.type] || 0) + 1;
      bySeverity[error.severity]++;
    }

    return {
      totalErrors: this.collectors.errors.length,
      byType,
      bySeverity,
      resolvedCount: this.collectors.errors.filter(e => e.resolved).length,
      criticalErrors: this.collectors.errors.filter(e => e.severity === 'critical')
    };
  }

  /**
   * Analyze performance
   */
  analyzePerformance() {
    if (this.collectors.performance.length === 0) {
      return { operations: 0 };
    }

    const successful = this.collectors.performance.filter(p => p.success);
    const avgDuration = this.collectors.performance
      .reduce((sum, p) => sum + p.duration, 0) / this.collectors.performance.length;

    return {
      operations: this.collectors.performance.length,
      successRate: (successful.length / this.collectors.performance.length * 100).toFixed(1),
      avgDuration: Math.round(avgDuration),
      slowestOperation: this.collectors.performance
        .sort((a, b) => b.duration - a.duration)[0],
      totalTokensConsumed: this.collectors.performance
        .reduce((sum, p) => sum + p.tokensConsumed, 0)
    };
  }

  /**
   * Calculate overall efficiency
   */
  calculateOverallEfficiency() {
    const patterns = this.collectors.tokenPatterns;
    if (patterns.length === 0) return 1.0;

    const avgEfficiency = patterns
      .reduce((sum, p) => sum + p.efficiency, 0) / patterns.length;

    return avgEfficiency.toFixed(2);
  }

  /**
   * Summarize access patterns
   */
  summarizeAccessPatterns(files) {
    const patterns = { hot: 0, frequent: 0, occasional: 0, 'one-time': 0 };
    for (const file of files) {
      patterns[file.accessPattern]++;
    }
    return patterns;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    const analysis = {
      agents: this.analyzeAgents(),
      files: this.analyzeFiles(),
      tokens: this.analyzeTokens(),
      errors: this.analyzeErrors()
    };

    // Token optimization
    if (analysis.tokens.peakUsage && analysis.tokens.peakUsage.tokens > 4000) {
      recommendations.push({
        type: 'optimization',
        priority: 'high',
        message: `Peak token usage (${analysis.tokens.peakUsage.tokens}) exceeds recommended limit. Consider more aggressive checkpointing.`
      });
    }

    // File access optimization
    const hotFiles = analysis.files.files.filter(f => f.accessPattern === 'hot');
    if (hotFiles.length > 0) {
      recommendations.push({
        type: 'caching',
        priority: 'medium',
        message: `Files accessed frequently: ${hotFiles.map(f => f.name).join(', ')}. Consider caching these.`
      });
    }

    // Error handling
    if (analysis.errors.criticalErrors.length > 0) {
      recommendations.push({
        type: 'error',
        priority: 'critical',
        message: `${analysis.errors.criticalErrors.length} critical errors detected. Immediate attention required.`
      });
    }

    // Agent optimization
    if (analysis.agents.mostUsed && analysis.agents.mostUsed.avgTokensPerInvocation > 2000) {
      recommendations.push({
        type: 'agent',
        priority: 'medium',
        message: `Agent '${analysis.agents.mostUsed.name}' uses high tokens per invocation. Consider splitting responsibilities.`
      });
    }

    // Checkpoint frequency
    const checkpointAnalysis = this.analyzeCheckpoints();
    if (checkpointAnalysis.count === 0 && analysis.tokens.totalTokens > 10000) {
      recommendations.push({
        type: 'checkpoint',
        priority: 'high',
        message: 'No checkpoints created despite high token usage. Implement regular checkpointing.'
      });
    }

    return recommendations;
  }

  /**
   * Save telemetry data
   */
  async save() {
    try {
      const analysis = this.analyze();
      const filename = `session-${this.sessionId}-${Date.now()}.json`;
      const filepath = path.join(this.dataDir, 'sessions', filename);

      await fs.writeFile(filepath, JSON.stringify(analysis, null, 2));

      if (this.config.verbose) {
        console.log(`Telemetry saved to ${filepath}`);
      }

      // Also update aggregated data
      await this.updateAggregatedData(analysis);

      return filepath;
    } catch (error) {
      console.error('Failed to save telemetry:', error);
      return null;
    }
  }

  /**
   * Update aggregated data
   */
  async updateAggregatedData(sessionAnalysis) {
    const aggregatedPath = path.join(this.dataDir, 'aggregated', 'summary.json');

    let aggregated = {};
    try {
      const existing = await fs.readFile(aggregatedPath, 'utf-8');
      aggregated = JSON.parse(existing);
    } catch (error) {
      // File doesn't exist yet, start fresh
    }

    // Update aggregated metrics
    aggregated.sessions = (aggregated.sessions || 0) + 1;
    aggregated.totalTokens = (aggregated.totalTokens || 0) + sessionAnalysis.tokens.totalTokens;
    aggregated.totalErrors = (aggregated.totalErrors || 0) + sessionAnalysis.errors.totalErrors;
    aggregated.lastUpdated = Date.now();

    // Track top files
    if (!aggregated.topFiles) aggregated.topFiles = {};
    for (const file of sessionAnalysis.files.files) {
      aggregated.topFiles[file.name] = (aggregated.topFiles[file.name] || 0) + file.accessCount;
    }

    // Track agent usage
    if (!aggregated.agentUsage) aggregated.agentUsage = {};
    for (const agent of sessionAnalysis.agents.agents) {
      aggregated.agentUsage[agent.name] = (aggregated.agentUsage[agent.name] || 0) + agent.invocations;
    }

    await fs.writeFile(aggregatedPath, JSON.stringify(aggregated, null, 2));
  }

  /**
   * Start auto-save timer
   */
  startAutoSave() {
    this.autoSaveTimer = setInterval(() => {
      this.save();
    }, this.config.saveInterval);
  }

  /**
   * Stop auto-save timer
   */
  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Generate report
   */
  generateReport() {
    const analysis = this.analyze();

    console.log('\n' + '='.repeat(80));
    console.log('TELEMETRY ANALYTICS REPORT');
    console.log('='.repeat(80));

    // Session info
    console.log('\n📊 SESSION');
    console.log('-'.repeat(40));
    console.log(`Session ID: ${analysis.session.id}`);
    console.log(`Duration: ${Math.round(analysis.session.duration / 1000)}s`);

    // Agent usage
    console.log('\n🤖 AGENT USAGE');
    console.log('-'.repeat(40));
    if (analysis.agents.mostUsed) {
      console.log(`Most Used: ${analysis.agents.mostUsed.name} (${analysis.agents.mostUsed.invocations} invocations)`);
    }
    console.log(`Total Agents: ${analysis.agents.totalAgents}`);

    // Token usage
    console.log('\n💰 TOKEN USAGE');
    console.log('-'.repeat(40));
    console.log(`Total Tokens: ${analysis.tokens.totalTokens}`);
    console.log(`Avg per Operation: ${analysis.tokens.avgTokensPerOperation}`);
    console.log(`Efficiency Score: ${analysis.tokens.efficiency}`);

    // File access
    console.log('\n📁 FILE ACCESS');
    console.log('-'.repeat(40));
    console.log(`Total Files: ${analysis.files.totalFiles}`);
    if (analysis.files.mostAccessed) {
      console.log(`Most Accessed: ${analysis.files.mostAccessed.name} (${analysis.files.mostAccessed.accessCount} times)`);
    }

    // Checkpoints
    console.log('\n📍 CHECKPOINTS');
    console.log('-'.repeat(40));
    console.log(`Created: ${analysis.checkpoints.count}`);
    console.log(`Avg Compression: ${analysis.checkpoints.avgCompression}%`);
    console.log(`Tokens Saved: ${analysis.checkpoints.totalTokensSaved}`);

    // Errors
    if (analysis.errors.totalErrors > 0) {
      console.log('\n⚠️ ERRORS');
      console.log('-'.repeat(40));
      console.log(`Total: ${analysis.errors.totalErrors}`);
      console.log(`Critical: ${analysis.errors.bySeverity.critical}`);
      console.log(`Resolved: ${analysis.errors.resolvedCount}`);
    }

    // Recommendations
    if (analysis.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS');
      console.log('-'.repeat(40));
      for (const rec of analysis.recommendations) {
        const icon = rec.priority === 'critical' ? '🔴' : rec.priority === 'high' ? '🟠' : '🟡';
        console.log(`${icon} [${rec.type}] ${rec.message}`);
      }
    }

    console.log('\n' + '='.repeat(80));
  }

  /**
   * Clean up and save final data
   */
  async cleanup() {
    this.stopAutoSave();
    await this.save();
  }
}

// CLI for testing
if (require.main === module) {
  const telemetry = new TelemetryAnalytics({ verbose: true });

  // Simulate usage
  console.log('Simulating telemetry collection...\n');

  // Agent usage
  telemetry.trackAgentUsage('react-developer', 'create_component', {
    tokensUsed: 1200,
    timeMs: 3000
  });

  telemetry.trackAgentUsage('node-backend-developer', 'implement_api', {
    tokensUsed: 1800,
    timeMs: 5000
  });

  // File access
  telemetry.trackFileAccess('core-principles.md', 'load', {
    tokens: 5000,
    agent: 'react-developer'
  });

  telemetry.trackFileAccess('core-principles.md', 'load', {
    tokens: 5000,
    agent: 'node-backend-developer'
  });

  // Token usage
  telemetry.trackTokenUsage('architecture_phase', 4500, {
    phase: 'architecture',
    agent: 'solution-architect'
  });

  // Checkpoint
  telemetry.trackCheckpoint('checkpoint-arch-001', 4500, 800, {
    phase: 'architecture',
    agent: 'solution-architect'
  });

  // Decision
  telemetry.trackDecision('technology', 'Next.js', {
    agent: 'solution-architect',
    alternatives: ['Gatsby', 'Vite'],
    confidence: 0.9
  });

  // Error
  telemetry.trackError('api_error', 'Failed to connect to database', {
    agent: 'node-backend-developer',
    severity: 'high'
  });

  // Generate report
  telemetry.generateReport();

  // Save and cleanup
  telemetry.cleanup().then(() => {
    console.log('\nTelemetry data saved successfully.');
  });
}

module.exports = TelemetryAnalytics;