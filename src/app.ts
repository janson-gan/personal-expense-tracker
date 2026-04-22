import express, { Application } from "express";
import cors from "cors";
import health from "./routes/health.route";
import register from './routes/auth.route'
import httpLogger from "./middlewares/http.logger";
import { errorHandler } from "./middlewares/error.middleware";
import notFoundHandler from "./middlewares/notFound.middleware";
import helmet from "helmet";
import rateLimiter from "./middlewares/rateLimit.middleware";

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
// app.use(rateLimiter);

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(httpLogger);

// Health check routes
app.use("/api/v1", health);

// Student routes
app.use('/api/v1/auth', register)


// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
