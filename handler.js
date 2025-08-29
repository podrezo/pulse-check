const ConnectionTester = require('./test-connection');
const config = require('./config.json');

exports.run = async () => {
  try {
    const result = await ConnectionTester.test(config.targetUrl, config.timeoutMs);

    const message = ConnectionTester.generateStatusMessage(result);
    console.log(message);
    return message;

  } catch (error) {
    const message = ConnectionTester.generateStatusMessage(error);
    console.log(message);
    return message;
  }
};
