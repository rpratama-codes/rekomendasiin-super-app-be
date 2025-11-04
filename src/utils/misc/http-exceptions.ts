export type HttpExceptionCode =
	// Client Errors
	| 400
	| 401
	| 402
	| 403
	| 404
	| 405
	| 406
	| 407
	| 408
	| 409
	| 410
	| 411
	| 412
	| 413
	| 414
	| 415
	| 416
	| 417
	| 421
	| 422
	| 423
	| 424
	| 425
	| 426
	| 428
	| 429
	| 431
	| 451
	// Server Errors
	| 500
	| 501
	| 502
	| 503
	| 504
	| 505
	| 506
	| 507
	| 508
	| 510
	| 511;

export type HttpErrorCode = {
	code: HttpExceptionCode;
	message: string;
	description: string;
};

export const httpExceptions: HttpErrorCode[] = [
	{
		code: 400,
		message: 'Bad Request',
		description:
			"The server couldn't understand the request due to invalid syntax.",
	},
	{
		code: 401,
		message: 'Unauthorized',
		description:
			'You must be authenticated to get this resource. Please log in.',
	},
	{
		code: 402,
		message: 'Payment Required',
		description:
			'This response is reserved for future use. A payment is required to proceed.',
	},
	{
		code: 403,
		message: 'Forbidden',
		description:
			"You are logged in, but you don't have permission to access this resource.",
	},
	{
		code: 404,
		message: 'Not Found',
		description: "The server can't find the requested resource or URL.",
	},
	{
		code: 405,
		message: 'Method Not Allowed',
		description:
			'The request method (e.g., GET, POST) is not allowed for this resource.',
	},
	{
		code: 406,
		message: 'Not Acceptable',
		description:
			"The server cannot produce a response matching the list of acceptable values in the request's headers.",
	},
	{
		code: 407,
		message: 'Proxy Authentication Required',
		description:
			'You must authenticate with a proxy server before this request can be served.',
	},
	{
		code: 408,
		message: 'Request Timeout',
		description:
			'The server timed out waiting for the request from the client.',
	},
	{
		code: 409,
		message: 'Conflict',
		description:
			'The request could not be completed due to a conflict with the current state of the resource.',
	},
	{
		code: 410,
		message: 'Gone',
		description:
			'The requested resource has been permanently deleted and is no longer available.',
	},
	{
		code: 411,
		message: 'Length Required',
		description:
			"The server rejected the request because it requires a 'Content-Length' header.",
	},
	{
		code: 412,
		message: 'Precondition Failed',
		description:
			'A precondition specified in the request headers was not met by the server.',
	},
	{
		code: 413,
		message: 'Content Too Large',
		description:
			'The request is larger than the server is willing or able to process.',
	},
	{
		code: 414,
		message: 'URI Too Long',
		description: 'The URL requested is too long for the server to process.',
	},
	{
		code: 415,
		message: 'Unsupported Media Type',
		description:
			'The media type of the requested data is not supported by the server.',
	},
	{
		code: 416,
		message: 'Range Not Satisfiable',
		description:
			"The requested range of data cannot be served (e.g., it's outside the file's size).",
	},
	{
		code: 417,
		message: 'Expectation Failed',
		description:
			"The server cannot meet the requirements of the 'Expect' request-header field.",
	},
	{
		code: 421,
		message: 'Misdirected Request',
		description:
			'The request was sent to a server that is not configured to handle it.',
	},
	{
		code: 422,
		message: 'Unprocessable Content (WebDAV)',
		description:
			"The request was well-formed, but the server couldn't process it due to semantic errors.",
	},
	{
		code: 423,
		message: 'Locked (WebDAV)',
		description: 'The resource you are trying to access is locked.',
	},
	{
		code: 424,
		message: 'Failed Dependency (WebDAV)',
		description:
			'The request failed because a previous request that it depended on failed.',
	},
	{
		code: 425,
		message: 'Too Early',
		description:
			'The server is unwilling to process a request that might be replayed.',
	},
	{
		code: 426,
		message: 'Upgrade Required',
		description:
			'The client should switch to a different protocol, like TLS/1.3, as indicated by the server.',
	},
	{
		code: 428,
		message: 'Precondition Required',
		description:
			'The server requires the request to be conditional to prevent update conflicts.',
	},
	{
		code: 429,
		message: 'Too Many Requests',
		description:
			"You've sent too many requests in a given amount of time. Please slow down.",
	},
	{
		code: 431,
		message: 'Request Header Fields Too Large',
		description:
			'The request header fields are too large for the server to process.',
	},
	{
		code: 451,
		message: 'Unavailable For Legal Reasons',
		description: 'Access to this resource is denied for legal reasons.',
	},

	// Server Errors
	{
		code: 500,
		message: 'Internal Server Error',
		description:
			'The server encountered an unexpected error that prevented it from fulfilling the request.',
	},
	{
		code: 501,
		message: 'Not Implemented',
		description:
			'The server does not support the functionality required to fulfill the request.',
	},
	{
		code: 502,
		message: 'Bad Gateway',
		description:
			'The server, acting as a gateway, received an invalid response from an upstream server.',
	},
	{
		code: 503,
		message: 'Service Unavailable',
		description:
			'The server is temporarily unavailable, usually due to maintenance or being overloaded.',
	},
	{
		code: 504,
		message: 'Gateway Timeout',
		description:
			'The server, acting as a gateway, did not get a timely response from an upstream server.',
	},
	{
		code: 505,
		message: 'HTTP Version Not Supported',
		description:
			'The HTTP version used in the request is not supported by the server.',
	},
	{
		code: 506,
		message: 'Variant Also Negotiates',
		description: 'There is an internal server configuration error.',
	},
	{
		code: 507,
		message: 'Insufficient Storage (WebDAV)',
		description:
			'The server is unable to store the data needed to complete the request.',
	},
	{
		code: 508,
		message: 'Loop Detected (WebDAV)',
		description:
			'The server detected an infinite loop while processing the request.',
	},
	{
		code: 510,
		message: 'Not Extended',
		description:
			'Further extensions to the request are required for the server to fulfill it.',
	},
	{
		code: 511,
		message: 'Network Authentication Required',
		description: 'You need to authenticate to gain network access.',
	},
];
