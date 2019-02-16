declare const DynamoDBTransaction_base: any;
export default class DynamoDBTransaction extends DynamoDBTransaction_base {
    constructor(...args: any[]);
    savepoint(conn: any): Promise<void>;
    release(conn: any, value: any): Promise<void>;
    rollbackTo(conn: any, error: any): Promise<void>;
}
export {};
