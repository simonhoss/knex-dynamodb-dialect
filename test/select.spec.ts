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

describe("when select with fields", () => {
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

  it("should add projection", async () => {
    await knex.select(["column_1", "column_2"]).table("test_table");
    expect(dynamodbMock.scan).toHaveBeenCalledWith(
      {
        ProjectionExpression: "column_1, column_2",
        TableName: "test_test_table"
      },
      expect.anything()
    );
  });
});
