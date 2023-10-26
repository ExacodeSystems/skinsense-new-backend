import express from "express";
import bodyParser from "body-parser";
import { productRoutes, todoRoutes } from "./routes/index.js";
import { jsonErrorsHandler } from "./utils/errorsHandler.js";

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/todos", todoRoutes);
app.use("/product", productRoutes)

// Middlewares
app.use(jsonErrorsHandler)

export default app;
