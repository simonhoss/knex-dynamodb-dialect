"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const TableCompiler = require("knex/lib/schema/tablecompiler");
class DynamoDBTableCompiler extends TableCompiler {
    constructor(...args) {
        super(...arguments);
    }
    create() {
        const prefix = this.client.connectionSettings.prefix;
        const tableName = prefix + this.tableBuilder._tableName;
        const dynamodb = this.client.driver;
        this.pushQuery({
            dynamodb: {
                exec: (cb) => {
                    dynamodb.createTable({
                        TableName: tableName,
                        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
                        AttributeDefinitions: [
                            { AttributeName: "id", AttributeType: "S" }
                        ],
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 1,
                            WriteCapacityUnits: 1
                        }
                    }, (err, data) => {
                        if (err && err.code !== "ResourceInUseException") {
                            cb(err);
                            return;
                        }
                        cb(null, data);
                    });
                }
            }
        });
    }
    alter() {
        throw new Error("Alter table is currently not supported");
    }
}
exports.DynamoDBTableCompiler = DynamoDBTableCompiler;
