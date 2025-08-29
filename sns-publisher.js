const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

class SNSPublisher {
  constructor(topicArn) {
    this.topicArn = topicArn;
    this.snsClient = new SNSClient();
  }

  async publishMessage(message, result) {
    try {
      const params = {
        Message: message,
        TopicArn: this.topicArn,
        MessageAttributes: {
          'Status': {
            DataType: 'String',
            StringValue: result.success ? 'SUCCESS' : 'FAILED'
          },
          'Duration': {
            DataType: 'Number',
            StringValue: result.duration ? result.duration.toString() : '0'
          },
          'Timestamp': {
            DataType: 'String',
            StringValue: new Date().toISOString()
          }
        }
      };

      const command = new PublishCommand(params);
      const snsResult = await this.snsClient.send(command);
      return snsResult;
    } catch (error) {
      throw error;
    }
  }

  async publishHealthCheckResult(result, targetUrl) {
    const message = this.generateStatusMessage(result, targetUrl);
    return await this.publishMessage(message, result);
  }

  generateStatusMessage(result, targetUrl) {
    if (result.success) {
      if (result.statusCode === 200) {
        return `SUCCESS: HTTP ${result.statusCode} in ${result.duration}ms for ${targetUrl}`;
      } else {
        return `UNEXPECTED: HTTP ${result.statusCode} in ${result.duration}ms for ${targetUrl}`;
      }
    } else {
      return `FAILED: ${result.error} in ${result.duration}ms for ${targetUrl}`;
    }
  }
}

module.exports = SNSPublisher;
