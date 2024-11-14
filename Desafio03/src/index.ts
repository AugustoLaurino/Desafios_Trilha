import express from "express";
import { swaggerUi, swaggerSpec } from "./doc/swagger";
import router from "./routes/tasks";
import logger from "./utils/logger";
import limiter from "./services/rateLimiter";
import authRouter from "./routes/authRoutes";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/tasks", router);
app.use("/auth", authRouter);
app.use(limiter);

app.listen(port, () => {
  logger.info(`Servidor rodando em http://localhost:${port}`);
  logger.info(`Documentação Swagger em http://localhost:${port}/docs`);
});
