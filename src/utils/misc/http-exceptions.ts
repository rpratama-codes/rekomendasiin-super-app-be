export type HttpStatusCodes = {
	code:
		| HttpInformationalStatusCode
		| HttpSuccessfulStatusCode
		| HttpRedirectionStatusCode
		| HttpExceptionStatusCode;
	message: string;
	description: string;
};

export const httpExceptions: HttpStatusCodes[] = [
	// Informational responses
	{
		code: 100,
		message: 'Continue',
		description:
			'This interim response indicates that the client should continue the request or ignore the response if the request is already finished.',
	},
	{
		code: 101,
		message: 'Switching Protocols',
		description:
			'This code is sent in response to an Upgrade request header from the client and indicates the protocol the server is switching to.',
	},
	{
		code: 102,
		message: 'Processing (WebDAV)',
		description:
			'This code indicates that the server has received and is processing the request, but no response is available yet.',
	},
	{
		code: 103,
		message: 'Early Hints',
		description:
			'This status code is primarily intended to be used with the Link header, letting the user agent start preloading resources while the server prepares a response.',
	},
	// Successful responses
	{
		code: 200,
		message: 'OK',
		description:
			'The request succeeded. The result depends on the HTTP method (GET, HEAD, PUT, POST, or TRACE).',
	},
	{
		code: 201,
		message: 'Created',
		description:
			'The request succeeded, and a new resource was created as a result. This is typically the response sent after POST or some PUT requests.',
	},
	{
		code: 202,
		message: 'Accepted',
		description:
			'The request has been received but not yet acted upon. It is intended for cases where another process or server handles the request, or for batch processing.',
	},
	{
		code: 203,
		message: 'Non-Authoritative Information',
		description:
			'This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy.',
	},
	{
		code: 204,
		message: 'No Content',
		description:
			'There is no content to send for this request, but the headers may be useful. The user agent may update its cached headers for this resource with the new ones.',
	},
	{
		code: 205,
		message: 'Reset Content',
		description:
			'Tells the user agent to reset the document which sent this request.',
	},
	{
		code: 206,
		message: 'Partial Content',
		description:
			'This response code is used when the Range header is sent from the client to request only part of a resource.',
	},
	{
		code: 207,
		message: 'Multi-Status (WebDAV)',
		description:
			'Conveys information about multiple resources, for situations where multiple status codes might be appropriate.',
	},
	{
		code: 208,
		message: 'Already Reported (WebDAV)',
		description:
			'Used inside a <dav:propstat> response element to avoid repeatedly enumerating the internal members of multiple bindings to the same collection.',
	},
	{
		code: 226,
		message: 'IM Used (HTTP Delta encoding)',
		description:
			'The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.',
	},
	// Redirection messages
	{
		code: 300,
		message: 'Multiple Choices',
		description:
			'The request has more than one possible response. The user agent or user should choose one of them.',
	},
	{
		code: 301,
		message: 'Moved Permanently',
		description:
			'The URL of the requested resource has been changed permanently. The new URL is given in the response.',
	},
	{
		code: 302,
		message: 'Found',
		description:
			'This response code means that the URI of the requested resource has been changed temporarily.',
	},
	{
		code: 303,
		message: 'See Other',
		description:
			'The server sent this response to direct the client to get the requested resource at another URI with a GET request.',
	},
	{
		code: 304,
		message: 'Not Modified',
		description:
			'This is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version of the response.',
	},
	{
		code: 305,
		message: 'Use Proxy',
		description:
			'Defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns.',
	},
	{
		code: 306,
		message: 'unused',
		description: 'This response code is no longer used; it is just reserved.',
	},
	{
		code: 307,
		message: 'Temporary Redirect',
		description:
			'The server sends this response to direct the client to get the requested resource at another URI with the same method that was used in the prior request.',
	},
	{
		code: 308,
		message: 'Permanent Redirect',
		description:
			'This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header.',
	},
	// Client error responses
	{
		code: 400,
		message: 'Bad Request',
		description:
			'The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax).',
	},
	{
		code: 401,
		message: 'Unauthorized',
		description:
			'The client must authenticate itself to get the requested response.',
	},
	{
		code: 402,
		message: 'Payment Required',
		description:
			'This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems.',
	},
	{
		code: 403,
		message: 'Forbidden',
		description:
			'The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource.',
	},
	{
		code: 404,
		message: 'Not Found',
		description:
			'The server cannot find the requested resource. In the browser, this means the URL is not recognized.',
	},
	{
		code: 405,
		message: 'Method Not Allowed',
		description:
			'The request method is known by the server but is not supported by the target resource.',
	},
	{
		code: 406,
		message: 'Not Acceptable',
		description:
			"This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.",
	},
	{
		code: 407,
		message: 'Proxy Authentication Required',
		description:
			'This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.',
	},
	{
		code: 408,
		message: 'Request Timeout',
		description:
			'This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection.',
	},
	{
		code: 409,
		message: 'Conflict',
		description:
			'This response is sent when a request conflicts with the current state of the server.',
	},
	{
		code: 410,
		message: 'Gone',
		description:
			'This response is sent when the requested content has been permanently deleted from server, with no forwarding address.',
	},
	{
		code: 411,
		message: 'Length Required',
		description:
			'Server rejected the request because the Content-Length header field is not defined and the server requires it.',
	},
	{
		code: 412,
		message: 'Precondition Failed',
		description:
			'The client has indicated preconditions in its headers which the server does not meet.',
	},
	{
		code: 413,
		message: 'Content Too Large',
		description: 'The request entity is larger than limits defined by server.',
	},
	{
		code: 414,
		message: 'URI Too Long',
		description:
			'The URI requested by the client is longer than the server is willing to interpret.',
	},
	{
		code: 415,
		message: 'Unsupported Media Type',
		description:
			'The media format of the requested data is not supported by the server, so the server is rejecting the request.',
	},
	{
		code: 416,
		message: 'Range Not Satisfiable',
		description:
			'The range specified by the Range header field in the request cannot be fulfilled.',
	},
	{
		code: 417,
		message: 'Expectation Failed',
		description:
			'This response code means the expectation indicated by the Expect request header field cannot be met by the server.',
	},
	{
		code: 418,
		message: "I'm a teapot",
		description: 'The server refuses the attempt to brew coffee with a teapot.',
	},
	{
		code: 421,
		message: 'Misdirected Request',
		description:
			'The request was directed at a server that is not able to produce a response.',
	},
	{
		code: 422,
		message: 'Unprocessable Content (WebDAV)',
		description:
			'The request was well-formed but was unable to be followed due to semantic errors.',
	},
	{
		code: 423,
		message: 'Locked (WebDAV)',
		description: 'The resource that is being accessed is locked.',
	},
	{
		code: 424,
		message: 'Failed Dependency (WebDAV)',
		description: 'The request failed due to failure of a previous request.',
	},
	{
		code: 425,
		message: 'Too Early',
		description:
			'Indicates that the server is unwilling to risk processing a request that might be replayed.',
	},
	{
		code: 426,
		message: 'Upgrade Required',
		description:
			'The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.',
	},
	{
		code: 428,
		message: 'Precondition Required',
		description: 'The origin server requires the request to be conditional.',
	},
	{
		code: 429,
		message: 'Too Many Requests',
		description:
			'The user has sent too many requests in a given amount of time (rate limiting).',
	},
	{
		code: 431,
		message: 'Request Header Fields Too Large',
		description:
			'The server is unwilling to process the request because its header fields are too large.',
	},
	{
		code: 451,
		message: 'Unavailable For Legal Reasons',
		description:
			'The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.',
	},
	// Server error responses
	{
		code: 500,
		message: 'Internal Server Error',
		description:
			'The server has encountered a situation it does not know how to handle.',
	},
	{
		code: 501,
		message: 'Not Implemented',
		description:
			'The request method is not supported by the server and cannot be handled.',
	},
	{
		code: 502,
		message: 'Bad Gateway',
		description:
			'This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.',
	},
	{
		code: 503,
		message: 'Service Unavailable',
		description:
			'The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded.',
	},
	{
		code: 504,
		message: 'Gateway Timeout',
		description:
			'This error response is given when the server is acting as a gateway and cannot get a response in time.',
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
		description:
			'The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper endpoint in the negotiation process.',
	},
	{
		code: 507,
		message: 'Insufficient Storage (WebDAV)',
		description:
			'The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.',
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
		description:
			'Indicates that the client needs to authenticate to gain network access.',
	},
];

export type HttpInformationalStatusCode = 100 | 101 | 102 | 103;
export type HttpSuccessfulStatusCode =
	| 200
	| 201
	| 202
	| 203
	| 204
	| 205
	| 206
	| 207
	| 208
	| 226;
export type HttpRedirectionStatusCode =
	| 300
	| 301
	| 302
	| 303
	| 304
	| 305
	| 306
	| 307
	| 308;
export type HttpExceptionStatusCode =
	// 4xx Client Error
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
	| 418
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

	// 5xx Server Error
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
