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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cuid = require("cuid");
// @ts-ignore
var Builder = require("knex/lib/query/builder");
// @ts-ignore
var QueryCompiler = require("knex/lib/query/compiler");
var DynamoDB = require("aws-sdk").DynamoDB;
var DynamoDBQueryCompiler = /** @class */ (function (_super) {
    __extends(DynamoDBQueryCompiler, _super);
    function DynamoDBQueryCompiler() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, __spread(arguments)) || this;
    }
    DynamoDBQueryCompiler.prototype.select = function () {
        var _this = this;
        var dynamodb = new DynamoDB.DocumentClient(this.client.driver.config);
        var prefix = this.client.connectionSettings.prefix;
        var tableName = prefix + this.single.table;
        var grouped = this.grouped;
        var scanParam = {
            TableName: tableName
        };
        if (grouped.where) {
            scanParam.FilterExpression = this.setQueryParams(scanParam, grouped.where);
        }
        if (grouped.columns.length === 1) {
            var column = grouped.columns[0];
            if (column.type === "aggregate") {
                if (column.method === "max") {
                    return this.selectAggregateMax(dynamodb, column, scanParam);
                }
                else if (column.method === "count") {
                    return this.selectAggregateCount(dynamodb, column, scanParam);
                }
                else {
                    console.log("yo");
                }
            }
        }
        else {
            debugger;
        }
        return {
            executeAsync: function () {
                return _this.selectItems(dynamodb, scanParam);
            }
        };
    };
    DynamoDBQueryCompiler.prototype.selectItems = function (dynamodb, scanParam) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            dynamodb.scan(scanParam, function (err, res) { return __awaiter(_this, void 0, void 0, function () {
                var items, obj;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err) {
                                reject(err);
                                return [2 /*return*/];
                            }
                            items = res.Items;
                            if (!(typeof res.LastEvaluatedKey != "undefined")) return [3 /*break*/, 2];
                            scanParam.ExclusiveStartKey = res.LastEvaluatedKey;
                            return [4 /*yield*/, this.selectItems(dynamodb, scanParam)];
                        case 1:
                            obj = (_a.sent());
                            items.push.apply(items, __spread(obj.Items));
                            _a.label = 2;
                        case 2:
                            resolve({ Items: items });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    DynamoDBQueryCompiler.prototype.setQueryParams = function (scanParam, where, columnCount) {
        if (columnCount === void 0) { columnCount = 0; }
        var e_1, _a;
        if (!where) {
            return;
        }
        var filterExpression = "";
        if (!scanParam.ExpressionAttributeNames) {
            scanParam.ExpressionAttributeNames = {};
            scanParam.ExpressionAttributeValues = {};
        }
        try {
            for (var where_1 = __values(where), where_1_1 = where_1.next(); !where_1_1.done; where_1_1 = where_1.next()) {
                var whereItem = where_1_1.value;
                if (filterExpression) {
                    filterExpression += " " + whereItem.bool + " ";
                }
                scanParam.ExpressionAttributeNames["#column_" + columnCount] =
                    whereItem.column;
                if (whereItem.type === "whereBasic") {
                    scanParam.ExpressionAttributeValues[":column_" + columnCount] =
                        whereItem.value;
                    filterExpression += "#column_" + columnCount + " " + whereItem.operator + " :column_" + columnCount;
                }
                else if (whereItem.type === "whereNull") {
                    scanParam.ExpressionAttributeValues[":column_" + columnCount] = null;
                    filterExpression += "(#column_" + columnCount + " = :column_" + columnCount;
                    var functionName = "attribute_not_exists";
                    if (whereItem.not) {
                        functionName = "attribute_exists";
                    }
                    filterExpression += " or " + functionName + "(#column_" + columnCount + "))";
                }
                else if (whereItem.type === "whereBetween") {
                    scanParam.ExpressionAttributeValues[":column_" + columnCount] =
                        whereItem.value[0];
                    columnCount++;
                    scanParam.ExpressionAttributeValues[":column_" + columnCount] =
                        whereItem.value[1];
                    filterExpression += "#column_" + (columnCount -
                        1) + " BETWEEN :column_" + (columnCount - 1) + " and :column_" + columnCount;
                }
                else if (whereItem.type === "whereWrapped") {
                    var builder = new Builder(this);
                    var whereVal = whereItem.value(builder);
                    var innerFilterExpression = this.setQueryParams(scanParam, whereVal._statements, columnCount + 100);
                    filterExpression += "(" + innerFilterExpression + ")";
                }
                else {
                    debugger;
                }
                columnCount++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (where_1_1 && !where_1_1.done && (_a = where_1.return)) _a.call(where_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return filterExpression;
    };
    DynamoDBQueryCompiler.prototype.selectAggregateCount = function (dynamodb, column, scanParam) {
        return {
            executeAsync: function () {
                return new Promise(function (resolve, reject) {
                    dynamodb.scan(scanParam, function (err, res) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve({ Items: [{ count: res.Count }] });
                    });
                });
            }
        };
    };
    DynamoDBQueryCompiler.prototype.selectAggregateMax = function (dynamodb, column, scanParam) {
        return {
            executeAsync: function () {
                return new Promise(function (resolve, reject) {
                    var val = 0;
                    var splitColumn = column.value.split(" ");
                    var sourceColumn = splitColumn[0];
                    var asColumn = splitColumn[0];
                    if (splitColumn.length === 3) {
                        if (splitColumn[1].toLowerCase() === "as") {
                            sourceColumn = splitColumn[0];
                            asColumn = splitColumn[2];
                        }
                    }
                    dynamodb.scan(scanParam, function (err, res) {
                        var e_2, _a, _b;
                        if (err) {
                            reject(err);
                            return;
                        }
                        try {
                            for (var _c = __values(res.Items), _d = _c.next(); !_d.done; _d = _c.next()) {
                                var item = _d.value;
                                val = Math.max(val, item[sourceColumn]);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        resolve({
                            Items: [
                                (_b = {},
                                    _b[asColumn] = val,
                                    _b)
                            ]
                        });
                    });
                });
            }
        };
    };
    DynamoDBQueryCompiler.prototype.insert = function () {
        var _this = this;
        var dynamodb = new DynamoDB.DocumentClient(this.client.driver.config);
        dynamodb.options.convertEmptyValues = true;
        var prefix = this.client.connectionSettings.prefix;
        var tableName = prefix + this.single.table;
        var data = this.single.insert;
        var returning = this.single.returning;
        return {
            executeAsync: function () { return __awaiter(_this, void 0, void 0, function () {
                var e_3, _a, items, data_1, data_1_1, dataItem, _b, _c, e_3_1, returningVal;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!Array.isArray(data)) return [3 /*break*/, 9];
                            items = [];
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 6, 7, 8]);
                            data_1 = __values(data), data_1_1 = data_1.next();
                            _d.label = 2;
                        case 2:
                            if (!!data_1_1.done) return [3 /*break*/, 5];
                            dataItem = data_1_1.value;
                            _c = (_b = items).push;
                            return [4 /*yield*/, this.insertItem(dynamodb, tableName, dataItem, returning)];
                        case 3:
                            _c.apply(_b, [_d.sent()]);
                            _d.label = 4;
                        case 4:
                            data_1_1 = data_1.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_3_1 = _d.sent();
                            e_3 = { error: e_3_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/, { Items: items }];
                        case 9: return [4 /*yield*/, this.insertItem(dynamodb, tableName, data, returning)];
                        case 10:
                            returningVal = _d.sent();
                            return [2 /*return*/, { Items: [returningVal] }];
                    }
                });
            }); }
        };
    };
    DynamoDBQueryCompiler.prototype.insertItem = function (dynamodb, tableName, dataItem, returningKey) {
        if (!dataItem.id) {
            dataItem.id = cuid();
        }
        return new Promise(function (resolve, reject) {
            dynamodb.put({
                TableName: tableName,
                Item: dataItem
            }, function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(dataItem[returningKey]);
            });
        });
    };
    DynamoDBQueryCompiler.prototype.update = function () {
        var _this = this;
        var e_4, _a;
        var dynamodb = new DynamoDB.DocumentClient(this.client.driver.config);
        // const dynamodb = this.client.driver;
        var prefix = this.client.connectionSettings.prefix;
        var tableName = prefix + this.single.table;
        // if (tableName === "knex_migrations") {
        //   return { execute: () => {} };
        // }
        var data = this.single.update;
        // const model = this.client.driver.models[tableName];
        // return { execute: model.create.bind(this, data) };
        // return { execute: model.update.bind(this, data) };
        var keys = Object.keys(data);
        var expressionAttributeValues = {};
        var expressionAttributeNames = {};
        var updateExpression = "set";
        var first = true;
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                if (key !== "id") {
                    expressionAttributeNames["#" + key] = key;
                    expressionAttributeValues[":" + key] = data[key];
                    if (!first) {
                        updateExpression += " ,";
                    }
                    updateExpression += " #" + key + " = :" + key;
                    first = false;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var params = {
            TableName: tableName,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames
        };
        var queryParams = {
            TableName: tableName
        };
        var grouped = this.grouped;
        if (grouped && grouped.where) {
            queryParams.FilterExpression = this.setQueryParams(queryParams, grouped.where);
        }
        return {
            executeAsync: function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.updateAllItems(dynamodb, params, queryParams)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        };
        // return {
        //   executeAsync: () => {
        //     return new Promise<any>((resolve, reject) => {
        //     }
        //   }
        // }
        // return {
        //   executeAsync: () => {
        //     return new Promise<any>((resolve, reject) => {
        //       dynamodb.update(params, (err: any, data: any) => {
        //         if (err) {
        //           reject(err);
        //           return;
        //         }
        //         resolve(null);
        //       });
        //     });
        //   }
        // };
    };
    DynamoDBQueryCompiler.prototype.updateAllItems = function (dynamodb, params, queryParams) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            dynamodb.scan(queryParams, function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                var e_5, _a, _b, _c, item, e_5_1;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (err) {
                                reject(err);
                                return [2 /*return*/];
                            }
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 6, 7, 8]);
                            _b = __values(data.Items), _c = _b.next();
                            _d.label = 2;
                        case 2:
                            if (!!_c.done) return [3 /*break*/, 5];
                            item = _c.value;
                            return [4 /*yield*/, this.updateItem(dynamodb, params, item.id)];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4:
                            _c = _b.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_5_1 = _d.sent();
                            e_5 = { error: e_5_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_5) throw e_5.error; }
                            return [7 /*endfinally*/];
                        case 8:
                            if (!(typeof data.LastEvaluatedKey != "undefined")) return [3 /*break*/, 10];
                            queryParams.ExclusiveStartKey = data.LastEvaluatedKey;
                            return [4 /*yield*/, this.updateAllItems(dynamodb, params, queryParams)];
                        case 9:
                            _d.sent();
                            _d.label = 10;
                        case 10:
                            resolve();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    DynamoDBQueryCompiler.prototype.updateItem = function (dynamodb, params, id) {
        return new Promise(function (resolve, reject) {
            dynamodb.update(__assign({}, params, { Key: { id: id } }), function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    };
    DynamoDBQueryCompiler.prototype.del = function () {
        var _this = this;
        var dynamodb = new DynamoDB.DocumentClient(this.client.driver.config);
        // const dynamodb = this.client.driver;
        var prefix = this.client.connectionSettings.prefix;
        var tableName = prefix + this.single.table;
        var grouped = this.grouped;
        var scanParam = {
            TableName: tableName
        };
        var filterExpression = this.setQueryParams(scanParam, grouped.where);
        scanParam.FilterExpression = filterExpression;
        return {
            executeAsync: function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.deleteItems(dynamodb, scanParam, tableName)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        };
    };
    DynamoDBQueryCompiler.prototype.deleteItems = function (dynamodb, scanParam, tableName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            dynamodb.scan(scanParam, function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                var e_6, _a, _b, _c, item, e_6_1;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (err) {
                                reject(err);
                                return [2 /*return*/];
                            }
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 6, 7, 8]);
                            _b = __values(data.Items), _c = _b.next();
                            _d.label = 2;
                        case 2:
                            if (!!_c.done) return [3 /*break*/, 5];
                            item = _c.value;
                            return [4 /*yield*/, this.deleteItem(dynamodb, tableName, item.id)];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4:
                            _c = _b.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_6_1 = _d.sent();
                            e_6 = { error: e_6_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_6) throw e_6.error; }
                            return [7 /*endfinally*/];
                        case 8:
                            if (!(typeof data.LastEvaluatedKey != "undefined")) return [3 /*break*/, 10];
                            scanParam.ExclusiveStartKey = data.LastEvaluatedKey;
                            return [4 /*yield*/, this.deleteItems(dynamodb, scanParam, tableName)];
                        case 9:
                            _d.sent();
                            _d.label = 10;
                        case 10:
                            resolve();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    DynamoDBQueryCompiler.prototype.deleteItem = function (dynamodb, tableName, id) {
        return new Promise(function (resolve, reject) {
            var params = {
                TableName: tableName,
                Key: {
                    id: id
                }
            };
            dynamodb.delete(params, function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    };
    return DynamoDBQueryCompiler;
}(QueryCompiler));
exports.DynamoDBQueryCompiler = DynamoDBQueryCompiler;
