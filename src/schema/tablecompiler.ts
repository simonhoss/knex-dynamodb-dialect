// @ts-ignore
import * as TableCompiler from "knex/lib/schema/tablecompiler";

export class DynamoDBTableCompiler extends (TableCompiler as any) {
  constructor(...args: any[]) {
    super(...arguments);
  }

  create() {
    const prefix = (this as any).client.connectionSettings.prefix;
    const tableName = prefix + (this as any).tableBuilder._tableName;
    const dynamodb = (this as any).client.driver;
    this.pushQuery({
      dynamodb: {
        exec: (cb: (err: any, data?: any) => void) => {
          dynamodb.createTable(
            {
              TableName: tableName,
              KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
              AttributeDefinitions: [
                { AttributeName: "id", AttributeType: "S" }
              ],
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              }
            },
            (err: any, data: any) => {
              if (err && err.code !== "ResourceInUseException") {
                cb(err);
                return;
              }
              cb(null, data);
            }
          );
        }
      }
    });
  }

  alter() {
    throw new Error("Alter table is currently not supported");
  }
}
