import * as sst from '@serverless-stack/resources';

export default class ApiStack extends sst.Stack {
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { table } = props;

    this.api = new sst.Api(this, 'Api', {
      defaultAuthorizationType: 'AWS_IAM',
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      routes: {
        'POST   /logs': 'src/create.main',
        'GET    /logs': 'src/list.main',
        'GET    /logs/{id}': 'src/get.main',
      },
    });

    this.api.attachPermissions([table]);

    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}
