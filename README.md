# PulseCheck

A serverless AWS Lambda function that runs every 10 minutes to check the pulse/health of your services or systems.

## What is PulseCheck?

PulseCheck is a lightweight, cost-effective monitoring solution built with AWS Lambda and the Serverless Framework. It automatically executes every 10 minutes to perform health checks, status monitoring, or any other periodic tasks you need.

## How it works

The project consists of:

- **`handler.js`** - The entry point for the Lambda function
- **`serverless.yml`** - Serverless Framework configuration for AWS deployment
- **`test-connection.js`** - The HTTP connection tester
- **`sns-publisher.js`** - SNS notification service for health check results

## SNS Notifications

PulseCheck automatically publishes health check results to Amazon SNS (Simple Notification Service), providing real-time alerts and monitoring capabilities.

Every time the Lambda function runs (every 10 minutes), if it detects any problem it automatically publishes the health check result to your configured SNS topic.

## Architecture

- **Function Name**: `checkPulse`
- **Runtime**: Node.js 20.x
- **Memory**: 128 MB (minimum for cost optimization)
- **Timeout**: 11 seconds (HTTP Request timeout will be ~1 second less than the timeout of the function)
- **Schedule**: Runs every 10 minutes using AWS EventBridge
- **Trigger**: CloudWatch Events rule with cron expression

## Getting Started

### Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 20.x or later
- Serverless Framework installed globally

### Installation

1. Clone the repository
2. Install dependencies (if any):

   ```bash
   npm install
   ```

3. Configure your AWS credentials:

   ```bash
   aws configure
   ```

4. Set up your environment variables (see Configuration section below)

### Deployment

**Important**: Make sure you have set the required environment variables before deploying. These variables will be automatically injected into the Lambda function's environment.

Deploy to AWS:

```bash
# Set environment variables
export SNS_TOPIC_ARN="arn:aws:sns:us-east-1:YOUR_ACCOUNT_ID:YOUR_TOPIC_NAME"
export TARGET_URL="https://your-service.com/"

# Deploy
serverless deploy
```

Or deploy with environment variables inline:

```bash
SNS_TOPIC_ARN="arn:aws:sns:us-east-1:YOUR_ACCOUNT_ID:YOUR_TOPIC_NAME" TARGET_URL="https://your-service.com/" serverless deploy
```

### Testing Locally

You can test the Lambda function locally using the AWS CLI:

```bash
aws lambda invoke --function-name PulseCheck-dev-checkPulse --payload '{"targetUrl": "https://your-service.com/"}' /dev/stdout
```

This command will invoke the deployed Lambda function with a test payload and output the result directly to your terminal. The `targetUrl` in the payload should match the URL you want to test.

## Configuration

### Environment Variables

The following environment variables are automatically configured in `serverless.yml` and will be injected into your Lambda function. Before deploying, you need to set these environment variables:

**Required:**

```bash
export SNS_TOPIC_ARN="arn:aws:sns:us-east-1:YOUR_ACCOUNT_ID:YOUR_TOPIC_NAME"
export TARGET_URL="https://your-service.com/"
```

**Note**: The `TARGET_URL` environment variable is used during deployment to configure the scheduled event payload that triggers the Lambda function every 10 minutes. This URL becomes the `targetUrl` field in the event payload that the Lambda function receives.

Or create a `.env` file (not tracked in git) with:

```bash
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:YOUR_ACCOUNT_ID:YOUR_TOPIC_NAME
TARGET_URL=https://your-service.com/
```

## Monitoring and Alerting

### Real-Time Health Monitoring

PulseCheck provides comprehensive monitoring with automatic alerting:

- **Continuous Monitoring**: Runs every 10 minutes to ensure your services stay healthy
- **Instant Alerts**: Get notified immediately when issues are detected
- **Performance Tracking**: Monitor response times and identify performance degradation
- **Historical Data**: CloudWatch logs provide a complete audit trail of all health checks

### Alert Scenarios

You'll receive SNS notifications for:

- **Service Down**: Connection refused, DNS failures, or network timeouts
- **Slow Response**: Services taking longer than your configured timeout
- **Error Responses**: HTTP status codes other than 200
- **Configuration Issues**: Invalid URLs or misconfigured endpoints

### Best Practices for SNS Setup

1. **Create Multiple Subscriptions**: Set up different notification channels for different teams
2. **Use Email for Critical Alerts**: Ensure on-call engineers get immediate notifications
3. **Configure SMS for Urgent Issues**: Get text messages for severe outages
4. **Set Up Webhooks**: Integrate with your existing monitoring tools (PagerDuty, Slack, etc.)
5. **Monitor SNS Delivery**: Set up CloudWatch alarms to ensure SNS messages are being delivered
