import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/configs/db.config.js';
import routeHandler from './src/middlewares/route_handler.middleware.js';


dotenv.config();

const app=express();
app.use(cors());
app.use(cookieParser());

app.use(express.json());

await connectDB();

//router

app.use(routeHandler);

export default app;