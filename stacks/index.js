import ApiStack from './ApiStack';
import FrontendStack from './FrontendStack';
import StorageStack from './StorageStack';
import AuthStack from './AuthStack';

export default function main(app) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x',
  });

  const storageStack = new StorageStack(app, 'storage');

  const apiStack = new ApiStack(app, 'api', {
    table: storageStack.table,
  });

  const authStack = new AuthStack(app, 'auth', {
    api: apiStack.api,
    bucket: storageStack.bucket,
  });

  new FrontendStack(app, 'frontend', {
    api: apiStack.api,
    auth: authStack.auth,
    bucket: storageStack.bucket,
  });
}
