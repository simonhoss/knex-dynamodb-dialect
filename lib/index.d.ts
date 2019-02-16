import { DynamoDBQueryCompiler } from "./query/compiler";
import { DynamoDBColumnCompiler } from "./schema/columncompiler";
import { DynamoDBSchemaCompiler } from "./schema/compiler";
import { DynamoDBTableCompiler } from "./schema/tablecompiler";
import DynamoDBTransaction from "./transaction";
declare const DynamoDBDialect_base: any;
export declare class DynamoDBDialect extends DynamoDBDialect_base {
    readonly dialect: string;
    readonly driverName: string;
    _driver(): any;
    test(): string;
    query(connection: any, obj: any): any;
    queryCompiler(): DynamoDBQueryCompiler;
    schemaCompiler(): DynamoDBSchemaCompiler;
    tableCompiler(): DynamoDBTableCompiler;
    columnCompiler(): DynamoDBColumnCompiler;
    transaction(): DynamoDBTransaction;
    acquireRawConnection(): any;
    destroyRawConnection(connection: any): any;
    processResponse(obj: any, runner: any): any;
    canCancelQuery: boolean;
}
export {};
