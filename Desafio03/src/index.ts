import express from "express";
import { swaggerUi, swaggerSpec } from "./swagger";
import router from "./routes/tasks";
import logger from "./logger";

const app = express();
const port = 3000;

app.use(express.json()); //para o programa entender json

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); //cria a pagina do swagger

app.use("/tasks", router);

app.listen(port, () => {
  logger.info(`Servidor rodando em http://localhost:${port}`);
  logger.info(`Documentação Swagger em http://localhost:${port}/docs`);
});
