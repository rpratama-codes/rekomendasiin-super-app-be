import express from 'express';
import 'dotenv/config';
import { loggerMiddleware } from './middleware/logger.ts';
import { entryPoint } from './service/misc/entry-point.ts';
import { logger } from './utils/logger/winston.ts';

const app = express();
app.use(loggerMiddleware);

const port = 3000;

app.get('/', entryPoint);

app.listen(port, () => {
	logger.info(`Example app listening on port ${port}`);
});
