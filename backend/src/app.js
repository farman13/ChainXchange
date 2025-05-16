import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

import { userRouter } from "./routes/user.route.js";
import { tokenRouter } from "./routes/token.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/token", tokenRouter);

export { app };