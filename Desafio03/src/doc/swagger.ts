import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0", //versão padrao para criar documnetação API
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
  apis: ["./src/routes/*.ts"], //onde procurar as rotas e as definições que vão ser usadas para gerar a documentação
};

const swaggerSpec = swaggerJsdoc(options); // gera automaticamente a documentação baseada nas opções que configuramos

export { swaggerUi, swaggerSpec };
