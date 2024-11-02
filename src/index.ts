import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// Create express app
const app = express();

// Load env variables
dotenv.config();

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.json('Hello there 👋🏽');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
