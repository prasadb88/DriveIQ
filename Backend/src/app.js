import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import carRouter from "./routes/carinfo.routes.js"
import testDriveRouter from "./routes/testdrive.routes.js"

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/testdrive", testDriveRouter);



export default app;