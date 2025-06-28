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
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());


app.get("/", (req, res) => {
  res.json({
    message: "Welcome to DriveIQ API",
    status: "Server is running successfully",
    version: "1.0.0"
  });
});

// Test endpoint to check environment variables
app.get("/api/v1/test", (req, res) => {
  const config = {
    database: {
      url: process.env.DATABASE_URL ? "Configured" : "Missing",
      name: "DriveIQ"
    },
    cloudinary: {
      name: process.env.CLOUDNARY_NAME ? "Configured" : "Missing",
      key: process.env.CLOUDNARY_KEY ? "Configured" : "Missing",
      secret: process.env.CLOUDNARY_SECRET ? "Configured" : "Missing"
    },
    jwt: {
      accessSecret: process.env.ACESSTOKEN_SECRET ? "Configured" : "Missing",
      refreshSecret: process.env.REFRESH_SECRET ? "Configured" : "Missing",
      accessExpiry: process.env.ACESSTOKEN_EXPIRY || "Not set",
      refreshExpiry: process.env.REFRESH_EXPIRY || "Not set"
    },
    frontend: {
      url: process.env.FRONTEND_URL || "Not configured"
    },
    environment: process.env.NODE_ENV || "development"
  };
  
  res.json({
    success: true,
    message: "Configuration test",
    config,
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/testdrive", testDriveRouter);

export default app;