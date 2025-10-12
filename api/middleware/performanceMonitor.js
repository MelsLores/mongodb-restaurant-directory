/**
 * Performance Monitor Middleware
 * Version: 1.0.0
 * Description: Middleware for monitoring API performance and resource usage
 * Implements: Technological Sustainability - Efficient use of resources
 */

const os = require('os');

class PerformanceMonitor {
  
  /**
   * Middleware to track request performance and resource usage
   * Implements Green IT practices by monitoring resource consumption
   */
  static trackPerformance(req, res, next) {
    const startTime = process.hrtime.bigint();
    const startMemory = process.memoryUsage();
    const startCPU = process.cpuUsage();

    // Override res.json to capture response time
    const originalJson = res.json;
    res.json = function(data) {
      const endTime = process.hrtime.bigint();
      const endMemory = process.memoryUsage();
      const endCPU = process.cpuUsage(startCPU);
      
      const responseTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;
      
      // Add performance metrics to response headers (for monitoring)
      res.setHeader('X-Response-Time', `${responseTime.toFixed(2)}ms`);
      res.setHeader('X-Memory-Delta', `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
      res.setHeader('X-CPU-Usage', `${(endCPU.user / 1000).toFixed(2)}ms`);
      
      // Log performance metrics for sustainability monitoring
      console.log(`📊 Performance Metrics:`, {
        method: req.method,
        url: req.originalUrl,
        responseTime: `${responseTime.toFixed(2)}ms`,
        memoryDelta: `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`,
        cpuTime: `${(endCPU.user / 1000).toFixed(2)}ms`,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString()
      });
      
      // Add sustainability metrics to response for transparency
      if (data && typeof data === 'object') {
        data.performance_metrics = {
          response_time_ms: parseFloat(responseTime.toFixed(2)),
          memory_delta_mb: parseFloat((memoryDelta / 1024 / 1024).toFixed(2)),
          cpu_time_ms: parseFloat((endCPU.user / 1000).toFixed(2)),
          sustainable_practices: "Optimized queries, efficient resource usage"
        };
      }
      
      return originalJson.call(this, data);
    };

    next();
  }

  /**
   * System health check with sustainability metrics
   * Monitors resource usage for Green IT practices
   */
  static getSystemHealth() {
    const memory = process.memoryUsage();
    const uptime = process.uptime();
    const cpuUsage = process.cpuUsage();
    const systemMemory = {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem()
    };

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime_seconds: uptime,
      memory: {
        heap_used_mb: parseFloat((memory.heapUsed / 1024 / 1024).toFixed(2)),
        heap_total_mb: parseFloat((memory.heapTotal / 1024 / 1024).toFixed(2)),
        external_mb: parseFloat((memory.external / 1024 / 1024).toFixed(2)),
        rss_mb: parseFloat((memory.rss / 1024 / 1024).toFixed(2))
      },
      system_memory: {
        total_gb: parseFloat((systemMemory.total / 1024 / 1024 / 1024).toFixed(2)),
        free_gb: parseFloat((systemMemory.free / 1024 / 1024 / 1024).toFixed(2)),
        usage_percentage: parseFloat(((systemMemory.used / systemMemory.total) * 100).toFixed(2))
      },
      cpu: {
        user_ms: parseFloat((cpuUsage.user / 1000).toFixed(2)),
        system_ms: parseFloat((cpuUsage.system / 1000).toFixed(2))
      },
      sustainability_score: this.calculateSustainabilityScore(memory, systemMemory),
      green_it_practices: [
        "Efficient query optimization",
        "Memory usage monitoring", 
        "Resource-conscious API design",
        "Performance tracking for optimization"
      ]
    };
  }

  /**
   * Calculate sustainability score based on resource usage
   * Implements: Efficient use of resources principle
   */
  static calculateSustainabilityScore(processMemory, systemMemory) {
    const memoryEfficiency = 100 - ((processMemory.heapUsed / processMemory.heapTotal) * 100);
    const systemEfficiency = 100 - ((systemMemory.used / systemMemory.total) * 100);
    const averageEfficiency = (memoryEfficiency + systemEfficiency) / 2;
    
    let score = 'excellent';
    if (averageEfficiency < 30) score = 'needs_optimization';
    else if (averageEfficiency < 60) score = 'good';
    else if (averageEfficiency < 80) score = 'very_good';
    
    return {
      score: score,
      efficiency_percentage: parseFloat(averageEfficiency.toFixed(2)),
      recommendations: this.getSustainabilityRecommendations(averageEfficiency)
    };
  }

  /**
   * Provide sustainability recommendations based on current usage
   */
  static getSustainabilityRecommendations(efficiency) {
    if (efficiency < 30) {
      return [
        "Consider implementing caching strategies",
        "Optimize database queries", 
        "Review memory leaks",
        "Implement connection pooling"
      ];
    } else if (efficiency < 60) {
      return [
        "Monitor query performance",
        "Consider implementing pagination",
        "Review resource allocation"
      ];
    } else {
      return [
        "Excellent resource efficiency",
        "Consider sharing best practices",
        "Monitor for future optimization opportunities"
      ];
    }
  }
}

module.exports = PerformanceMonitor;