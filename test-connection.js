const https = require('https');
const url = require('url');

class ConnectionTester {
  constructor(targetUrl, timeoutMs = 10000) {
    this.targetUrl = targetUrl;
    this.timeoutMs = timeoutMs;
    this.startTime = null;
    this.operationTimeout = null;
  }

  async testConnection() {
    return new Promise((resolve, reject) => {
      this.startTime = Date.now();

      // Parse the URL to get hostname and path
      const parsedUrl = url.parse(this.targetUrl);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.path || '/',
        method: 'GET',
        timeout: this.timeoutMs,
        rejectUnauthorized: false, // Allow self-signed certificates for testing
        headers: {
          'User-Agent': 'PulseCheck'
        }
      };

      const req = https.request(options, (res) => {
        const endTime = Date.now();
        const duration = endTime - this.startTime;

        // Read and log response body (optional)
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (this.operationTimeout) {
            clearTimeout(this.operationTimeout);
          }

          resolve({
            success: true,
            statusCode: res.statusCode,
            duration: duration,
            responseLength: data.length,
            headers: res.headers
          });
        });
      });

      req.on('error', (error) => {
        const endTime = Date.now();
        const duration = endTime - this.startTime;

        if (this.operationTimeout) {
          clearTimeout(this.operationTimeout);
        }

        reject({
          success: false,
          error: error.message,
          errorCode: error.code,
          duration: duration
        });
      });

      req.on('timeout', () => {
        const endTime = Date.now();
        const duration = endTime - this.startTime;

        req.destroy(); // Close the request

        if (this.operationTimeout) {
          clearTimeout(this.operationTimeout);
        }

        reject({
          success: false,
          error: 'Connection timed out',
          errorCode: 'TIMEOUT',
          duration: duration
        });
      });

      // Set a timeout for the entire operation
      this.operationTimeout = setTimeout(() => {
        const endTime = Date.now();
        const duration = endTime - this.startTime;

        req.destroy();

        reject({
          success: false,
          error: 'Operation timeout',
          errorCode: 'OPERATION_TIMEOUT',
          duration: duration
        });
      }, this.timeoutMs + 1000); // Add 1 second buffer

      req.on('response', () => {
        // Clear the operation timeout if we get a response
        if (this.operationTimeout) {
          clearTimeout(this.operationTimeout);
        }
      });

      req.on('error', () => {
        // Clear the operation timeout if we get an error
        if (this.operationTimeout) {
          clearTimeout(this.operationTimeout);
        }
      });

      // Send the request
      req.end();
    });
  }

  // Static method for quick testing
  static async test(url, timeout = 10000) {
    const tester = new ConnectionTester(url, timeout);
    return await tester.testConnection();
  }

  // Generate status message string based on test result
  static generateStatusMessage(result, url) {
    if (result.success) {
      if (result.statusCode === 200) {
        return {
          message: `SUCCESS: HTTP ${result.statusCode} in ${result.duration}ms for ${url}`,
          isFailure: false
        };
      } else {
        return {
          message: `UNEXPECTED: HTTP ${result.statusCode} in ${result.duration}ms for ${url}`,
          isFailure: true
        };
      }
    } else {
      return {
        message: `FAILED: ${result.error} in ${result.duration}ms for ${url}`,
        isFailure: true
      };
    }
  }

  // Run the complete test with error handling
  static async runTest(url, timeout = 10000) {
    try {
      const result = await this.test(url, timeout);
      return this.generateStatusMessage(result, url);
    } catch (error) {
      return this.generateStatusMessage(error, url);
    }
  }
}

// Export the class for use in other modules
module.exports = ConnectionTester;
