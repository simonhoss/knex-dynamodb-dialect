import * as Promise from "bluebird";
// @ts-ignore
import * as Client from "knex/lib/client";
import { DynamoDBQueryCompiler } from "./query/compiler";
import { DynamoDBColumnCompiler } from "./schema/columncompiler";
import { DynamoDBSchemaCompiler } from "./schema/compiler";
import { DynamoDBTableCompiler } from "./schema/tablecompiler";
import DynamoDBTransaction from "./transaction";

export class DynamoDBDialect extends (Client as any) {
  //   public dialect = "dynamodb";
  //   public driverName = "dynamodb";

  public get dialect() {
    return "dynamodb";
  }

  public get driverName() {
    return "dynamodb";
  }

  _driver() {
    const { DynamoDB } = require("aws-sdk");
    return new DynamoDB();
  }

  test() {
    return "yo";
  }

  query(connection: any, obj: any) {
    if (obj.dynamodb) {
      return new Promise(resolve => {
        obj.dynamodb.exec((err: any, res: any) => {
          if (err && err.code !== "ResourceInUseException") {
            throw new Error(err);
          }
          if (res && res.Items) {
            resolve({ Items: res.Items.map((item: any) => item.attrs) });
            return;
          }
          resolve(res);
        });
      });
    } else if (obj.executeAsync) {
      return obj.executeAsync();
    }

    return Promise.resolve(obj);
  }

  queryCompiler() {
    return new DynamoDBQueryCompiler(this, ...arguments);
  }

  schemaCompiler() {
    return new DynamoDBSchemaCompiler(this, ...arguments);
  }

  tableCompiler() {
    return new DynamoDBTableCompiler(this, ...arguments);
  }

  columnCompiler() {
    return new DynamoDBColumnCompiler(this, ...arguments);
  }

  transaction() {
    return new DynamoDBTransaction(this, ...arguments);
  }

  acquireRawConnection() {
    if (
      (this.connectionSettings as any).region &&
      (this.connectionSettings as any).endpoint
    ) {
      (this as any).driver.config.region = (this
        .connectionSettings as any).region;
      (this as any).driver.config.endpoint = (this
        .connectionSettings as any).endpoint;
      (this as any).driver.setEndpoint(
        (this.connectionSettings as any).endpoint
      );
    }
    return Promise.resolve((this as any).driver) as any;
  }

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  destroyRawConnection(connection: any) {
    throw new Error("destroyRawConnection not implemented");
    return Promise.resolve() as any;
  }

  processResponse(obj: any, runner: any) {
    if (obj == null) return;

    if (obj.output) return obj.output.call();
    if (obj.execute) return obj.execute();
    if (obj.Items) {
      return obj.Items;
    }
    if (obj.TableDescription) {
      return;
    }
    throw new Error("processResponse");
  }

  canCancelQuery = false;
}
