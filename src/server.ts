import { app } from "./app";
import { AppDataSource } from "./config/db";
import dotenv from "dotenv";
import { createLogger } from "./utils/logger";

dotenv.config();

const logger = createLogger("Server");

const PORT = Number(process.env.PORT) || 3300;

AppDataSource.initialize()
  .then(() => {
    logger.info("✅ Database connected");
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`🚀 Server running at ${process.env.BASE_URL}/docs`);
    });
  })
  .catch((err) => {
    logger.error("❌ DB connection failed", { error: err });
  });
