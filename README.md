# PulseCheck

A serverless AWS Lambda function that runs every 10 minutes to check the pulse/health of your services or systems.

## What is PulseCheck?

PulseCheck is a lightweight, cost-effective monitoring solution built with AWS Lambda and the Serverless Framework. It automatically executes every 10 minutes to perform health checks, status monitoring, or any other periodic tasks you need.

## How it works

The project consists of:

- **`handler.js`** - The main Lambda function that contains your business logic
- **`serverless.yml`** - Serverless Framework configuration for AWS deployment
- **`config.json`** - Configuration file for your application settings
- **`test-connection.js`** - Local testing utility

## Architecture

- **Function Name**: `checkPulse`
- **Runtime**: Node.js 20.x
- **Memory**: 128 MB (minimum for cost optimization)
- **Timeout**: 11 seconds
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

4. Update `config.json` with your specific configuration

### Deployment

Deploy to AWS:

```bash
serverless deploy
```

### Testing Locally

You can test the Lambda function locally using the AWS CLI:

```bash
aws lambda invoke --function-name PulseCheck-dev-checkPulse --payload '{}' /dev/stdout
```

This command will invoke the deployed Lambda function and output the result directly to your terminal.

## Configuration

Edit `config.json` to customize your pulse check behavior:

```json
{
  "targetUrl": "https://podrezo.com/",
  "timeoutMs": 10000
}

```
