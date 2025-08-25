import { app } from "./app";
import { AppDataSource } from "././config/db";
import dotenv from "dotenv";

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
