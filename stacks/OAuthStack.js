import * as sst from '@serverless-stack/resources';

export default class OAuthStack extends sst.Stack {
  oauth;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { cognito } = props;

    this.oauth = new sst.NextjsSite(this, 'service-oauth', {
      path: 'service-oauth',
      environment: {
        NEXT_PUBLIC_AWS_PROJECT_REGION: scope.region,
        NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID:
          cognito.cognitoCfnIdentityPool.ref,
        NEXT_PUBLIC_AWS_COGNITO_REGION: scope.region,
        NEXT_PUBLIC_AWS_USER_POOLS_ID: cognito.cognitoUserPool.userPoolId,
        NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID:
          cognito.cognitoUserPoolClient.userPoolClientId,
        NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY:
          '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
      },
      waitForInvalidation: false,
    });

    this.addOutputs({
      Service: 'service-oauth',
      URL: this.oauth.url,
    });
  }
}
