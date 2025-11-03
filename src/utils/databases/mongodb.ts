// Using ES6 imports
import mongoose from 'mongoose';
import { logger } from '../logger/winston.js';

/**
 * I Am using `mongoose.createConnection` because i want to share MongoClient instance.
 * So this way can make MongoClient use to another purpose. Not only Mongose.
 *
 * Because :	`mongoose.createConnection` Returns the MongoDB driver MongoClient
 * 				instance that this connection uses to talk to MongoDB.
 *
 * Rizqi Pratama
 * Date : 2025-10-30
 */

const connection = mongoose.createConnection(process.env.MONGO_URI as string, {
	appName: `rekomendasiin-${Date.now()}`,
});

const mongoDbClient = connection.getClient();

const instance = async () => {
	await mongoDbClient.connect();
};

instance().catch((e: unknown) => {
	if (e instanceof Error) {
		logger.error(e);
	}
});

export { mongoDbClient, mongoose };
