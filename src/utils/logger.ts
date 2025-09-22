import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Custom log format to dynamically get label from metadata (child logger)
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, label, ...meta }) => {
    // Use label from info object or fallback to "app"
    const logLabel = label || meta.label || "app";
    return `[${timestamp}] ${level.toUpperCase()}: ${logLabel} - ${message}`;
  })
);

// Daily rotated log file transport
const transport = new DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

// Base logger
export const logger: winston.Logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

/**
 * Creates a child logger with a specific label (e.g., controller/service/repository name)
 * @param label Name of the module or layer
 * @returns Winston child logger with label
 */
export const createLogger = (label: string): winston.Logger => {
  return logger.child({ label });
};
