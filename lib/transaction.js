"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
// @ts-ignore
const Transaction = require("knex/lib/transaction");
class DynamoDBTransaction extends Transaction {
    constructor(...args) {
        super(...arguments);
    }
    savepoint(conn) {
        this.trxClient.logger("Dynamodb does not support savepoints.");
        return Promise.resolve();
    }
    release(conn, value) {
        this.trxClient.logger("Dynamodb does not support savepoints.");
        return Promise.resolve();
    }
    rollbackTo(conn, error) {
        this.trxClient.logger("Dynamodb does not support savepoints.");
        return Promise.resolve();
    }
}
exports.default = DynamoDBTransaction;
