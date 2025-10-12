#!/usr/bin/env node

/**
 * PERFORMANCE TESTING SCRIPT
 * Implements: Educational concepts of scalability testing
 * Purpose: Automated performance validation for sustainability metrics
 * Version: 3.0.0 - Sprint 3 Enhanced
 */

const http = require('http');
const { performance } = require('perf_hooks');

class PerformanceTestSuite {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
        this.results = {
            tests: [],
            summary: {
                totalTests: 0,
                passedTests: 0,
                failedTests: 0,
                averageResponseTime: 0,
                minResponseTime: Infinity,
                maxResponseTime: 0,
                throughput: 0
            }
        };
    }

    /**
     * Execute HTTP request with performance monitoring
     * Implements: Sustainability principle - efficient resource measurement
     */
    async makeRequest(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const startTime = performance.now();
            
            const options = {
                hostname: 'localhost',
                port: 3000,
                path: endpoint,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Performance-Test-Suite/3.0.0'
                }
            };

            const req = http.request(options, (res) => {
                let responseData = '';
                
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                
                res.on('end', () => {
                    const endTime = performance.now();
                    const responseTime = endTime - startTime;
                    
                    resolve({
                        statusCode: res.statusCode,
                        responseTime: responseTime,
                        data: responseData,
                        headers: res.headers
                    });
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }
            
            req.end();
        });
    }

    /**
     * Test individual endpoint performance
     * Implements: Scalability testing methodology
     */
    async testEndpoint(name, endpoint, expectedStatusCode = 200, maxResponseTime = 1000) {
        console.log(`🧪 Testing: ${name}`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
            const result = await this.makeRequest(endpoint);
            
            const test = {
                name: name,
                endpoint: endpoint,
                statusCode: result.statusCode,
                responseTime: result.responseTime,
                success: result.statusCode === expectedStatusCode && result.responseTime <= maxResponseTime,
                timestamp: new Date().toISOString(),
                sustainabilityScore: this.calculateSustainabilityScore(result.responseTime, result.data.length || 0)
            };

            this.results.tests.push(test);
            this.updateSummary(test);

            if (test.success) {
                console.log(`  ✅ PASS - ${result.responseTime.toFixed(2)}ms`);
            } else {
                console.log(`  ❌ FAIL - ${result.responseTime.toFixed(2)}ms (Expected: ${expectedStatusCode}, Got: ${result.statusCode})`);
            }

            return test;
        } catch (error) {
            console.log(`  🚫 ERROR - ${error.message}`);
            const test = {
                name: name,
                endpoint: endpoint,
                error: error.message,
                success: false,
                timestamp: new Date().toISOString()
            };
            this.results.tests.push(test);
            return test;
        }
    }

    /**
     * Calculate sustainability score based on performance
     * Implements: Green IT principles in performance evaluation
     */
    calculateSustainabilityScore(responseTime, dataSize) {
        // Lower response time and efficient data size = higher sustainability
        const timeScore = Math.max(0, 100 - (responseTime / 10));
        const sizeScore = dataSize > 0 ? Math.min(100, 10000 / dataSize) : 50;
        return Math.round((timeScore + sizeScore) / 2);
    }

    /**
     * Update test summary statistics
     */
    updateSummary(test) {
        this.results.summary.totalTests++;
        if (test.success) {
            this.results.summary.passedTests++;
        } else {
            this.results.summary.failedTests++;
        }

        if (test.responseTime) {
            this.results.summary.minResponseTime = Math.min(this.results.summary.minResponseTime, test.responseTime);
            this.results.summary.maxResponseTime = Math.max(this.results.summary.maxResponseTime, test.responseTime);
            
            // Calculate running average
            const totalResponseTime = this.results.tests
                .filter(t => t.responseTime)
                .reduce((sum, t) => sum + t.responseTime, 0);
            this.results.summary.averageResponseTime = totalResponseTime / this.results.tests.filter(t => t.responseTime).length;
        }
    }

    /**
     * Load testing for scalability validation
     * Implements: Concurrent request handling assessment
     */
    async loadTest(endpoint, concurrentRequests = 10, duration = 5000) {
        console.log(`\n🚀 Load Testing: ${endpoint}`);
        console.log(`   Concurrent requests: ${concurrentRequests}`);
        console.log(`   Duration: ${duration}ms`);

        const startTime = performance.now();
        const endTime = startTime + duration;
        let requestCount = 0;
        let successCount = 0;
        const responseTimes = [];

        const makeLoadRequest = async () => {
            while (performance.now() < endTime) {
                try {
                    const result = await this.makeRequest(endpoint);
                    requestCount++;
                    if (result.statusCode === 200) {
                        successCount++;
                    }
                    responseTimes.push(result.responseTime);
                } catch (error) {
                    requestCount++;
                }
                
                // Increased delay to prevent rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        };

        // Run concurrent requests
        const promises = Array(concurrentRequests).fill().map(() => makeLoadRequest());
        await Promise.all(promises);

        const actualDuration = performance.now() - startTime;
        const throughput = (requestCount / actualDuration) * 1000; // requests per second

        console.log(`   📊 Results:`);
        console.log(`     Total requests: ${requestCount}`);
        console.log(`     Successful: ${successCount} (${((successCount/requestCount)*100).toFixed(1)}%)`);
        console.log(`     Throughput: ${throughput.toFixed(2)} req/sec`);
        console.log(`     Avg response time: ${(responseTimes.reduce((a,b) => a+b, 0)/responseTimes.length).toFixed(2)}ms`);

        return {
            totalRequests: requestCount,
            successfulRequests: successCount,
            throughput: throughput,
            averageResponseTime: responseTimes.reduce((a,b) => a+b, 0)/responseTimes.length,
            successRate: (successCount/requestCount)*100
        };
    }

    /**
     * Run comprehensive performance test suite
     * Implements: Complete scalability validation process
     */
    async runFullTestSuite() {
        console.log('🎯 RESTAURANT API PERFORMANCE TEST SUITE');
        console.log('==========================================\n');

        // Core functionality tests
        await this.testEndpoint('Health Check', '/health', 200, 100);
        await this.testEndpoint('Get All Restaurants', '/api/restaurants', 200, 2000);
        await this.testEndpoint('Get Restaurant Stats', '/api/restaurants/stats', 200, 1000);
        await this.testEndpoint('Advanced Search', '/api/restaurants/search/advanced?q=cafe', 200, 1000);
        await this.testEndpoint('Autocomplete Search', '/api/restaurants/search/autocomplete?q=pizza', 200, 500);
        await this.testEndpoint('Nearby Restaurants', '/api/restaurants/nearby?longitude=-73.856077&latitude=40.848447&radius=1000', 200, 1500);
        await this.testEndpoint('Recommendations', '/api/restaurants/recommendations?preferred_cuisines=Italiana&budget_max=500', 200, 1000);
        await this.testEndpoint('Categories Search', '/api/restaurants/categories/Italiana,Mexicana', 200, 1000);

        // Load testing on key endpoints (reduced to avoid rate limiting)
        const loadResults = await this.loadTest('/api/restaurants', 3, 2000);
        this.results.summary.throughput = loadResults.throughput;

        // Generate final report
        this.generateReport();
    }

    /**
     * Generate comprehensive performance report
     * Implements: Sustainability reporting and analysis
     */
    generateReport() {
        console.log('\n📈 PERFORMANCE TEST REPORT');
        console.log('===========================');
        
        console.log(`\n🎯 Test Summary:`);
        console.log(`   Total Tests: ${this.results.summary.totalTests}`);
        console.log(`   Passed: ${this.results.summary.passedTests} ✅`);
        console.log(`   Failed: ${this.results.summary.failedTests} ❌`);
        console.log(`   Success Rate: ${((this.results.summary.passedTests/this.results.summary.totalTests)*100).toFixed(1)}%`);

        console.log(`\n⚡ Performance Metrics:`);
        console.log(`   Average Response Time: ${this.results.summary.averageResponseTime.toFixed(2)}ms`);
        console.log(`   Min Response Time: ${this.results.summary.minResponseTime.toFixed(2)}ms`);
        console.log(`   Max Response Time: ${this.results.summary.maxResponseTime.toFixed(2)}ms`);
        console.log(`   Throughput: ${this.results.summary.throughput.toFixed(2)} req/sec`);

        // Sustainability analysis
        const avgSustainabilityScore = this.results.tests
            .filter(t => t.sustainabilityScore)
            .reduce((sum, t) => sum + t.sustainabilityScore, 0) / this.results.tests.filter(t => t.sustainabilityScore).length;

        console.log(`\n🌱 Sustainability Analysis:`);
        console.log(`   Average Sustainability Score: ${avgSustainabilityScore.toFixed(1)}/100`);
        console.log(`   Green IT Rating: ${this.getSustainabilityRating(avgSustainabilityScore)}`);

        // Performance recommendations
        console.log(`\n🔧 Optimization Recommendations:`);
        if (this.results.summary.averageResponseTime > 1000) {
            console.log(`   ⚠️  High response times detected - consider caching implementation`);
        }
        if (avgSustainabilityScore < 70) {
            console.log(`   ⚠️  Sustainability score below optimal - optimize data transfer`);
        }
        if (this.results.summary.throughput < 10) {
            console.log(`   ⚠️  Low throughput - consider connection pooling optimization`);
        }

        console.log(`\n✨ Test completed at: ${new Date().toISOString()}`);
    }

    /**
     * Get sustainability rating based on score
     */
    getSustainabilityRating(score) {
        if (score >= 90) return 'Excellent 🌟';
        if (score >= 75) return 'Good 🌿';
        if (score >= 60) return 'Fair 🌱';
        return 'Needs Improvement ⚠️';
    }
}

// Execute performance tests if run directly
if (require.main === module) {
    const tester = new PerformanceTestSuite();
    tester.runFullTestSuite().catch(console.error);
}

module.exports = PerformanceTestSuite;