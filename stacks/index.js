import WebStack from './WebStack';
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

  new WebStack(app, 'web', {
    auth: coreStack.auth,
  });
}
