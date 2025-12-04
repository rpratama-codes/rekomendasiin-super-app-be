import type {
	Application,
	ErrorRequestHandler,
	RequestHandler,
	Router,
} from 'express';

export type HttpMethod =
	| 'all'
	| 'get'
	| 'post'
	| 'put'
	| 'delete'
	| 'patch'
	| 'options'
	| 'head';

export class HappyRouterRoute {
	public path: string | RegExp;
	public method?: HttpMethod | undefined;
	public handlers: RequestHandler[];
	public middlewares?: RequestHandler[] | undefined;
	public disable?: boolean = false;

	constructor(params: HappyRouterRoute) {
		this.path = params.path;
		this.method = params.method;
		this.handlers = params.handlers;
		this.middlewares = params.middlewares;
	}
}

export interface HappyRouterParams {
	expressRouter: Router;
	routes?: HappyRouterRoute[];
	/**
	 * routes and discover are the same,
	 * discover under will put under the the routes route.
	 * Instead of spreading routes, just put in discover.
	 */
	discover?: HappyRouterRoute[][];
	middlewares?: RequestHandler[];
	errorHandlers?: ErrorRequestHandler[];
	callbackLogger?: (message: string) => void;
	prefix?: string;
}

/**
 * Express Router Wrapper class.
 * This class encapsulates and returns an instance of an Express router (`express.Router()`).
 *
 * ⚠️ **IMPORTANT: Avoid Reusing the Same `express.Router()` Instance**
 *
 * Reusing the same `express.Router()` instance across multiple `HappyRouter` instances will
 * lead to a middleware or mounting loop, resulting in a **`Maximum call stack size exceeded`** error.
 *
 * **DO NOT** (Incorrect Reuse):
 *
 * ```typescript
 * const sharedRouter = express.Router(); // Same instance 'sharedRouter' is used twice.
 *
 * const routerA = new HappyRouter({
 * // ...
 * expressRouter : sharedRouter
 * });
 *
 * const routerB = new HappyRouter({
 * // ...
 * expressRouter : sharedRouter // ❌ Error potential here
 * });
 * ```
 *
 * **INSTEAD** (Correct Usage - Use a New Instance for Each):
 *
 * ```typescript
 * const routerInstanceA = express.Router();
 * const routerInstanceB = express.Router();
 *
 * const routerA = new HappyRouter({
 * // ...
 * expressRouter : routerInstanceA // ✅ Unique instance
 * });
 *
 * const routerB = new HappyRouter({
 * // ...
 * expressRouter : routerInstanceB // ✅ Unique instance
 * });
 * ```
 */
export class HappyRouter {
	protected name = 'happyRouter';
	protected expressRouter: Router;
	protected routes?: HappyRouterRoute[] | undefined;
	protected prefix?: string | undefined;
	protected configs?: Record<string, unknown> | undefined;
	protected middlewares?: RequestHandler[] | undefined;
	protected errorHandlers?: ErrorRequestHandler[] | undefined;
	protected callbackLogger?: ((message: string) => void) | undefined;
	protected discover?: HappyRouterRoute[][] | undefined;

	constructor(params: HappyRouterParams) {
		this.expressRouter = params.expressRouter;
		this.routes = params.routes;
		this.prefix = params.prefix;
		this.middlewares = params.middlewares;
		this.errorHandlers = params.errorHandlers;
		this.callbackLogger = params.callbackLogger;
		this.discover = params.discover;

		this.observ();
	}

	public static createRoute(params: HappyAppRoute[]) {
		return params;
	}

	protected log(message: string): void {
		if (this.callbackLogger) {
			this.callbackLogger(message);
		} else {
			console.log(message);
		}
	}

	protected observ() {
		if (this.prefix) {
			this.expressRouter.use(this.prefix, this.expressRouter);
			this.log(`Prefix - ${this.prefix}`);
		}

		if (this.middlewares) {
			for (const middleware of this.middlewares) {
				this.expressRouter.use(middleware);
			}
		}

		if (this.routes) {
			for (const route of this.routes) {
				if (route.disable) {
					continue;
				}

				const defaultMethod = 'get';
				const method = route.method ?? defaultMethod;

				this.expressRouter[method](
					route.path,
					...(route.middlewares ?? []),
					...route.handlers,
				);

				const logMessage = `Route - ${method.toUpperCase()} - ${this.prefix ?? ''}${route.path}`;
				this.log(logMessage);
			}
		}

		if (this.discover) {
			const discoveries = this.discover.flat();
			for (const route of discoveries) {
				const defaultMethod = 'get';
				const method = route.method ?? defaultMethod;

				this.expressRouter[method](
					route.path,
					...(route.middlewares ?? []),
					...route.handlers,
				);

				const logMessage = `Route - ${method.toUpperCase()} - ${this.prefix ?? ''}${route.path}`;
				this.log(logMessage);
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

export interface HappyAppRoute extends HappyRouterRoute {}

export interface HappyAppParams
	/**'
	 * prefix is not support for root instance,
	 * instead you should express router or new express instance.
	 */
	extends Omit<HappyRouterParams, 'expressRouter' | 'prefix'> {
	/**
	 * Please use express Application here!
	 * because method set not available on router.
	 */
	expressApplication: Application;
	appName?: string | undefined;
	configs: Record<string, unknown>;
	routes?: HappyAppRoute[];
}

/**
 * This class is Express Application warper, return back express.Application.
 */
export class HappyApp extends HappyRouter {
	protected readonly expressApplication: Application;

	constructor(params: HappyAppParams) {
		const { expressApplication, appName, ...restParams } = params;

		if (appName) {
			process.title = appName.toLowerCase().split(' ').join('-');
		}

		super({ expressRouter: expressApplication, ...restParams });
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
