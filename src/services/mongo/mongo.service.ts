import mongodb from 'mongodb';

export class MongoServiceError extends Error {}

export class MongoService extends mongodb.MongoClient {
	constructor(url?: string, options?: mongodb.MongoClientOptions) {
		if (!process.env.MONGO_URI) {
			throw new MongoServiceError('MONGO_URI is not set!.');
		}

		if (!url) {
			url = process.env.MONGO_URI;
		}

		super(url, options);
	}
}
