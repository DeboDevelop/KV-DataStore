// import fs from "fs";
// import path from "path";
import { KVDataStoreInterface, Result, Value } from "./interfaces"
import { second } from "./types"
import { Status } from "./enums";

class KVDataStore implements KVDataStoreInterface {
    readonly name: string;
    readonly filePath: string;
    constructor(name: string, filePath = __dirname) {
        this.name = name;
        this.filePath = filePath;
    }

    createData(key : string, value : Value, seconds : second = null) : Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            reject({
                status: Status.Failure,
                message: `Input: ${key}, ${value}, ${seconds}, Function is yet to be implemented`
            })
        })
    }

    readData(key : string) : Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            reject({
                status: Status.Failure,
                message: `Input: ${key}, Function is yet to be implemented`
            })
        })
    }
    updateData(key : string, value : Value) : Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            reject({
                status: Status.Failure,
                message: `Input: ${key}, ${value}, Function is yet to be implemented`
            })
        })
    }
    updateTTL(key : string, seconds : number) : Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            reject({
                status: Status.Failure,
                message: `Input: ${key}, ${seconds}, Function is yet to be implemented`
            })
        })
    }
    deleteData(key : string) : Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            reject({
                status: Status.Failure,
                message: `Input: ${key}, Function is yet to be implemented`
            })
        })
    }
}

export default KVDataStore;