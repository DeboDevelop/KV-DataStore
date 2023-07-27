import { Status } from "./enums";
import { second } from "./types"

export interface KVDataStoreInterface {
    readonly storeName: string;
    readonly filePath: string;
    createData(key : string, value : NonNullable<unknown>, seconds : second) : Promise<Result>
    readData(key : string) : Promise<Result>
    updateData(key : string, value : NonNullable<unknown>) : Promise<Result>
    updateTTL(key : string, seconds : number) : Promise<Result>
    deleteData(key : string) : Promise<Result>
}

export interface Result {
    status: Status,
    message: string
    data?: NonNullable<unknown>
}

export interface Value {
    ttl: second,
    createdAt: Date,
    updatedAt: Date,
    value: NonNullable<unknown>
}

export interface JsonDataFormat {
    [index: string]: Value
}