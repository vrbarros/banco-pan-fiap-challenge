# Getting Started with Serverless Stack (SST)

This project was bootstrapped with [Create Serverless Stack](https://docs.serverless-stack.com/packages/create-serverless-stack).

Start by installing the dependencies.

```bash
$ yarn
```

## AWS

Create a new profile in your AWS CLI, using: `aws configure --profile banco-pan-fiap-challenge` setting up your Access Key and Access Secret. Your IAM user must have `AdministratorAccess` policy attached.

## Commands

### `AWS_PROFILE=banco-pan-fiap-challenge npx sst start`

Starts the development environment in AWS.

### `AWS_PROFILE=banco-pan-fiap-challenge npx sst deploy`

Build your app and deploy the Next.js application.

## Scope

- Code-managed project infrastructure
- Using AWS Cognito and AWS Amplify for Authentication
- Password security with requirements:
  - `minLength: 6`
  - `requireLowercase: true`
  - `requireUppercase: true`
  - `requireDigits: false`
  - `requireSymbols: false`
  - Encrypted password
- Form validation by reCAPTCHA
- Password recovery and reset (with code verification)

## Documentation

Learn more about the Serverless Stack.

- [Docs](https://docs.serverless-stack.com)
- [@serverless-stack/cli](https://docs.serverless-stack.com/packages/cli)
- [@serverless-stack/resources](https://docs.serverless-stack.com/packages/resources)
