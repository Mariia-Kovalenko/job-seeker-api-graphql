import express from 'express';
import type { Request, Response } from 'express';
import testRoutes from './routes/testRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript API!');
});

app.use('/test', testRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});