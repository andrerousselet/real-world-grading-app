import 'dotenv/config';
import express, { Request, Response } from 'express';
import errorMiddleware from './middlewares/error.middleware';
import 'express-async-errors';

const PORT = process.env.PORT || 3001;

const app: express.Application = express();
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  return res.status(200).json({ ok: "true" });
});

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Running on PORT: ${PORT}`));