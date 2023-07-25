import fs from "fs";
import { KVDataStoreInterface, Result, Value } from "./interfaces"
import { second } from "./types"
import { Status } from "./enums";
import logger from "./logger";
import * as FileUtility from "./utils/file_utility" 

class KVDataStore implements KVDataStoreInterface {
    readonly name: string;
    readonly filePath: string;
    constructor(name: string, filePath: string = __dirname) {
        this.name = name;
        try {
            //Checking whether the given path exist or not.
            if (fs.lstatSync(filePath).isDirectory() == true) this.filePath = filePath;
            else {
                logger.warn("Path is not a Directory");
                logger.warn("Using Default path to save data");
                // Using currect directory if the user given path is not Directory.
                this.filePath = __dirname;
            }
        } catch (err) {
            if (err.code === "ENOENT") {
                logger.warn("No Directory Exist at path: " + filePath);
                logger.warn("Using Default path to save data");
                // Using currect directory if the user given path doesn't exist.
                this.filePath = __dirname;
            } else throw err;
        }
        FileUtility.createInitialDirectory(this.name, this.filePath);
        FileUtility.handleInitialShards(this.name, this.filePath);
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