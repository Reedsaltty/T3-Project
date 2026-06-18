import pino from "pino";
import { configDotenv } from "dotenv";
import pinoHttp from "pino-http";

// Load .env variables
configDotenv();

// 1. Initialize the transport correctly (using the 'targets' array syntax)
const transport = pino.transport({
  targets: [
    {
      target: "@logtail/pino",
      options: { sourceToken: process.env.LOGTAIL_SOURCE_TOKEN },
    },
    {
      target: "pino-pretty",
      options: { destination: 1 }, // process.stdout
    },
  ],
});

// 2. Create the main logger instance and EXPORT it
const log = pino(
  {
    level: process.env.PINO_LOG_LEVEL || "info",
    redact: {
      paths: ["id", "email", "password"],
      remove: true,
    },
  },
  transport,
);

export const logger = 
  pinoHttp({
    logger: log,
    customSuccessMessage: (req, res, responseTime) => {
      return `${req.method} ${req.url} completed with status ${res.statusCode} in ${responseTime}ms`;
    },
    customErrorMessage: (req, res, err) => {
      return `${req.method} ${req.url} failed with status ${res.statusCode} - ${err.message}`;
    },
  });

