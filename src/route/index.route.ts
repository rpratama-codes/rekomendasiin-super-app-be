import express, {
	type NextFunction,
	type Request,
	type Response,
} from 'express';

const indexRoute = express.Router();

indexRoute.get('/', (_req: Request, res: Response, _nx: NextFunction) => {
	return res.status(200).json({ code: 200, message: 'ok' });
});

export { indexRoute };
