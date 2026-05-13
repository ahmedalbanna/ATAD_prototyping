import morgan from "morgan";

const logFormat =
  process.env.NODE_ENV === "production"
    ? ":remote-addr :method :url :status :res[content-length] - :response-time ms"
    : "dev";

export const requestLogger = morgan(logFormat);
