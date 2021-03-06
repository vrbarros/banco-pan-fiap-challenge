import * as sst from '@serverless-stack/resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import {
  BooleanAttribute,
  Mfa,
  AccountRecovery,
} from 'aws-cdk-lib/aws-cognito';

export default class CoreStack extends sst.Stack {
  cognito;
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { table, bucket } = props;

    this.cognito = new sst.Auth(this, 'Auth', {
      cognito: {
        userPool: {
          signInAliases: { email: true },
          customAttributes: {
            isBlocked: new BooleanAttribute({ mutable: true }),
          },
          mfa: Mfa.REQUIRED,
          mfaSecondFactor: { sms: true, otp: false },
          passwordPolicy: {
            minLength: 6,
            requireLowercase: false,
            requireUppercase: false,
            requireDigits: false,
            requireSymbols: false,
          },
          accountRecovery: AccountRecovery.EMAIL_ONLY,
        },
      },
    });

    this.addOutputs({
      Region: scope.region,
      UserPoolId: this.cognito.cognitoUserPool.userPoolId,
      IdentityPoolId: this.cognito.cognitoCfnIdentityPool.ref,
      UserPoolClientId: this.cognito.cognitoUserPoolClient.userPoolClientId,
    });

    this.api = new sst.Api(this, 'Api', {
      defaultAuthorizationType: 'AWS_IAM',
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      routes: {
        'POST   /logs': 'src/logs/create.main',
        'GET    /logs': 'src/logs/list.main',
        'GET    /logs/{id}': 'src/logs/get.main',
      },
    });

    this.api.attachPermissions([table]);

    this.addOutputs({
      ApiEndpoint: this.api.url,
    });

    this.cognito.attachPermissionsForAuthUsers([
      this.api,
      new iam.PolicyStatement({
        actions: ['s3:*'],
        effect: iam.Effect.ALLOW,
        resources: [
          bucket.bucketArn + '/private/${cognito-identity.amazonaws.com:sub}/*',
        ],
      }),
    ]);
  }
}
