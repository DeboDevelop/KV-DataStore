import fs from "fs";
import path from "path";
import lockfile from "proper-lockfile";
import { JsonDataFormat, KVDataStoreInterface, Result, Value } from "./interfaces"
import { second } from "./types"
import { Status } from "./enums";
import logger from "./logger";
import * as FileUtility from "./utils/file_utility"
import * as HashUtility from "./utils/hash_utility"
import * as HelperUtility from "./utils/helper_utility" 

class KVDataStore implements KVDataStoreInterface {
    readonly storeName: string;
    readonly filePath: string;
    constructor(storeName: string, filePath: string = __dirname) {
        this.storeName = storeName;
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
        FileUtility.createInitialDirectory(this.storeName, this.filePath);
        FileUtility.handleInitialShards(this.storeName, this.filePath, this);
    }

    async createData(key : string, value : NonNullable<unknown>, seconds : second = null) : Promise<Result> {
        // Check whether key is string or not. We want these check to exist in JS too.
        if (typeof key !== "string") {
            //returning appropriate promise
            return HelperUtility.FailurePromise("Key have to be String")
        }
        // Check whether value is null or not. (since null is treated as object in JS)
        // We want these check to exist in JS too.
        if (value === null) {
            //returning appropriate promise
            return HelperUtility.FailurePromise("Value is Null")
        }

        // Hashing key
        const fileName = HashUtility.fileSelect(HashUtility.hexToInt(HashUtility.md5(key)))
        //Checking whether file/shard has been deleted or not.
        if (FileUtility.fileExist(this.storeName, this.filePath, `${fileName}.json`) == false) {
            //returning appropriate promise
            return HelperUtility.FailurePromise("The files appear to have been altered or modified.")
        }
        const fileP = path.join(this.filePath, this.storeName, `${fileName}.json`);

        try {
            const fileData: JsonDataFormat = JSON.parse(await FileUtility.readFileAsync(fileP));
            if (Object.prototype.hasOwnProperty.call(fileData, key)) {
                return HelperUtility.FailurePromise("Key already exist.")
            }
            const valueObj: Value = {
                ttl: seconds,
                createdAt: new Date(),
                updatedAt: new Date(),
                value
            }
            // inserting the new key value pair
            fileData[key] = valueObj;
            if (!(await lockfile.check(fileP))) {
                const release = await lockfile.lock(fileP)
                await FileUtility.writeFileAsync(fileP, JSON.stringify(fileData))
                await release();
                if (seconds !== null && typeof seconds === "number") {
                    this.deleteDataOnExpiry(key, seconds)
                }
                return HelperUtility.SuccessPromise("Insertion of data is successful")
            } else {
                // Try after some time
                return HelperUtility.retryWithDelay(this, 'createData', 3, 5 * 1000, key, value, seconds)
            }
        } catch(err) {
            return HelperUtility.FailurePromise(`Error occured while inserting data: ${err}`)
        }
    }

