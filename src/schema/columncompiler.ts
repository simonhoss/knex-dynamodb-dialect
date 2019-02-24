// @ts-ignore
import * as ColumnCompiler from "knex/lib/schema/tablecompiler";

export class DynamoDBColumnCompiler extends (ColumnCompiler as any) {
  constructor(...args: any[]) {
    super(...arguments);
  }
}
