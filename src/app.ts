import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import routes from "./routes";
import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();
export const app = express();

app.use(express.json());
app.use(cors());

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Content Security API",
      version: "1.0.0",
      description: `API documentation for Content Security Temporary Access.
      This API manages user content security permissions granting temporary access valid for 24 hours.`,
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:4000",
      },
    ],
  },
  apis: [path.join(__dirname, "./controllers/**/*.ts")], // ensure your controllers have updated Swagger comments
});

// Serve Swagger docs at /docs route
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use API routes prefixed with /api/v1
app.use("/api/v1", routes);
