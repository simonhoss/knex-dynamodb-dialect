// @ts-ignore
import * as SchemaCompiler from "knex/lib/schema/compiler";

export class DynamoDBSchemaCompiler extends (SchemaCompiler as any) {
  constructor(...args: any[]) {
    super(...arguments);
  }

  renameTable(tableName: string, to: string) {}

  // Check whether a table exists on the query.
  hasTable(tableName: string) {
    this.pushQuery({ output: () => false });
  }

  // Check whether a column exists on the schema.
  hasColumn(tableName: string, column: string) {}
}
