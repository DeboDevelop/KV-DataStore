import fs from "fs";
import path from "path";
import logger from "../logger";
import { Result } from "../interfaces"
import { Status } from "../enums";

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

export function handleInitialShards(storeName: string, filePath: string): void {
    let existingFileCount = 0;
    for (let i = 0; i < 10; i++) {
        // Checking whether the file exist or not
        if (fileExist(storeName, filePath, `${i}.json`)) {
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