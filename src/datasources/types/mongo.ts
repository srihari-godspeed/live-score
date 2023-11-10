import {
  GSContext,
  GSDataSource,
  GSStatus,
  PlainObject,
} from '@godspeedsystems/core';
import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from 'mongodb';

export default class DataSource extends GSDataSource {
  protected async initClient(): Promise<object> {
    try {
      const url =
        'mongodb+srv://srihari:srihari6281@mongo.qcjpnvp.mongodb.net/testing';
      const client = new MongoClient(url);
      const dbName = 'myProject';
      await client.connect();
      // console.log('Connected successfully to server');
      const db = client.db(dbName);
      const collection = db.collection('documents');
      return collection;
    } catch (error) {
      throw error;
    }
  }

  async execute(ctx: GSContext, args: PlainObject): Promise<any> {
    try {
      const {
        data,
        name,
        meta: { fnNameInWorkflow, entityType },
      } = args;

      let method = fnNameInWorkflow.split('.')[2];
      if (this.client) {
        if (method == 'createOne') {
          const res = await this.client.insertOne({
            _id: uuidv4,
            _data: data,
          });
          return res;
        }
        if (method == 'findOne') {
          const res = await this.client
            .find({
              '_data.name': name,
            })
            .toArray();
          return res;
        }
      } else {
        return 'Initialise the client';
      }
    } catch (error) {
      throw error;
    }
  }
}
const SourceType = 'DS';
const Type = 'mongo';
const CONFIG_FILE_NAME = 'mongo';
const DEFAULT_CONFIG = {};

export { DataSource, SourceType, Type, CONFIG_FILE_NAME, DEFAULT_CONFIG };
