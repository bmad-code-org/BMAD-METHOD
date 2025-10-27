/**
 * Memory Profiler - Track memory usage during installation
 * Helps identify memory leaks and optimize resource usage
 */

const v8 = require('node:v8');

class MemoryProfiler {
  constructor() {
    this.checkpoints = [];
    this.startTime = Date.now();
    this.peakMemory = 0;
  }

  /**
   * Create a memory checkpoint
   * @param {string} label - Label for this checkpoint
   */
  checkpoint(label) {
    const memUsage = process.memoryUsage();
    const heapStats = v8.getHeapStatistics();

    const checkpoint = {
      label,
      timestamp: Date.now() - this.startTime,
      memory: {
        rss: this.formatBytes(memUsage.rss),
        heapTotal: this.formatBytes(memUsage.heapTotal),
        heapUsed: this.formatBytes(memUsage.heapUsed),
        external: this.formatBytes(memUsage.external),
        arrayBuffers: this.formatBytes(memUsage.arrayBuffers || 0),
      },
      heap: {
        totalHeapSize: this.formatBytes(heapStats.total_heap_size),
        usedHeapSize: this.formatBytes(heapStats.used_heap_size),
        heapSizeLimit: this.formatBytes(heapStats.heap_size_limit),
        mallocedMemory: this.formatBytes(heapStats.malloced_memory),
        externalMemory: this.formatBytes(heapStats.external_memory),
      },
      raw: {
        heapUsed: memUsage.heapUsed,
      },
    };

    // Track peak memory
    if (memUsage.heapUsed > this.peakMemory) {
      this.peakMemory = memUsage.heapUsed;
    }

    this.checkpoints.push(checkpoint);
    return checkpoint;
  }

  /**
   * Force garbage collection (requires --expose-gc flag)
   */
  forceGC() {
    if (globalThis.gc) {
      globalThis.gc();
      return true;
    }
    return false;
  }

  /**
   * Get memory usage summary
   */
  getSummary() {
    const currentMemory = process.memoryUsage();

    return {
      currentUsage: {
        rss: this.formatBytes(currentMemory.rss),
        heapTotal: this.formatBytes(currentMemory.heapTotal),
        heapUsed: this.formatBytes(currentMemory.heapUsed),
      },
      peakMemory: this.formatBytes(this.peakMemory),
      totalCheckpoints: this.checkpoints.length,
      runTime: `${((Date.now() - this.startTime) / 1000).toFixed(2)}s`,
    };
  }

  /**
   * Get detailed report of memory usage
   */
  getDetailedReport() {
    const summary = this.getSummary();
    const memoryGrowth = this.calculateMemoryGrowth();

    return {
      summary,
      memoryGrowth,
      checkpoints: this.checkpoints,
      recommendations: this.getRecommendations(memoryGrowth),
    };
  }

  /**
   * Calculate memory growth between checkpoints
   */
  calculateMemoryGrowth() {
    if (this.checkpoints.length < 2) return [];

    const growth = [];
    for (let index = 1; index < this.checkpoints.length; index++) {
      const previous = this.checkpoints[index - 1];
      const current = this.checkpoints[index];

      const heapDiff = current.raw.heapUsed - previous.raw.heapUsed;

      growth.push({
        from: previous.label,
        to: current.label,
        heapGrowth: this.formatBytes(Math.abs(heapDiff)),
        isIncrease: heapDiff > 0,
        timeDiff: `${((current.timestamp - previous.timestamp) / 1000).toFixed(2)}s`,
      });
    }

    return growth;
  }

  /**
   * Get recommendations based on memory usage
   */
  getRecommendations(memoryGrowth) {
    const recommendations = [];

    // Check for large memory growth
    const largeGrowths = memoryGrowth.filter((g) => {
      const bytes = this.parseBytes(g.heapGrowth);
      return bytes > 50 * 1024 * 1024; // 50MB
    });

    if (largeGrowths.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `Large memory growth detected in ${largeGrowths.length} operations`,
        details: largeGrowths.map((g) => `${g.from} → ${g.to}: ${g.heapGrowth}`),
      });
    }

    // Check peak memory
    if (this.peakMemory > 500 * 1024 * 1024) {
      // 500MB
      recommendations.push({
        type: 'warning',
        message: `High peak memory usage: ${this.formatBytes(this.peakMemory)}`,
        suggestion: 'Consider processing files in smaller batches',
      });
    }

    // Check for potential memory leaks
    const continuousGrowth = this.checkContinuousGrowth();
    if (continuousGrowth) {
      recommendations.push({
        type: 'error',
        message: 'Potential memory leak detected',
        details: 'Memory usage continuously increases without significant decreases',
      });
    }

    return recommendations;
  }

  /**
   * Check for continuous memory growth (potential leak)
   */
  checkContinuousGrowth() {
    if (this.checkpoints.length < 5) return false;

    let increasingCount = 0;
    for (let index = 1; index < this.checkpoints.length; index++) {
      if (this.checkpoints[index].raw.heapUsed > this.checkpoints[index - 1].raw.heapUsed) {
        increasingCount++;
      }
    }

    // If memory increases in more than 80% of checkpoints, might be a leak
    return increasingCount / (this.checkpoints.length - 1) > 0.8;
  }

  /**
   * Format bytes to human-readable string
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes) / Math.log(k));

    return Number.parseFloat((bytes / Math.pow(k, index)).toFixed(2)) + ' ' + sizes[index];
  }

  /**
   * Parse human-readable bytes back to number
   */
  parseBytes(string_) {
    const match = string_.match(/^([\d.]+)\s*([KMGT]?B?)$/i);
    if (!match) return 0;

    const value = Number.parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    const multipliers = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    };

    return value * (multipliers[unit] || 1);
  }

  /**
   * Clear checkpoints to free memory
   */
  clear() {
    this.checkpoints = [];
  }
}

// Export singleton instance
module.exports = new MemoryProfiler();
