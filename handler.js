const ConnectionTester = require('./test-connection');
const SNSPublisher = require('./sns-publisher');

// Read SNS topic ARN from environment variable
const snsTopicArn = process.env.SNS_TOPIC_ARN;

if (!snsTopicArn) {
  throw new Error('SNS_TOPIC_ARN environment variable is not set');
}

const snsPublisher = new SNSPublisher(snsTopicArn);

exports.run = async (event, context) => {
  const remainingTimeMs = context.getRemainingTimeInMillis();
  const timeoutMs = remainingTimeMs - 1000;
  // Read target URL from event payload
  const targetUrl = event.targetUrl;

  if (!targetUrl) {
    throw new Error('targetUrl is required in the event payload');
  }

  const statusInfo = await ConnectionTester.runTest(targetUrl, timeoutMs);

  console.log(statusInfo.message);

  // Only send SNS notification if the test result indicates a failure
  if (statusInfo.isFailure) {
    await snsPublisher.publishMessage(statusInfo.message);
  }

  return statusInfo.message;
};
