// test/app.test.ts
import { assert } from 'chai';
import KVDataStore from '../src';
import path from "path";
import { rimraf } from "rimraf";

describe('Test Insertion KVDataStore', () => {
  let kv: KVDataStore
  const storeName: string = "TestDatabase"
  const directoryPath: string = path.join(__dirname, '..')

  before(async () => {
    kv = new KVDataStore(storeName , directoryPath);
  });

  after(() => {
    const filePath = path.join(directoryPath, storeName);
    setTimeout(async () => {
      rimraf.sync(filePath);
    }, 5 * 1000);
  });

  it('Insertion of Data', async () => {
    const res = await kv.createData("Test1", "123456");
      
    assert.strictEqual(res.message, "Insertion of data is successful");
  });

  it('Deletion of data after TTL', async () => {
    const res = await kv.createData("Test2", "123456", 1);
      
    assert.strictEqual(res.message, "Insertion of data is successful");
    setTimeout(async () => {
      const res = await kv.createData("Test2", "123456");
      
      assert.strictEqual(res.message, "Insertion of data is successful");
    }, 2 * 1000);
  });
});
