"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const ColumnCompiler = require("knex/lib/schema/tablecompiler");
class DynamoDBColumnCompiler extends ColumnCompiler {
    constructor(...args) {
        super(...arguments);
    }
}
exports.DynamoDBColumnCompiler = DynamoDBColumnCompiler;
