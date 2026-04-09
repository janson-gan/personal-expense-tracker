import express, { Application } from "express";
import cors from "cors";
import health from "./routes/routes";
import httpLogger from "./middlewares/http.logger";
import { errorHandler } from "./middlewares/error.middleware";
import notFoundHandler from "./middlewares/notFound.middleware";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

// Routes
app.use("/api/v1", health);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
