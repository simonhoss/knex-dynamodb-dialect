import * as cuid from "cuid";
// @ts-ignore
import * as Builder from "knex/lib/query/builder";
// @ts-ignore
import * as QueryCompiler from "knex/lib/query/compiler";
import { isArray } from "lodash";
const { DynamoDB } = require("aws-sdk");

export class DynamoDBQueryCompiler extends (QueryCompiler as any) {
  constructor(...args: any[]) {
    super(...arguments);
  }

  select() {
    const dynamodb = new DynamoDB.DocumentClient(this.client.driver.config);
    const prefix = this.client.connectionSettings.prefix;
    const tableName = prefix + this.single.table;
    const grouped = this.grouped;

    const scanParam: any = {
      TableName: tableName
    };

    if (grouped.where) {
      scanParam.FilterExpression = this.setQueryParams(
        scanParam,
        grouped.where
      );
    }

    if (grouped.columns.length === 1) {
      const column = grouped.columns[0];

      if (column.type === "aggregate") {
        if (column.method === "max") {
          return this.selectAggregateMax(dynamodb, column, scanParam);
        } else if (column.method === "count") {
          return this.selectAggregateCount(dynamodb, column, scanParam);
        } else {
          throw new Error("Aggregate " + column.method + " not implemented");
        }
      }

      if (column.grouping === "columns" && isArray(column.value)) {
        scanParam.ProjectionExpression = column.value.join(", ");
      }
    } else {
      debugger;
    }

    return {
      executeAsync: () => {
        return this.selectItems(dynamodb, scanParam);
      }
    };
  }

  selectItems(dynamodb: any, scanParam: any) {
    return new Promise((resolve, reject) => {
      dynamodb.scan(scanParam, async (err: any, res: any) => {
        if (err) {
          reject(err);
          return;
        }

        const items = res.Items;

        if (typeof res.LastEvaluatedKey != "undefined") {
          scanParam.ExclusiveStartKey = res.LastEvaluatedKey;
          const obj = (await this.selectItems(dynamodb, scanParam)) as any;
          items.push(...obj.Items);
        }

        resolve({ Items: items });
      });
    });
  }

  setQueryParams(scanParam: any, where: any, columnCount = 0) {
    if (!where) {
      return;
    }
    let filterExpression = "";
    if (!scanParam.ExpressionAttributeNames) {
      scanParam.ExpressionAttributeNames = {};
      scanParam.ExpressionAttributeValues = {};
    }
    for (const whereItem of where) {
      if (filterExpression) {
        filterExpression += ` ${whereItem.bool} `;
      }

      scanParam.ExpressionAttributeNames[`#column_${columnCount}`] =
        whereItem.column;
      if (whereItem.type === "whereBasic") {
        scanParam.ExpressionAttributeValues[`:column_${columnCount}`] =
          whereItem.value;
        filterExpression += `#column_${columnCount} ${
          whereItem.operator
        } :column_${columnCount}`;
      } else if (whereItem.type === "whereNull") {
        scanParam.ExpressionAttributeValues[`:column_${columnCount}`] = null;
        filterExpression += `(#column_${columnCount} = :column_${columnCount}`;

        let functionName = "attribute_not_exists";
        if (whereItem.not) {
          functionName = "attribute_exists";
        }

        filterExpression += ` or ${functionName}(#column_${columnCount}))`;
      } else if (whereItem.type === "whereBetween") {
        scanParam.ExpressionAttributeValues[`:column_${columnCount}`] =
          whereItem.value[0];
        columnCount++;
        scanParam.ExpressionAttributeValues[`:column_${columnCount}`] =
          whereItem.value[1];

        filterExpression += `#column_${columnCount -
          1} BETWEEN :column_${columnCount - 1} and :column_${columnCount}`;
      } else if (whereItem.type === "whereWrapped") {
        const builder = new Builder(this);
        const whereVal = whereItem.value(builder);
        const innerFilterExpression = this.setQueryParams(
          scanParam,
          whereVal._statements,
          columnCount + 100
        );
        filterExpression += `(${innerFilterExpression})`;
      }

      columnCount++;
    }
    return filterExpression;
  }

  selectAggregateCount(dynamodb: any, column: any, scanParam: any) {
    return {
      executeAsync: () => {
        return new Promise((resolve, reject) => {
          dynamodb.scan(scanParam, (err: any, res: any) => {
            if (err) {
              reject(err);
              return;
            }
            resolve({ Items: [{ count: res.Count }] });
          });
        });
      }
    };
  }

  selectAggregateMax(dynamodb: any, column: any, scanParam: any) {
    return {
      executeAsync: () => {
        return new Promise((resolve, reject) => {
          let val = 0;
          const splitColumn = column.value.split(" ");
          let sourceColumn = splitColumn[0];
          let asColumn = splitColumn[0];
          if (splitColumn.length === 3) {
            if (splitColumn[1].toLowerCase() === "as") {
              sourceColumn = splitColumn[0];
              asColumn = splitColumn[2];
            }
          }
          dynamodb.scan(scanParam, (err: any, res: any) => {
            if (err) {
              reject(err);
              return;
            }

            for (const item of res.Items) {
              val = Math.max(val, item[sourceColumn]);
            }

            resolve({
              Items: [
                {
                  [asColumn]: val
                }
              ]
            });
          });
        });
      }
    };
  }

