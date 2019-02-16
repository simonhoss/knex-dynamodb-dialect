"use strict";
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __read =
  (this && this.__read) ||
  function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
var __spread =
  (this && this.__spread) ||
  function() {
    for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
    return ar;
  };
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var Client = require("knex/lib/client");
var compiler_1 = require("./query/compiler");
var columncompiler_1 = require("./schema/columncompiler");
var compiler_2 = require("./schema/compiler");
var tablecompiler_1 = require("./schema/tablecompiler");
var transaction_1 = require("./transaction");
var DynamoDBDialect = /** @class */ (function(_super) {
  __extends(DynamoDBDialect, _super);
  function DynamoDBDialect() {
    //   public dialect = "dynamodb";
    //   public driverName = "dynamodb";
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.canCancelQuery = false;
    return _this;
  }
  Object.defineProperty(DynamoDBDialect.prototype, "dialect", {
    get: function() {
      return "dynamodb";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DynamoDBDialect.prototype, "driverName", {
    get: function() {
      return "dynamodb";
    },
    enumerable: true,
    configurable: true
  });
  DynamoDBDialect.prototype._driver = function() {
    var DynamoDB = require("aws-sdk").DynamoDB;
    return new DynamoDB();
  };
  DynamoDBDialect.prototype.test = function() {
    return "yo";
  };
  DynamoDBDialect.prototype.query = function(connection, obj) {
    if (obj.dynamodb) {
      return new Promise(function(resolve) {
        obj.dynamodb.exec(function(err, res) {
          if (err && err.code !== "ResourceInUseException") {
            throw new Error(err);
          }
          if (res && res.Items) {
            resolve({
              Items: res.Items.map(function(item) {
                return item.attrs;
              })
            });
            return;
          }
          resolve(res);
        });
      });
    } else if (obj.executeAsync) {
      return obj.executeAsync();
    }
    return Promise.resolve(obj);
  };
  DynamoDBDialect.prototype.queryCompiler = function() {
    return new (compiler_1.DynamoDBQueryCompiler.bind.apply(
      compiler_1.DynamoDBQueryCompiler,
      __spread([void 0, this], arguments)
    ))();
  };
  DynamoDBDialect.prototype.schemaCompiler = function() {
    return new (compiler_2.DynamoDBSchemaCompiler.bind.apply(
      compiler_2.DynamoDBSchemaCompiler,
      __spread([void 0, this], arguments)
    ))();
  };
  DynamoDBDialect.prototype.tableCompiler = function() {
    return new (tablecompiler_1.DynamoDBTableCompiler.bind.apply(
      tablecompiler_1.DynamoDBTableCompiler,
      __spread([void 0, this], arguments)
    ))();
  };
  DynamoDBDialect.prototype.columnCompiler = function() {
    return new (columncompiler_1.DynamoDBColumnCompiler.bind.apply(
      columncompiler_1.DynamoDBColumnCompiler,
      __spread([void 0, this], arguments)
    ))();
  };
  DynamoDBDialect.prototype.transaction = function() {
    return new (transaction_1.default.bind.apply(
      transaction_1.default,
      __spread([void 0, this], arguments)
    ))();
  };
  DynamoDBDialect.prototype.acquireRawConnection = function() {
    if (this.connectionSettings.region && this.connectionSettings.endpoint) {
      this.driver.config.region = this.connectionSettings.region;
      this.driver.config.endpoint = this.connectionSettings.endpoint;
      this.driver.setEndpoint(this.connectionSettings.endpoint);
    }
    console.log("acquireRawConnection");
    console.log(this.connectionSettings);
    return Promise.resolve(this.driver);
  };
  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  DynamoDBDialect.prototype.destroyRawConnection = function(connection) {
    throw new Error("destroyRawConnection not implemented");
    return Promise.resolve();
  };
  DynamoDBDialect.prototype.processResponse = function(obj, runner) {
    if (obj == null) return;
    if (obj.output) return obj.output.call();
    if (obj.execute) return obj.execute();
    if (obj.Items) {
      return obj.Items;
    }
    if (obj.TableDescription) {
      return;
    }
    throw new Error("processResponse");
  };
  return DynamoDBDialect;
})(Client);
exports.DynamoDBDialect = DynamoDBDialect;
