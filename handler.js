const ConnectionTester = require('./test-connection');
const config = require('./config.json');
const SNSPublisher = require('./sns-publisher');

const snsPublisher = new SNSPublisher(config.snsTopicArn);

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
