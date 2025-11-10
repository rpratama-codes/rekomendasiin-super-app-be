import express from 'express';
import 'dotenv/config';
import { errorHandlerMiddleware } from './middleware/error-handler.js';
import { loggerMiddleware } from './middleware/logger.js';
import { authRouteV1 } from './routes/auth/auth-v1.route.js';
import { indexRoute } from './routes/index.route.js';
import { storeFrontRoute } from './routes/store-front/store-front.route.js';
import { logger } from './utils/logger/winston.js';

const app = express();
const router = express.Router();
const port = process.env.APP_PORT;

/**
 * Config for auth.js to allow read the X-Forwarded-*` headers
 */
app.set('trust proxy', true);

/**
 * THE ORDER IS MATTER!!!
 */

app.use(router);
app.use(express.json());
app.use(loggerMiddleware);
app.use('/api', router);
app.use(errorHandlerMiddleware);

router.use(indexRoute);
router.use(storeFrontRoute);
router.use(authRouteV1);

app.listen(port, () => {
	logger.info(`Example app listening on port ${port}`);
});

export default app;
