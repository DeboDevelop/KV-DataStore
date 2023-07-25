import { Status } from "./enums";
import { second } from "./types"

export interface KVDataStoreInterface {
    readonly storeName: string;
    readonly filePath: string;
    createData(key : string, value : Value, seconds : second) : Promise<Result>
    readData(key : string) : Promise<Result>
    updateData(key : string, value : Value) : Promise<Result>
    updateTTL(key : string, seconds : number) : Promise<Result>
    deleteData(key : string) : Promise<Result>
}

export interface Result {
    status: Status,
    message: string
}

export interface Value {
    ttl: string,
    createdAt: Date,
    value: NonNullable<unknown>
}