import express, { type Response } from 'express';

const authRouteV1 = express.Router();

authRouteV1.use('/v1/auth/', authRouteV1);

authRouteV1.get('/', async (_req, res: Response) => {
	return res.status(200).json({ code: 200, message: 'ok' });
});

export { authRouteV1 };
