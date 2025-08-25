import { app } from "./app";
import dotenv from "dotenv";
import { AppDataSource } from "./src/config/db";

dotenv.config();

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}/docs`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });
