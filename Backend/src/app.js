import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import carRouter from "./routes/carinfo.routes.js"
import testDriveRouter from "./routes/testdrive.routes.js"
import dotenv from 'dotenv'

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to DriveIQ API",
    status: "Server is running successfully",
    version: "1.0.0"
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/testdrive", testDriveRouter);

export default app;