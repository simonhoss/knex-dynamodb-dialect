"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
// @ts-ignore
const Client = require("knex/lib/client");
const compiler_1 = require("./query/compiler");
const columncompiler_1 = require("./schema/columncompiler");
const compiler_2 = require("./schema/compiler");
const tablecompiler_1 = require("./schema/tablecompiler");
const transaction_1 = require("./transaction");
class DynamoDBDialect extends Client {
    constructor() {
        //   public dialect = "dynamodb";
        //   public driverName = "dynamodb";
        super(...arguments);
        this.canCancelQuery = false;
    }
    get dialect() {
        return "dynamodb";
    }
    get driverName() {
        return "dynamodb";
    }
    _driver() {
        const { DynamoDB } = require("aws-sdk");
        return new DynamoDB();
    }
    test() {
        return "yo";
    }
    query(connection, obj) {
        if (obj.dynamodb) {
            return new Promise(resolve => {
                obj.dynamodb.exec((err, res) => {
                    if (err && err.code !== "ResourceInUseException") {
                        throw new Error(err);
                    }
                    if (res && res.Items) {
                        resolve({ Items: res.Items.map((item) => item.attrs) });
                        return;
                    }
                    resolve(res);
                });
            });
        }
        else if (obj.executeAsync) {
            return obj.executeAsync();
        }
        return Promise.resolve(obj);
    }
    queryCompiler() {
        return new compiler_1.DynamoDBQueryCompiler(this, ...arguments);
    }
    schemaCompiler() {
        return new compiler_2.DynamoDBSchemaCompiler(this, ...arguments);
    }
    tableCompiler() {
        return new tablecompiler_1.DynamoDBTableCompiler(this, ...arguments);
    }
    columnCompiler() {
        return new columncompiler_1.DynamoDBColumnCompiler(this, ...arguments);
    }
    transaction() {
        return new transaction_1.default(this, ...arguments);
    }
    acquireRawConnection() {
        if (this.connectionSettings.region) {
            this.driver.config.region = this.connectionSettings.region;
        }
        if (this.connectionSettings.endpoint) {
            this.driver.config.endpoint = this.connectionSettings.endpoint;
            this.driver.setEndpoint(this.connectionSettings.endpoint);
        }
        else {
            this.driver.config.endpoint = `dynamodb.${this.connectionSettings.region}.amazonaws.com`;
            this.driver.setEndpoint(`dynamodb.${this.connectionSettings.region}.amazonaws.com`);
        }
        if (this.connectionSettings.accessKeyId) {
            this.driver.config.accessKeyId = this.connectionSettings.accessKeyId;
        }
        if (this.connectionSettings.secretAccessKey) {
            this.driver.config.secretAccessKey = this.connectionSettings.secretAccessKey;
        }
        return Promise.resolve(this.driver);
    }
    // Used to explicitly close a connection, called internally by the pool
    // when a connection times out or the pool is shutdown.
    destroyRawConnection(connection) {
        throw new Error("destroyRawConnection not implemented");
        return Promise.resolve();
    }
    processResponse(obj, runner) {
        if (obj == null)
            return;
        if (obj.output)
            return obj.output.call();
        if (obj.execute)
            return obj.execute();
        if (obj.Items) {
            return obj.Items;
        }
        if (obj.TableDescription) {
            return;
        }
        throw new Error("processResponse");
    }
}
exports.DynamoDBDialect = DynamoDBDialect;
