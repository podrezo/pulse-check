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
  const statusInfo = await ConnectionTester.runTest(config.targetUrl, config.timeoutMs);

  console.log(statusInfo.message);

  // Only send SNS notification if the test result indicates a failure
  if (statusInfo.isFailure) {
    await snsPublisher.publishHealthCheckResult(statusInfo, config.targetUrl);
  }

  return statusInfo.message;
};
