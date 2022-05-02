import * as iam from 'aws-cdk-lib/aws-iam';
import * as sst from '@serverless-stack/resources';
import { BooleanAttribute, Mfa } from 'aws-cdk-lib/aws-cognito';

export default class AuthStack extends sst.Stack {
  auth;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { api, bucket } = props;

    this.auth = new sst.Auth(this, 'Auth', {
      cognito: {
        userPool: {
          signInAliases: { email: true },
          customAttributes: {
            isBlocked: new BooleanAttribute({ mutable: true }),
          },
          mfa: Mfa.OPTIONAL,
          mfaSecondFactor: { sms: true, otp: false },
          passwordPolicy: {
            minLength: 6,
            requireLowercase: false,
            requireUppercase: false,
            requireDigits: false,
            requireSymbols: false,
          },
        },
      },
    });

    this.auth.attachPermissionsForAuthUsers([
      api,
      new iam.PolicyStatement({
        actions: ['s3:*'],
        effect: iam.Effect.ALLOW,
        resources: [
          bucket.bucketArn + '/private/${cognito-identity.amazonaws.com:sub}/*',
        ],
      }),
    ]);

    this.addOutputs({
      Region: scope.region,
      UserPoolId: this.auth.cognitoUserPool.userPoolId,
      IdentityPoolId: this.auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: this.auth.cognitoUserPoolClient.userPoolClientId,
    });
  }
}
