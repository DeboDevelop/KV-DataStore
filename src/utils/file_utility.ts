import fs from "fs";
import path from "path";
import logger from "../logger";
import { Result, JsonDataFormat } from "../interfaces";
import { Status } from "../enums";
import KVDataStore from "..";

export function createInitialDirectory(storeName: string, filePath: string): void {
    try {
        // Creating the Data Directory where the data will be stored.
        fs.mkdirSync(path.join(filePath, storeName));
    } catch (e) {
        // If the data directory exist, then it will be used to store data.
        if (e.code == "EEXIST") logger.info("Directory already exist! Data will be saved there.");
        else throw e;
    }
}

export function fileExist(storeName: string, filePath: string, fineName: string) {
    // storing the path to the file.
    const fileP = path.join(filePath, storeName, fineName);
    try {
        // lstatsSync is used to get the details of the path and isFile() is used to check whether the path is of a file or not.
        if (fs.lstatSync(fileP).isFile()) return true;
        else return false;
    } catch (err) {
        if (err.code !== "ENOENT") {
            logger.warn(err);
        }
        return false;
    }
}

export function handleInitialShards(storeName: string, filePath: string, obj: KVDataStore): void {
    let existingFileCount = 0;
    for (let i = 0; i < 10; i++) {
        // Checking whether the file exist or not
        const fileName = `${i}.json`;
        if (fileExist(storeName, filePath, fileName)) {
            const fileP = path.join(filePath, storeName, fileName);
            const fileData = JSON.parse(fs.readFileSync(fileP, "utf8"));
            checkForOutdatedData(fileData, obj);
            existingFileCount++;
        } else {
            // Creating the file(Shards) if they doesn't exist
            const fileP = path.join(filePath, storeName, `${i}.json`);
            // If error occur during creation of file, it will throw error and stop
            // creation of data store.
            fs.writeFileSync(fileP, "{}", "utf8");
        }
    }
    if (existingFileCount > 0 && existingFileCount < 10) {
        logger.error("The files appear to have been altered or modified.");
        const error: Result = { status: Status.Failure, message: "The files appear to have been altered or modified."};
        throw error;
    }
}

function checkForOutdatedData<T extends JsonDataFormat>(fileData: T, obj: KVDataStore) {
    for (const k in fileData) {
        const createdAt = new Date(fileData[k].createdAt);
        const ttl = fileData[k].ttl;
        if (ttl !== null) {
            createdAt.setSeconds(createdAt.getSeconds() + ttl);
            const currDateTime = new Date();
            if (currDateTime > createdAt) {
                // Delete these data
                obj.deleteData(k)
                .then(() => {
                    logger.info(`Deleted outdated data, Key: ${k}`)
                })
                .catch(err => {
                    logger.error(`Failed to Delete outdated data, error: ${err}`)
                });
            }
        }
    }
}

export async function readFileAsync(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

export async function writeFileAsync(filePath: string, data: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(filePath, data, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}