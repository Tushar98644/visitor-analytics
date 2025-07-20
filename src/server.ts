import express, { type Request, type Response } from 'express'
import 'dotenv/config'

const app = express();
app.use(express.json());

app.get('/health', (_: Request, res: Response) => res.send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API up on ${PORT}`));