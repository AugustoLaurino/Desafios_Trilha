import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", //registrar tudo que seja importante ou mais sério, como informações, avisos e erros.
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "error.log", level: "error" }), //salva os loggers de erro no arquivo error.log
    new transports.File({ filename: "combined.log" }), //salva todos os loggers nesse arquivo, sendo error ou nao
  ],
});

export default logger;
