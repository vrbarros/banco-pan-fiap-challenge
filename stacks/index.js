import OAuthStack from './OAuthStack';
import BankingStack from './BankingStack';
import StorageStack from './StorageStack';
import CoreStack from './CoreStack';

export default function main(app) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x',
  });

  const storageStack = new StorageStack(app, 'storage');

  const coreStack = new CoreStack(app, 'core', {
    table: storageStack.table,
    bucket: storageStack.bucket,
  });

  const oauthStack = new OAuthStack(app, 'service-oauth', {
    cognito: coreStack.cognito,
  });

  new BankingStack(app, 'service-banking', {
    oauth: oauthStack.oauth,
  });
}
