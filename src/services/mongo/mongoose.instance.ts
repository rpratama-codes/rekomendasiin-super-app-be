import mongoose from 'mongoose';
import { MongoService } from './mongo.service.js';

const mongoDbClient = new MongoService();

/**
 * New issue for mongoose, tell them to add support mongodb client v7.0.0
 * biome-ignore lint/suspicious/noExplicitAny: incompability type.
 */
mongoose.createConnection().setClient(mongoDbClient as any);

export { mongoose };
