import { Request, Response, NextFunction } from 'express';

import { ClientData } from '../types/clientData';
import { RateLimitOptions } from '../types/rateLimitOptions';

export function rateLimitMiddleware({ maxRequests, interval }: RateLimitOptions) {
	// NOTE: Using Redis will be a more appropriate solution to store and manage clients' data, especially when load balancer is used
	const clients: Map<string, ClientData> = new Map();

	return (req: Request, res: Response, next: NextFunction) => {
		// NOTE: Timestamps can be managed with some library like moment.js
		const now = Date.now();
		const clientIP = req.ip;

		if (!clients.has(clientIP)) {
			clients.set(clientIP, { lastRequest: now, requestCount: 1 });

			// The other way to remove the client data after the interval
			// setTimeout(() => {
			//   clients.delete(clientIP);
			// }, interval * 1000);
		} else {
			const clientData = clients.get(clientIP) as ClientData;

			if (now - clientData.lastRequest > interval * 1000) {
				clients.set(clientIP, { lastRequest: now, requestCount: 1 });
			} else {
				clientData.requestCount++;

				if (clientData.requestCount > maxRequests) {
					return res
						.status(429)
						.send('Too Many Requests. The server is overloaded. Please wait for a minute.');
				}
			}
		}

		next();
	};
}

// TODO: add Redis
