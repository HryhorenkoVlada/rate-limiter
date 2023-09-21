import express, { Request, Response } from 'express';
import 'dotenv/config';

const app = express();

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
