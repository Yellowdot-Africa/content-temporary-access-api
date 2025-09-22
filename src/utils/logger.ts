import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Common log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`
  )
);

// Single daily rotated log file
const transport = new DailyRotateFile({
  filename: "logs/app-%DATE%.log",   // logs/app-2025-09-15.log
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

export const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});
