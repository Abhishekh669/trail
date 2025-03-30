import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { connectDB } from "./lib/db";

import userRouter from "./routes/user.route"
import captainRouter from "./routes/captain.route"
import rideRouter from "./routes/ride.route"
import { app, server } from "./lib/socket-io";

dotenv.config(
  {
    path : "./.env"
  }
);

const port = process.env.PORT || 8081;

connectDB();

app.use(cors({
  origin : "http://localhost:3000",
  optionsSuccessStatus : 200,
  credentials : true,
}))

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())


app.use("/user", userRouter)
app.use("/captain", captainRouter)
app.use("/rides", rideRouter);


server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});