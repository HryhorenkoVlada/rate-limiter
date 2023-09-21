import express, { Express } from 'express';
import request from 'supertest';

import { rateLimitMiddleware } from '../src/middlewares/rate-limit-middleware';

describe('rateLimitMiddleware', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(rateLimitMiddleware({ maxRequests: 5, interval: 60 }));
    app.get('/test', (req, res) => res.send('ok'));
  });

  it('allows requests under the limit', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app).get('/test');
      expect(res.status).toBe(200);
      expect(res.text).toBe('ok');
    }
  });

  it('blocks requests over the limit', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).get('/test');
    }

    const res = await request(app).get('/test');
    expect(res.status).toBe(429);
    expect(res.text).toBe(
      'Too Many Requests. The server is overloaded. Please wait for a minute.'
    );
  });

  it('resets request count after the interval', async () => {
    jest.useFakeTimers();

    for (let i = 0; i < 5; i++) {
      await request(app).get('/test');
    }

    jest.advanceTimersByTime(60001); // advance time by 60,001 milliseconds (just over 1 minute)

    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
    expect(res.text).toBe('ok');

    jest.useRealTimers();
  });
});
