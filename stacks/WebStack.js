import * as sst from '@serverless-stack/resources';

export default class WebStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { auth } = props;

    const site = new sst.NextjsSite(this, 'NextjsSite', {
      path: 'frontend',
      environment: {
        REGION: scope.region,
        NEXT_PUBLIC_AWS_PROJECT_REGION: scope.region,
        NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID:
          auth.cognitoCfnIdentityPool.ref,
        NEXT_PUBLIC_AWS_COGNITO_REGION: scope.region,
        NEXT_PUBLIC_AWS_USER_POOLS_ID: auth.cognitoUserPool.userPoolId,
        NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID:
          auth.cognitoUserPoolClient.userPoolClientId,
        NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY:
          '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
      },
      waitForInvalidation: false,
    });

    site.attachPermissions([]);

    this.addOutputs({
      URL: site.url,
    });
  }
}
