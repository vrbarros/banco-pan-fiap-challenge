import * as sst from '@serverless-stack/resources';

export default class StorageStack extends sst.Stack {
  bucket;
  table;

  constructor(scope, id, props) {
    super(scope, id, props);

    this.bucket = new sst.Bucket(this, 'Uploads');

    this.table = new sst.Table(this, 'Logs', {
      fields: {
        userId: sst.TableFieldType.STRING,
        logId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: 'userId', sortKey: 'logId' },
    });

    this.addOutputs({
      TableName: this.table.tableName,
      BucketArn: this.bucket.bucketArn,
    });
  }
}
