import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gerenciador de Tarefas API",
      version: "1.0.0",
      description:
        "Uma API para gerenciar tarefas, permitindo criar, atualizar, listar e excluir tarefas.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desenvolvimento",
      },
    ],
    tags: [
      {
        name: "Tarefas",
        description: "Operações relacionadas ao gerenciamento de tarefas",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
