const ConnectionTester = require('./test-connection');
const config = require('./config.json');
const SNSPublisher = require('./sns-publisher');

// Read SNS topic ARN from environment variable instead of config
const snsTopicArn = process.env.SNS_TOPIC_ARN;
if (!snsTopicArn) {
  throw new Error('SNS_TOPIC_ARN environment variable is not set');
}

const snsPublisher = new SNSPublisher(snsTopicArn);

exports.run = async () => {
  try {
    const result = await ConnectionTester.test(config.targetUrl, config.timeoutMs);

    const message = ConnectionTester.generateStatusMessage(result, config.targetUrl);
    console.log(message);

    await snsPublisher.publishHealthCheckResult(result, config.targetUrl);

    return message;

  } catch (error) {
    const message = ConnectionTester.generateStatusMessage(error, config.targetUrl);
    console.log(message);

    await snsPublisher.publishHealthCheckResult(error, config.targetUrl);

    return message;
  }
};
