# API de Gerenciamento de Tarefas

## Visão Geral

Este projeto é uma API de Gerenciamento de Tarefas construída utilizando Node.js com TypeScript. A API permite realizar operações de CRUD (criação, leitura, atualização e exclusão) em tarefas com controle de autenticação JWT e permissões de usuário. O projeto também integra cache com Redis para otimizar consultas frequentes e usa Docker para simplificar a execução em ambientes variados. O banco de dados utilizado é o Postgres. O projeto também utiliza Zod para validação de entradas, Winston para geração de logs e Swagger para documentação interativa da API.

---

## Funcionalidades

- **Operações CRUD**: Criar, Ler, Atualizar e Excluir tarefas.
- **Atributos da Tarefa**:
  - `id` (UUID)
  - `name` (string, até 128 caracteres)
  - `description` (string, até 255 caracteres, opcional)
  - `status` (enum: `'pending' | 'in_progress' | 'done'`)
- **Validação de Dados** com Zod.
- **Banco de Dados**: Postgres para armazenamento persistente.
- **Registro de Logs** com Winston.
- **Documentação da API** com Swagger.
- **Tratamento de Erros**: Respostas padronizadas para erros de validação e erros do servidor.
- **Rate Limiting**: Limite de 60 requisições por minuto nas rotas, retornando erro caso o limite seja ultrapassado.
- **Autenticação JWT**: Exige que o usuário esteja autenticado para acessar rotas de criação, edição e exclusão de tarefas.
- **Autorização**: Garante que apenas usuários autorizados possam modificar tarefas.
- **Cache com Redis**: Utilizado para cachear as respostas das rotas de listagem de tarefas, otimizado para consultas frequentes. Cache é invalidado e atualizado após operações de adição, atualização ou exclusão.
- **Containerização com Docker**: Facilita a execução da aplicação em diferentes ambientes, com uso de Docker Compose para gerenciamento de serviços, incluindo Redis.

---

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no backend.
- **TypeScript**: Superset de JavaScript para tipagem estática.
- **Express.js**: Framework minimalista para criação de APIs.
- **Postgres**: Banco de dados leve e eficiente.
- **Zod**: Biblioteca de validação de esquemas.
- **Winston**: Biblioteca de registro de logs.
- **Swagger**: Documentação interativa da API.
- **ESLint e Prettier**: Ferramentas de qualidade e formatação de código.
- **Redis**: Cache para otimização de consultas de listagem de tarefas.
- **Docker e Docker Compose**: Containerização para consistência em ambientes variados.

---

## Instalação

### Pré-requisitos

- Node.js (v16+)
- npm ou yarn
- Docker e Docker Compose

### Passos para Configuração

1. Clone o repositório.
2. Instale as dependências com `npm install` ou `yarn install`.
3. Configure o ambiente, criando um arquivo `.env` e definindo as variáveis de ambiente necessárias, como a chave secreta JWT e as configurações do Redis.
4. Para iniciar o ambiente Docker, execute o comando `docker-compose up`.

## Documentação da API

A documentação da API está disponível via Swagger e pode ser acessada através do endpoint `/docs` quando o servidor estiver rodando.

### Exemplos de Endpoints

#### 1. Criar uma Tarefa: `POST /tasks`

- **Corpo da Requisição**:

  ```json
  {
    "name": "Nome da tarefa",
    "description": "Descrição da tarefa",
    "status": "pending"
  }
  ```

- **Resposta**: `201 Created`

  ```json
  {
    "id": "uuid-gerado",
    "name": "Nome da tarefa",
    "description": "Descrição da tarefa",
    "status": "pending"
  }
  ```

#### 2. Listar Todas as Tarefas: `GET /tasks`

- **Parâmetros de Consulta**: (Opcional) Filtrar por status.

  - `status`: `pending | in_progress | done`

- **Resposta**: `200 OK`

  ```json
  [
    {
      "id": "uuid-gerado",
      "name": "Nome da tarefa",
      "description": "Descrição da tarefa",
      "status": "pending"
    },
    ...
  ]
  ```

#### 3. Obter Tarefa por ID: `GET /tasks/:id`

- **Resposta**: `200 OK` (se a tarefa existir) ou `404 Not Found` se a tarefa não for encontrada.

#### 4. Atualizar uma Tarefa: `PATCH /tasks/:id`

- **Corpo da Requisição**: (Somente os campos que deseja atualizar)

  ```json
  {
    "name": "Nome atualizado",
    "status": "in_progress"
  }
  ```

- **Resposta**: `200 OK`

  ```json
  {
    "message": "Tarefa atualizada com sucesso"
  }
  ```

#### 5. Excluir uma Tarefa: `DELETE /tasks/:id`

- **Resposta**: `200 OK`

  ```json
  {
    "message": "Tarefa deletada com sucesso"
  }
  ```

  ## Execução dos Containers

Para iniciar a aplicação com Docker Compose, execute:

```bash
docker-compose up
```

Isso iniciará tanto a API quanto o serviço Redis.

## Fontes de Dados

Durante o desenvolvimento, utilizamos as seguintes fontes de dados:

## Logger

- **Winston**: Utilizado para registrar eventos importantes, como a criação, atualização e exclusão de tarefas, bem como erros. Os logs são salvos no arquivo `logs/app.log`.

## Ferramentas de Desenvolvimento

- **ESLint**: Usado para garantir a qualidade do código.
- **Prettier**: Utilizado para formatar o código de maneira consistente.
- **Swagger**: Documentação automática da API gerada através de anotações no código.

## Tratamento de Erros

- **Erros de Validação (Zod)**: Se os dados de entrada não forem válidos, o servidor retorna um erro `400 Bad Request` com uma mensagem detalhada.
- **Tarefa Não Encontrada**: Quando uma tarefa não é encontrada pelo seu ID, o servidor retorna um erro `404 Not Found`.
- **Erros Internos**: Para problemas no servidor, o retorno será um erro `500 Internal Server Error`.

# Recursos de Estudo para Tecnologias Usadas

Aqui estão alguns links que utilizei para realizar esse projeto.

## 1. ESLint

- [Documentação Oficial do ESLint](https://eslint.org/docs/user-guide/getting-started)

## 2. Prettier

- [Documentação Oficial do Prettier](https://prettier.io/docs/en/index.html)

## 3. Swagger

- [Documentação Oficial do Swagger](https://swagger.io/docs/specification/v3_0/basic-structure/)

## 4. Winston

- [Documentação Oficial do Winston](https://github.com/winstonjs/winston)

## 5. Markdown

- [GitHub Markdown Guide](https://guides.github.com/features/mastering-markdown/)

## 6. Redis

- [Documentação do Redis](https://redis.io/documentation)

## 7. Docker

- [Documentação do Docker](https://docs.docker.com/get-started/)

## 7. Rate Limiter

- [Rate Limiter](https://www.youtube.com/watch?v=UUPI_-TcdL8)
