"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var TableCompiler = require("knex/lib/schema/tablecompiler");
var DynamoDBTableCompiler = /** @class */ (function (_super) {
    __extends(DynamoDBTableCompiler, _super);
    function DynamoDBTableCompiler() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, __spread(arguments)) || this;
    }
    DynamoDBTableCompiler.prototype.create = function () {
        var prefix = this.client.connectionSettings.prefix;
        var tableName = prefix + this.tableBuilder._tableName;
        var dynamodb = this.client.driver;
        this.pushQuery({
            dynamodb: {
                exec: function (cb) {
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
                    }, function (err, data) {
                        if (err && err.code !== "ResourceInUseException") {
                            cb(err);
                            return;
                        }
                        cb(null, data);
                    });
                }
            }
        });
    };
    DynamoDBTableCompiler.prototype.alter = function () {
        throw new Error("Alter table is currently not supported");
    };
    return DynamoDBTableCompiler;
}(TableCompiler));
exports.DynamoDBTableCompiler = DynamoDBTableCompiler;
