#!/usr/bin/env node

/**
 * Runtime Token Tracking & Alert System for BMAD
 * Provides real-time token monitoring, alerts, and automatic checkpoint triggers
 */

const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class TokenTracker extends EventEmitter {
  constructor(options = {}) {
    super();

    // Configuration
    this.budget = options.budget || 5000;
    this.checkpointThreshold = options.checkpointThreshold || 3000;
    this.warningThreshold = options.warningThreshold || 0.75;
    this.criticalThreshold = options.criticalThreshold || 0.9;

    // State tracking
    this.currentTokens = 0;
    this.contextHistory = [];
    this.loadedFiles = new Map();
    this.startTime = Date.now();
    this.checkpointCount = 0;

    // Telemetry
    this.metrics = {
      totalLoaded: 0,
      totalSaved: 0,
      checkpoints: [],
      alerts: [],
      fileAccess: new Map()
    };

    this.setupAlerts();
  }

  /**
   * Setup alert handlers
   */
  setupAlerts() {
    this.on('warning', (data) => {
      console.warn(`⚠️  TOKEN WARNING: ${data.message}`);
      this.metrics.alerts.push({ level: 'warning', ...data, timestamp: Date.now() });
    });

    this.on('critical', (data) => {
      console.error(`🚨 TOKEN CRITICAL: ${data.message}`);
      this.metrics.alerts.push({ level: 'critical', ...data, timestamp: Date.now() });
    });

    this.on('checkpoint-needed', (data) => {
      console.log(`📍 CHECKPOINT NEEDED: ${data.message}`);
      this.metrics.alerts.push({ level: 'checkpoint', ...data, timestamp: Date.now() });
    });
  }

  /**
   * Track file loading
   */
  loadFile(filepath, content) {
    const tokens = this.estimateTokens(content);
    const filename = path.basename(filepath);

    // Check if would exceed budget
    if (this.currentTokens + tokens > this.budget) {
      this.emit('critical', {
        message: `Loading ${filename} (${tokens} tokens) would exceed budget`,
        current: this.currentTokens,
        attempted: tokens,
        budget: this.budget
      });
      return false;
    }

    // Track the load
    this.loadedFiles.set(filepath, {
      tokens,
      loadedAt: Date.now(),
      accessCount: 1
    });

    this.currentTokens += tokens;
    this.metrics.totalLoaded += tokens;

    // Update file access metrics
    const access = this.metrics.fileAccess.get(filepath) || { count: 0, tokens: 0 };
    access.count++;
    access.tokens += tokens;
    this.metrics.fileAccess.set(filepath, access);

    // Add to history
    this.contextHistory.push({
      action: 'load',
      file: filename,
      tokens,
      total: this.currentTokens,
      timestamp: Date.now()
    });

    this.checkStatus();
    return true;
  }

  /**
   * Unload file from context
   */
  unloadFile(filepath) {
    const file = this.loadedFiles.get(filepath);
    if (file) {
      this.currentTokens -= file.tokens;
      this.loadedFiles.delete(filepath);

      this.contextHistory.push({
        action: 'unload',
        file: path.basename(filepath),
        tokens: -file.tokens,
        total: this.currentTokens,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Create checkpoint
   */
  createCheckpoint(summary, compressedTokens) {
    const checkpoint = {
      id: `checkpoint-${++this.checkpointCount}`,
      timestamp: Date.now(),
      originalTokens: this.currentTokens,
      compressedTokens,
      compressionRatio: ((this.currentTokens - compressedTokens) / this.currentTokens * 100).toFixed(1),
      files: Array.from(this.loadedFiles.keys()),
      summary
    };

    this.metrics.checkpoints.push(checkpoint);
    this.metrics.totalSaved += (this.currentTokens - compressedTokens);

    // Reset context
    this.currentTokens = compressedTokens;
    this.loadedFiles.clear();

    this.contextHistory.push({
      action: 'checkpoint',
      checkpoint: checkpoint.id,
      saved: checkpoint.originalTokens - compressedTokens,
      timestamp: Date.now()
    });

    return checkpoint;
  }

  /**
   * Check current status and emit alerts
   */
  checkStatus() {
    const usage = this.currentTokens / this.budget;
    const status = this.getStatus();

    // Checkpoint threshold
    if (this.currentTokens > this.checkpointThreshold) {
      this.emit('checkpoint-needed', {
        message: `Context exceeds checkpoint threshold (${this.currentTokens}/${this.checkpointThreshold})`,
        current: this.currentTokens,
        threshold: this.checkpointThreshold
      });
    }

    // Budget alerts
    if (usage > this.criticalThreshold && status.previous !== 'critical') {
      this.emit('critical', {
        message: `Token usage critical: ${(usage * 100).toFixed(1)}% of budget`,
        current: this.currentTokens,
        budget: this.budget
      });
    } else if (usage > this.warningThreshold && status.previous === 'green') {
      this.emit('warning', {
        message: `Token usage warning: ${(usage * 100).toFixed(1)}% of budget`,
        current: this.currentTokens,
        budget: this.budget
      });
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    const usage = this.currentTokens / this.budget;
    let status, emoji, color;

    if (usage < 0.5) {
      status = 'green';
      emoji = '🟢';
      color = '\x1b[32m';
    } else if (usage < this.warningThreshold) {
      status = 'yellow';
      emoji = '🟡';
      color = '\x1b[33m';
    } else if (usage < this.criticalThreshold) {
      status = 'orange';
      emoji = '🟠';
      color = '\x1b[38;5;208m';
    } else {
      status = 'critical';
      emoji = '🔴';
      color = '\x1b[31m';
    }

    return {
      status,
      emoji,
      color,
      usage: (usage * 100).toFixed(1),
      current: this.currentTokens,
      budget: this.budget,
      remaining: this.budget - this.currentTokens
    };
  }

  /**
   * Estimate tokens (simplified)
   */
  estimateTokens(content) {
    const words = content.match(/\b\w+\b/g) || [];
    return Math.ceil(words.length * 1.3);
  }

  /**
   * Get recommendations based on current state
   */
  getRecommendations() {
    const recommendations = [];
    const status = this.getStatus();

    if (status.status === 'critical') {
      recommendations.push('🚨 CREATE CHECKPOINT IMMEDIATELY');
      recommendations.push('❌ DO NOT LOAD ANY MORE FILES');
    } else if (status.status === 'orange') {
      recommendations.push('⚠️  Consider creating checkpoint soon');
      recommendations.push('🎯 Load only critical files');
    }

    // Check for unused files
    const unused = [];
    const now = Date.now();
    for (const [file, data] of this.loadedFiles) {
      if (now - data.loadedAt > 300000) { // 5 minutes
        unused.push(path.basename(file));
      }
    }

    if (unused.length > 0) {
      recommendations.push(`💡 Consider unloading unused files: ${unused.join(', ')}`);
    }

    // Check for frequently accessed files
    const frequent = [];
    for (const [file, access] of this.metrics.fileAccess) {
      if (access.count > 3) {
        frequent.push(path.basename(file));
      }
    }

    if (frequent.length > 0) {
      recommendations.push(`📌 Consider caching frequently accessed: ${frequent.join(', ')}`);
    }

    return recommendations;
  }

  /**
   * Generate report
   */
  generateReport() {
    const status = this.getStatus();
    const duration = Math.floor((Date.now() - this.startTime) / 1000);

    console.log('\n' + '='.repeat(80));
    console.log('RUNTIME TOKEN TRACKING REPORT');
    console.log('='.repeat(80));

    // Current Status
    console.log('\n📊 CURRENT STATUS');
    console.log('-'.repeat(40));
    console.log(`Status: ${status.emoji} ${status.status.toUpperCase()} (${status.usage}%)`);
    console.log(`Tokens: ${status.current} / ${status.budget}`);
    console.log(`Remaining: ${status.remaining} tokens`);
    console.log(`Duration: ${duration} seconds`);

    // Loaded Files
    if (this.loadedFiles.size > 0) {
      console.log('\n📁 LOADED FILES');
      console.log('-'.repeat(40));
      for (const [file, data] of this.loadedFiles) {
        const age = Math.floor((Date.now() - data.loadedAt) / 1000);
        console.log(`${path.basename(file).padEnd(30)} ${String(data.tokens).padStart(6)} tokens (${age}s ago)`);
      }
    }

    // Metrics
    console.log('\n📈 METRICS');
    console.log('-'.repeat(40));
    console.log(`Total Loaded: ${this.metrics.totalLoaded} tokens`);
    console.log(`Total Saved: ${this.metrics.totalSaved} tokens`);
    console.log(`Checkpoints: ${this.metrics.checkpoints.length}`);
    console.log(`Alerts: ${this.metrics.alerts.length}`);

    // Checkpoints
    if (this.metrics.checkpoints.length > 0) {
      console.log('\n📍 CHECKPOINTS');
      console.log('-'.repeat(40));
      for (const cp of this.metrics.checkpoints) {
        console.log(`${cp.id}: ${cp.originalTokens} → ${cp.compressedTokens} tokens (${cp.compressionRatio}% saved)`);
      }
    }

    // Recommendations
    const recommendations = this.getRecommendations();
    if (recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS');
      console.log('-'.repeat(40));
      for (const rec of recommendations) {
        console.log(rec);
      }
    }

    console.log('\n' + '='.repeat(80));
  }

  /**
   * Export telemetry data
   */
  exportTelemetry() {
    return {
      session: {
        startTime: this.startTime,
        duration: Date.now() - this.startTime,
        budget: this.budget,
        peakUsage: Math.max(...this.contextHistory.map(h => h.total || 0)),
        checkpoints: this.checkpointCount
      },
      metrics: this.metrics,
      history: this.contextHistory,
      fileAccess: Array.from(this.metrics.fileAccess.entries()).map(([file, access]) => ({
        file: path.basename(file),
        ...access
      }))
    };
  }
}

// Interactive CLI mode
if (require.main === module) {
  const tracker = new TokenTracker({
    budget: parseInt(process.argv[2]) || 5000,
    checkpointThreshold: parseInt(process.argv[3]) || 3000
  });

  console.log('🚀 Token Tracker Started');
  console.log(`Budget: ${tracker.budget} tokens`);
  console.log(`Checkpoint threshold: ${tracker.checkpointThreshold} tokens`);

  // Simulate file loading for demo
  const files = [
    { name: 'core-principles.md', tokens: 1500 },
    { name: 'api-patterns.md', tokens: 1000 },
    { name: 'security-guide.md', tokens: 800 },
    { name: 'testing-strategy.md', tokens: 600 }
  ];

  console.log('\nSimulating file loads...\n');

  for (const file of files) {
    console.log(`Loading ${file.name}...`);
    tracker.loadFile(file.name, 'x'.repeat(file.tokens * 5));

    const status = tracker.getStatus();
    console.log(`  Status: ${status.emoji} ${status.usage}% (${status.current}/${status.budget})`);

    // Pause for effect
    require('child_process').execSync('sleep 1');
  }

  tracker.generateReport();

  // Export telemetry
  const telemetry = tracker.exportTelemetry();
  fs.writeFileSync('token-telemetry.json', JSON.stringify(telemetry, null, 2));
  console.log('\n📊 Telemetry exported to token-telemetry.json');
}

module.exports = TokenTracker;