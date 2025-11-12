import type {
	Application,
	ErrorRequestHandler,
	RequestHandler,
	Router,
} from 'express';

export type HappyRouterRoutes = {
	path: string | RegExp;
	method?:
		| 'all'
		| 'get'
		| 'post'
		| 'put'
		| 'delete'
		| 'patch'
		| 'options'
		| 'head';
	middlewares?: RequestHandler[];
	handlers: RequestHandler[];
};

export interface HappyRouterParams {
	expressRouter: Router;
	routes?: HappyRouterRoutes[];
	middlewares?: RequestHandler[];
	errorHandlers?: ErrorRequestHandler[];
	prefix?: string;
}

/**
 * This class is Express Router warper, return back express.Router.
 */
export class HappyRouter {
	protected name = 'happyRouter';
	protected expressRouter: Router;
	protected routes: HappyRouterRoutes[] | undefined;
	protected prefix: string | undefined;
	protected configs: Record<string, unknown> | undefined;
	protected middlewares: RequestHandler[] | undefined;
	protected errorHandlers: ErrorRequestHandler[] | undefined;

	constructor({
		expressRouter,
		routes,
		prefix,
		middlewares,
		errorHandlers,
	}: HappyRouterParams) {
		this.expressRouter = expressRouter;
		this.routes = routes;
		this.prefix = prefix;
		this.middlewares = middlewares;
		this.errorHandlers = errorHandlers;

		if (this.prefix) {
			this.expressRouter.use(this.prefix, this.expressRouter);
		}

		if (this.middlewares) {
			for (const middleware of this.middlewares) {
				this.expressRouter.use(middleware);
			}
		}

		if (this.routes) {
			for (const map of this.routes) {
				const defaultMethod = 'get';
				const method = map.method ?? defaultMethod;

				this.expressRouter[method](
					map.path,
					...(map.middlewares ?? []),
					...map.handlers,
				);
			}
		}

		if (this.errorHandlers) {
			for (const errorHandler of this.errorHandlers) {
				this.expressRouter.use(errorHandler);
			}
		}
	}

	/**
	 * This method is use to return back express router.
	 *
	 * @returns express.Router
	 */
	public compass() {
		if (this instanceof HappyApp && this.name === 'happyRouter') {
			throw Error('Please use sail on the app level route!');
		}

		return this.expressRouter;
	}
}

export interface HappyAppRoute extends HappyRouterRoutes {}

export interface HappyAppParams
	extends Omit<HappyRouterParams, 'expressRouter'> {
	/**
	 * Please use express Application here!
	 * because method set not available on router.
	 */
	expressApplication: Application;
	configs: Record<string, unknown>;
	routes: HappyAppRoute[];
}

/**
 * This class is Express Application warper, return back express.Application.
 */
export class HappyApp extends HappyRouter {
	protected readonly expressApplication: Application;

	constructor(params: HappyAppParams) {
		super({ ...params, expressRouter: params.expressApplication });
		this.expressApplication = params.expressApplication;

		if (this.configs) {
			const configs = Object.entries(this.configs);

			for (const [key, value] of configs) {
				this.expressApplication.set(key, value);
			}
		}
	}

	public sail(port: number, callback?: (error?: Error) => void): void;
	public sail(
		port: number,
		hostname: string,
		callback?: (error?: Error) => void,
	): void;
	public sail(
		port: number,
		hostname: string,
		backlog: number,
		callback?: (error?: Error) => void,
	): void;
	public sail(path: string, callback?: (error?: Error) => void): void;
	public sail(
		handle: unknown,
		listeningListener?: (error?: Error) => void,
	): void;
	public sail(callback?: (error?: Error) => void): void;

	public sail(...args: unknown[]): void {
		this.name = 'happyApp';
		// biome-ignore lint/complexity/noBannedTypes: Need for js overload signature!.
		(this.expressApplication.listen as Function)(...args);
	}
}
