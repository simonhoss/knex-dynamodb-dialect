# knex-dynamodb-dialect

This is a very early preview version of a knex dynamodb dialect

Suggestions and pull request are very welcome!

## Installation

```
npm install knex-dynamodb-dialect
```

`Example:`

```javascript
import { DynamoDBDialect } from "knex-dynamodb-dialect";

Knex({
    debug: true,
    client: DynamoDBDialect
    connection: {
        prefix: "db_",
        region: isLocal ? "localhost" : null, // put null into region and ednpoint when you're inside a aws environment. For example lambda
        endpoint: isLocal ? "http://localhost:8000" : null,
        provisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    } as any,
    pool: {
        min: 1,
        max: 1
    },
    migrations: {
        tableName: "knex_migrations"
    }
});
```
