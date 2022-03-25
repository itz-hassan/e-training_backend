require("express-async-errors");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: "error.log" })],
  rejectionHandlers: [
    new winston.transports.File({ filename: "rejections.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      colorize: true,
      prettyPrint: true,
    })
  );
}
module.exports = logger;
