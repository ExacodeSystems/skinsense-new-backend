import express from "express";
import bodyParser from "body-parser";
import { analyzerRoutes, productRoutes, todoRoutes } from "./routes/index.js";
import { jsonErrorsHandler } from "./utils/errorsHandler.js";

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/todos", todoRoutes);
app.use("/product", productRoutes)
app.use("/analyzer", analyzerRoutes)

// Middlewares
app.use(jsonErrorsHandler)

export default app;
