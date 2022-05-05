import * as sst from '@serverless-stack/resources';

export default class BankingStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { oauth } = props;

    const banking = new sst.NextjsSite(this, 'service-banking', {
      path: 'service-banking',
      environment: {
        NEXT_PUBLIC_AWS_PROJECT_REGION: scope.region,
        NEXT_PUBLIC_OAUTH_APP_URL: oauth.url,
      },
      waitForInvalidation: false,
      disablePlaceholder: true,
    });

    this.addOutputs({
      Service: 'service-banking',
      URL: banking.url,
      OAuthURL: oauth.url,
    });
  }
}
