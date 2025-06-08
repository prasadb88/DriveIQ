import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
    Credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/v1/user", userRouter);

export default app;