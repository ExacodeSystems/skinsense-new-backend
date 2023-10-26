import express from "express";
import bodyParser from "body-parser";
import { todoRoutes } from "./routes/index.js";
import { jsonErrorsHandler } from "./utils/errorsHandler.js";

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/todos", todoRoutes);

// Middlewares
app.use(jsonErrorsHandler)

export default app;
