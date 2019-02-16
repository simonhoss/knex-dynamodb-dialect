declare const DynamoDBQueryCompiler_base: any;
export declare class DynamoDBQueryCompiler extends DynamoDBQueryCompiler_base {
    constructor(...args: any[]);
    select(): {
        executeAsync: () => Promise<{}>;
    };
    selectItems(dynamodb: any, scanParam: any): Promise<{}>;
    setQueryParams(scanParam: any, where: any, columnCount?: number): string | undefined;
    selectAggregateCount(dynamodb: any, column: any, scanParam: any): {
        executeAsync: () => Promise<{}>;
    };
    selectAggregateMax(dynamodb: any, column: any, scanParam: any): {
        executeAsync: () => Promise<{}>;
    };
    insert(): {
        executeAsync: () => Promise<{
            Items: any[];
        }>;
    };
    insertItem(dynamodb: any, tableName: string, dataItem: any, returningKey: string): Promise<any>;
    update(): {
        executeAsync: () => Promise<void>;
    };
    updateAllItems(dynamodb: any, params: any, queryParams: any): Promise<{}>;
    updateItem(dynamodb: any, params: any, id: string): Promise<{}>;
    del(): {
        executeAsync: () => Promise<void>;
    };
    deleteItems(dynamodb: any, scanParam: any, tableName: string): Promise<{}>;
    deleteItem(dynamodb: any, tableName: any, id: string): Promise<{}>;
}
export {};
