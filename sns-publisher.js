const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

class SNSPublisher {
  constructor(topicArn) {
    this.topicArn = topicArn;
    this.snsClient = new SNSClient();
  }

  async publishMessage(message) {
    try {
      const params = {
        Message: message,
        TopicArn: this.topicArn,
      };

      const command = new PublishCommand(params);
      const snsResult = await this.snsClient.send(command);
      return snsResult;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SNSPublisher;