  insert() {
    const dynamodb = new DynamoDB.DocumentClient(this.client.driver.config);
    dynamodb.options.convertEmptyValues = true;
    const prefix = this.client.connectionSettings.prefix;
    const tableName = prefix + this.single.table;
    const data = this.single.insert;
    const returning = this.single.returning;

    return {
      executeAsync: async () => {
        if (Array.isArray(data)) {
          const items = [];
          for (const dataItem of data) {
            items.push(
              await this.insertItem(dynamodb, tableName, dataItem, returning)
            );
          }
          return { Items: items };
        } else {
          const returningVal = await this.insertItem(
            dynamodb,
            tableName,
            data,
            returning
          );
          return { Items: [returningVal] };
        }
      }
    };
  }

  insertItem(
    dynamodb: any,
    tableName: string,
    dataItem: any,
    returningKey: string
  ) {
    if (!dataItem.id) {
      dataItem.id = cuid();
    }
    return new Promise<any>((resolve, reject) => {
      dynamodb.put(
        {
          TableName: tableName,
          Item: dataItem
        },
        (err: any, data: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(dataItem[returningKey]);
        }
      );
    });
  }

  update() {
    const dynamodb = new DynamoDB.DocumentClient(this.client.driver.config);
    // const dynamodb = this.client.driver;
    const prefix = this.client.connectionSettings.prefix;
    const tableName = prefix + this.single.table;
    // if (tableName === "knex_migrations") {
    //   return { execute: () => {} };
    // }
    const data = this.single.update;
    // const model = this.client.driver.models[tableName];
    // return { execute: model.create.bind(this, data) };
    // return { execute: model.update.bind(this, data) };
    const keys = Object.keys(data);
    const expressionAttributeValues: any = {};
    const expressionAttributeNames: any = {};
    let updateExpression = "set";
    let first = true;
    for (const key of keys) {
      if (key !== "id") {
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = data[key];
        if (!first) {
          updateExpression += " ,";
        }
        updateExpression += ` #${key} = :${key}`;
        first = false;
      }
    }
    const params: any = {
      TableName: tableName,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames
    };

    const queryParams: any = {
      TableName: tableName
    };
    const grouped = this.grouped;
    if (grouped && grouped.where) {
      queryParams.FilterExpression = this.setQueryParams(
        queryParams,
        grouped.where
      );
    }

    return {
      executeAsync: async () => {
        await this.updateAllItems(dynamodb, params, queryParams);
      }
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
  }

  updateAllItems(dynamodb: any, params: any, queryParams: any) {
    return new Promise((resolve, reject) => {
      dynamodb.scan(queryParams, async (err: any, data: any) => {
        if (err) {
          reject(err);
          return;
        }

        for (const item of data.Items) {
          await this.updateItem(dynamodb, params, item.id);
        }

        if (typeof data.LastEvaluatedKey != "undefined") {
          queryParams.ExclusiveStartKey = data.LastEvaluatedKey;
          await this.updateAllItems(dynamodb, params, queryParams);
        }

        resolve();
      });
    });
  }

  updateItem(dynamodb: any, params: any, id: string) {
    return new Promise((resolve, reject) => {
      dynamodb.update(
        {
          ...params,
          Key: { id }
        },
        (err: any, data: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  del() {
    const dynamodb = new DynamoDB.DocumentClient(this.client.driver.config);
    // const dynamodb = this.client.driver;
    const prefix = this.client.connectionSettings.prefix;
    const tableName = prefix + this.single.table;
    const grouped = this.grouped;
    const scanParam: any = {
      TableName: tableName
    };
    const filterExpression = this.setQueryParams(scanParam, grouped.where);
    scanParam.FilterExpression = filterExpression;
    return {
      executeAsync: async () => {
        await this.deleteItems(dynamodb, scanParam, tableName);
      }
    };
  }

  deleteItems(dynamodb: any, scanParam: any, tableName: string) {
    return new Promise((resolve, reject) => {
      dynamodb.scan(scanParam, async (err: any, data: any) => {
        if (err) {
          reject(err);
          return;
        }

        for (const item of data.Items) {
          await this.deleteItem(dynamodb, tableName, item.id);
        }

        if (typeof data.LastEvaluatedKey != "undefined") {
          scanParam.ExclusiveStartKey = data.LastEvaluatedKey;
          await this.deleteItems(dynamodb, scanParam, tableName);
        }

        resolve();
      });
    });
  }

  deleteItem(dynamodb: any, tableName: any, id: string) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: tableName,
        Key: {
          id: id
        }
      };
      dynamodb.delete(params, (err: any, data: any) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }
}
