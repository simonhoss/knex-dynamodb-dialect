import * as Knex from "knex";

let dynamodbMock: any;
jest.mock("aws-sdk", () => {
  console.log("aws");

  const DynamoDB = function() {};
  DynamoDB.DocumentClient = jest.fn().mockImplementation(() => dynamodbMock);
  return {
    DynamoDB
  };
});

describe("when select", () => {
  let knex: Knex;
  beforeEach(() => {
    dynamodbMock = {
      scan: jest.fn().mockImplementation((params, cb) => {
        cb({ Items: [] });
      })
    };

    const { DynamoDBDialect } = require("../src/index");

    knex = Knex({
      debug: true,
      client: DynamoDBDialect as any,
      connection: {
        prefix: "test_"
      } as any,
      pool: {
        min: 1,
        max: 1
      }
    });
  });

  describe("when select with fields", () => {
    it("should add projection", async () => {
      await knex.select(["column_1", "column_2"]).table("test_table");
      expect(dynamodbMock.scan).toHaveBeenCalledWith(
        {
          ExpressionAttributeNames: {
            "#project_0": "column_1",
            "#project_1": "column_2"
          },
          ProjectionExpression: "#project_0, #project_1",
          TableName: "test_test_table"
        },
        expect.anything()
      );
    });
  });

  describe("when select with *", () => {
    it("should add projection", async () => {
      await knex.select("*").table("test_table");
      expect(dynamodbMock.scan).toHaveBeenCalledWith(
        {
          TableName: "test_test_table"
        },
        expect.anything()
      );
    });
  });
});