    async readData(key : string) : Promise<Result> {
        // Check whether key is string or not. We want these check to exist in JS too.
        if (typeof key !== "string") {
            //returning appropriate promise
            return HelperUtility.FailurePromise("Key have to be String")
        }
        // Hashing key
        const fileName = HashUtility.fileSelect(HashUtility.hexToInt(HashUtility.md5(key)))
        //Checking whether file/shard has been deleted or not.
        if (FileUtility.fileExist(this.storeName, this.filePath, `${fileName}.json`) == false) {
            //returning appropriate promise
            return HelperUtility.FailurePromise("The files appear to have been altered or modified.")
        }
        const fileP = path.join(this.filePath, this.storeName, `${fileName}.json`);
        try {
            const fileData: JsonDataFormat = JSON.parse(await FileUtility.readFileAsync(fileP));
            if (!Object.prototype.hasOwnProperty.call(fileData, key)) {
                return HelperUtility.FailurePromise("Key doesn't exist.")
            }
            return HelperUtility.SuccessPromise("Data successfully retrived", fileData[key])
        } catch(err) {
            return HelperUtility.FailurePromise(`Error occured while reading data: ${err}`)
        }
    }
    async updateData(key : string, value : NonNullable<unknown>) : Promise<Result> {
        // Check whether key is string or not. We want these check to exist in JS too.
        if (typeof key !== "string") {
            //returning appropriate promise
            return HelperUtility.FailurePromise("Key have to be String")
        }
        // Check whether value is null or not. (since null is treated as object in JS)
        // We want these check to exist in JS too.
        if (value === null) {
            //returning appropriate promise
            return HelperUtility.FailurePromise("Value is Null")
        }
        // Hashing key
        const fileName = HashUtility.fileSelect(HashUtility.hexToInt(HashUtility.md5(key)))
        //Checking whether file/shard has been deleted or not.
        if (FileUtility.fileExist(this.storeName, this.filePath, `${fileName}.json`) == false) {
            //returning appropriate promise
            return HelperUtility.FailurePromise("The files appear to have been altered or modified.")
        }
        const fileP = path.join(this.filePath, this.storeName, `${fileName}.json`);
        try {
            const fileData: JsonDataFormat = JSON.parse(await FileUtility.readFileAsync(fileP));
            if (!Object.prototype.hasOwnProperty.call(fileData, key)) {
                return HelperUtility.FailurePromise("Key doesn't exist.")
            }
            // updating the new key value pair
            fileData[key].value = value;
            fileData[key].updatedAt = new Date();
            if (!(await lockfile.check(fileP))) {
                const release = await lockfile.lock(fileP)
                await FileUtility.writeFileAsync(fileP, JSON.stringify(fileData))
                await release();
                return HelperUtility.SuccessPromise("Updation of data is successful")
            } else {
                // Try after some time
                return HelperUtility.retryWithDelay(this, 'updateData', 3, 5 * 1000, key, value)
            }
        } catch(err) {
            return HelperUtility.FailurePromise(`Error occured while updating data: ${err}`)
        }
    }
    updateTTL(key : string, seconds : number) : Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            reject({
                status: Status.Failure,
                message: `Input: ${key}, ${seconds}, Function is yet to be implemented`
            })
        })
    }
    async deleteData(key : string) : Promise<Result> {
        // Check whether key is string or not. We want these check to exist in JS too.
        if (typeof key !== "string") {
            //returning appropriate promise
            return HelperUtility.FailurePromise("Key have to be String")
        }

        // Hashing key
        const fileName = HashUtility.fileSelect(HashUtility.hexToInt(HashUtility.md5(key)))
        //Checking whether file/shard has been deleted or not.
        if (FileUtility.fileExist(this.storeName, this.filePath, `${fileName}.json`) == false) {
            //returning appropriate promise
            return HelperUtility.FailurePromise("The files appear to have been altered or modified.")
        }
        const fileP = path.join(this.filePath, this.storeName, `${fileName}.json`);

        try {
            const fileData: JsonDataFormat = JSON.parse(await FileUtility.readFileAsync(fileP));
            if (!Object.prototype.hasOwnProperty.call(fileData, key)) {
                return HelperUtility.FailurePromise("Key doesn't exist.")
            }
            if (!(await lockfile.check(fileP))) {
                const release = await lockfile.lock(fileP)
                delete fileData[key];
                await FileUtility.writeFileAsync(fileP, JSON.stringify(fileData))
                await release();
                return HelperUtility.SuccessPromise("Deletion of data is successful")
            } else {
                // Try after some time
                return HelperUtility.retryWithDelay(this, 'deleteData', 3, 5 * 1000, key)
            }
        } catch(err) {
            return HelperUtility.FailurePromise(`Error occured while deleting data: ${err}`)
        }
    }
    
    private deleteDataOnExpiry(key : string, seconds : number) {
        setTimeout( async () => {
            try {
                await this.deleteData(key);
                logger.info(`${key} has been successfully deleted in the background job after expiry`)
            } catch(err) {
                logger.error(`Error occured while deleting ${key}, error: ${err}`)
            }
        }, seconds * 1000)
    }
}

export default KVDataStore;