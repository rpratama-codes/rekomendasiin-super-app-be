import express from 'express';
import 'dotenv/config';
import { errorHandlerMiddleware } from './middleware/error-handler.js';
import { loggerMiddleware } from './middleware/logger.js';
import { authRouteV1 } from './route/auth-v1.route.js';
import { indexRoute } from './route/index.route.js';
import { storeFrontRoute } from './route/store-front.route.js';
import { logger } from './utils/logger/winston.js';

const app = express();
const router = express.Router();
const port = process.env.APP_PORT;

// If your app is served through a proxy
// trust the proxy to allow authjs to read the `X-Forwarded-*` headers
app.set('trust proxy', true);

app.use(loggerMiddleware);
app.use(router);
app.use(errorHandlerMiddleware);
app.use(express.json());
app.use('/api', router);

router.use(indexRoute);
router.use(storeFrontRoute);
router.use(authRouteV1);

app.listen(port, () => {
	logger.info(`Example app listening on port ${port}`);
});

export default app;
