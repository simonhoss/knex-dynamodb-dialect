"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const SchemaCompiler = require("knex/lib/schema/compiler");
class DynamoDBSchemaCompiler extends SchemaCompiler {
    constructor(...args) {
        super(...arguments);
    }
    renameTable(tableName, to) { }
    // Check whether a table exists on the query.
    hasTable(tableName) {
        this.pushQuery({ output: () => false });
    }
    // Check whether a column exists on the schema.
    hasColumn(tableName, column) { }
}
exports.DynamoDBSchemaCompiler = DynamoDBSchemaCompiler;
