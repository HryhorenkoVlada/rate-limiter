import express, { Request, Response } from 'express';
import 'dotenv/config';

import { rateLimitMiddleware } from './middlewares/rate-limit-middleware';
import { MAX_REQUESTS_AMOUNT, BLOCKING_INTERVAL_IN_SECONDS } from './constants';

const app = express();

// NOTE: this solution adds rates limits on application layer,
// app is still vulnerable to low-layer attacks (like flood attacks)
// to prevent this, we need to use something like DDoS Protection Services
app.use(
	rateLimitMiddleware({
		maxRequests: MAX_REQUESTS_AMOUNT,
		interval: BLOCKING_INTERVAL_IN_SECONDS,
	}),
);

app.get('/api/resource', (req: Request, res: Response) => {
	res.send('Resource data');
});

app.get('/api/other-resource', (req: Request, res: Response) => {
	res.send('Other resource data');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
