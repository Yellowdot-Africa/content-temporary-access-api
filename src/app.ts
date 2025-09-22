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
      title: "Content Security Temporary Access API",
      version: "1.0.0",
      description: `This API facilitates the assignment of temporary content security permissions to users, enabling controlled access for a duration of 24 hours.`,
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:4000",
      },
    ],
  },
  // ✅ Include both TS and JS so swagger works after build
  apis: [
    path.join(__dirname, "./controllers/**/*.ts"),
    path.join(__dirname, "./controllers/**/*.js"),
  ],
});

// Serve Swagger docs at /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use API routes prefixed with /api/v1
app.use("/api/v1", routes);
