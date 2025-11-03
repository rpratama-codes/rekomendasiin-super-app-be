import express from 'express';
import 'dotenv/config';
import { loggerMiddleware } from './middleware/logger.js';
import { indexRoute } from './route/index.route.js';
import { logger } from './utils/logger/winston.js';

const app = express();
app.use(indexRoute);
app.use(loggerMiddleware);

const port = process.env.APP_PORT;

app.listen(port, () => {
	logger.info(`Example app listening on port ${port}`);
});
