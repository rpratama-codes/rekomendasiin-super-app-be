import { MongoClient } from 'mongodb';

export class MongoServiceError extends Error {}

export class MongoService extends MongoClient {
	constructor() {
		if (!process.env.MONGO_URI) {
			throw new MongoServiceError('MONGO_URI is not set!.');
		}

		const url = process.env.MONGO_URI;

		super(url);
	}
}
