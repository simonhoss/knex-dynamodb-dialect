declare const DynamoDBSchemaCompiler_base: any;
export declare class DynamoDBSchemaCompiler extends DynamoDBSchemaCompiler_base {
    constructor(...args: any[]);
    renameTable(tableName: string, to: string): void;
    hasTable(tableName: string): void;
    hasColumn(tableName: string, column: string): void;
}
export {};
