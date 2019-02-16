// @ts-ignore
import * as Transaction from "knex/lib/transaction";

export default class DynamoDBTransaction extends (Transaction as any) {
  constructor(...args: any[]) {
    super(...arguments);
  }

  savepoint(conn: any) {
    this.trxClient.logger("Dynamodb does not support savepoints.");
    return Promise.resolve();
  }

  release(conn: any, value: any) {
    this.trxClient.logger("Dynamodb does not support savepoints.");
    return Promise.resolve();
  }

  rollbackTo(conn: any, error: any) {
    this.trxClient.logger("Dynamodb does not support savepoints.");
    return Promise.resolve();
  }
}
