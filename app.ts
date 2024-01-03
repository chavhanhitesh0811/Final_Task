import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ErrorMiddleware from './middleware/Error';
import connection from './config/connection';

const app: Application = express();
app.use(express.json());
app.use(cors());

connection();

app.use(express.urlencoded({
    extended: true,
}));

dotenv.config({
    path: './config/.env'
});

import taskRouter from './routes/taskRouter';

app.use("/api",taskRouter);

export default app;

app.use(ErrorMiddleware);