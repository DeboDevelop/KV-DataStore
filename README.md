## KV-DataStore

The KV-DataStore is a hybrid key-value store that combines the benefits of in-memory caching with on-disk persistence, and also supports Time to Live (TTL) for automatic key-value expiry. On-disk persistence is based on MD5 hash-based sharding with a fixed number of 10 shards. The data is persisted in JSON files. In-memory caching is supported by an LRU cache.

### Recommended Requirements

node v18.16.0 or above.

npm v9.5.1 or above.

### To Run Locally

1. Clone the Repository.
2. Run `cd KV-DataStore`.
3. Run `npm i` to download the dependencies.
4. Run `npm test` to run the test.
5. Run `npm run build` to compile the ts files in js.
6. Create a new file, import the library and use it.

### How to use the library

Import the Library

```
const KVDataStore = require("./dist/index");
```

Create an object of the KVDataStore class. The Object will accept the store name and an optional path. Always prive the absolute path. If no path or an invalid path is provided then, it will default to the current directory.

```
let datastore = new KVDataStore("Some Name");
```

or

```
let datastore = new KVDataStore("Some name", "/something/something/")
```

Insert data using the createData method. createData method is asynchronous in nature. It takes 3 parameters - key, value and second. The key must be a string and the value can be of any type. The third parameter is optional, it is the number of features till expire.

```
let key = "123456";
let value = {
    read: "Write",
    Music: "Melody",
};
```

```
let d1 = datastore.createData(key, value)
d1.then(res => {
    //do something
}).catch(err => {
    //do something
});
```

or

```
let d1 = datastore.createData(key, value, 10)
d1.then(res => {
    //do something
}).catch(err => {
    //do something
});
```

or

```
async function func() {
    try {
        let d1 = await datastore.createData(key, value)
        //do somthing
    } catch(err) {
        //do something
    }
}
```

or

```
async function func() {
    try {
        let d1 = await datastore.createData(key, value, 10)
        //do somthing
    } catch(err) {
        //do something
    }
}
```

Fetch data using the readData function. It only takes the 1 parameter - key and is asynchronous in nature. The key must be a string and must exist in the datastore, otherwise, promise will be rejected.

```
let d1 = datastore.readData(key)
d1.then(res => {
    //do something
}).catch(err => {
    //do something
});
```

or

```
async function func() {
    try {
        let d1 = await datastore.readData(key)
        //do somthing
    } catch(err) {
        //do something
    }
}
```

Update data using the deleteData function. It only takes the 2 parameters - key and value and is asynchronous in nature. The key must be a string and must exist in the datastore, otherwise, the promise will be rejected. The value can be of any type.

```
let d1 = datastore.updateData(key, value)
d1.then(res => {
    //do something
}).catch(err => {
    //do something
});
```

or

```
async function func() {
    try {
        let d1 = await datastore.updateData(key, value)
        //do somthing
    } catch(err) {
        //do something
    }
}
```

Update the expiry of data using the updateTTL function. It only takes the 2 parameters - key and second and is asynchronous in nature. The key must be a string and must exist in the datastore, otherwise, the promise will be rejected. If the TTL is not null i.e. expiry is already set then the promise will be rejected.

```
let d1 = datastore.updateTTL(key, seconds)
d1.then(res => {
    //do something
}).catch(err => {
    //do something
});
```

or

```
async function func() {
    try {
        let d1 = await datastore.updateTTL(key, seconds)
        //do somthing
    } catch(err) {
        //do something
    }
}
```

Delete data using the deleteData function. It only takes the 1 parameter - key and is asynchronous in nature. The key must be a string and must exist in the datastore, otherwise, promise will be reje

```
let d1 = datastore.deleteData(key)
d1.then(res => {
    //do something
}).catch(err => {
    //do something
});
```

or

```
async function func() {
    try {
        let d1 = await datastore.deleteData(key)
        //do somthing
    } catch(err) {
        //do something
    }
}
```

### License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.

### Author

[Debajyoti Dutta](https://github.com/DeboDevelop)