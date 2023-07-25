import fs from "fs";
import path from "path";
import logger from "../logger";
import { Result } from "../interfaces"
import { Status } from "../enums";

export function createInitialDirectory(name: string, filePath: string): void {
    try {
        //Creating the Data Directory where the data will be stored.
        fs.mkdirSync(path.join(filePath, name));
    } catch (e) {
        //If the data directory exist, then it will be used to store data.
        if (e.code == "EEXIST") logger.info("Directory already exist! Data will be saved there.");
        else throw e;
    }
}

export function handleInitialShards(name: string, filePath: string): void {
    let existingFileCount = 0;
    for (let i = 0; i < 10; i++) {
        try {
            // Checking whether the file exist or not
            const fileP = path.join(filePath, name, `${i}.json`);
            fs.readFileSync(fileP, "utf8");
            existingFileCount++;
        } catch (err) {
            if (err.code == "ENOENT") {
                //Creating the file(Shards) if they doesn't exist
                logger.warn(`File ${i}.json doesn't exist`);
                const fileP = path.join(filePath, name, `${i}.json`);
                fs.writeFileSync(fileP, "{}", "utf8");
            //Throwing the error to stop the creation of KVDataStore
            } else throw err;
        }
    }
    if (existingFileCount > 0 && existingFileCount < 10) {
        logger.error("The files appear to have been altered or modified.");
        const error: Result = { status: Status.Failure, message: "The files appear to have been altered or modified."};
        throw error;
    }
}