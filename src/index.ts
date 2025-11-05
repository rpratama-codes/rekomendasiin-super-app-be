import express from 'express';
import 'dotenv/config';

import { errorHandlerMiddleware } from './middleware/error-handler.js';
import { loggerMiddleware } from './middleware/logger.js';
import { indexRoute } from './route/index.route.js';
import { storeFrontRoute } from './route/store-front.route.js';
import { logger } from './utils/logger/winston.js';

const app = express();
const port = process.env.APP_PORT;

app.use(loggerMiddleware);
app.use(indexRoute);
app.use(storeFrontRoute);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
	logger.info(`Example app listening on port ${port}`);
});

export default app;
