import express from "express";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./docs/openapi";
import routes from "./routes";

export const app = express();

app.use(express.json());

// Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// API routes
app.use("/api", routes);
