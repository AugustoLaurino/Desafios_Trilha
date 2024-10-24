# API de Gerenciamento de Tarefas

## Visão Geral

Este projeto é uma API de Gerenciamento de Tarefas construída utilizando Node.js com TypeScript. A API permite realizar operações de CRUD (criação, leitura, atualização e exclusão) em tarefas. O banco de dados utilizado é o SQLite. O projeto também utiliza Zod para validação de entradas, Winston para geração de logs e Swagger para documentação interativa da API.

---

## Funcionalidades

- **Operações CRUD**: Criar, Ler, Atualizar e Excluir tarefas.
- **Atributos da Tarefa**:
  - `id` (UUID)
  - `name` (string, até 128 caracteres)
  - `description` (string, até 255 caracteres, opcional)
  - `status` (enum: `'pending' | 'in_progress' | 'done'`)
- **Validação de Dados** com Zod.
- **Banco de Dados**: SQLite para armazenamento persistente.
- **Registro de Logs** com Winston.
- **Documentação da API** com Swagger.
- **Tratamento de Erros**: Respostas padronizadas para erros de validação e erros do servidor.

---

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no backend.
- **TypeScript**: Superset de JavaScript para tipagem estática.
- **Express.js**: Framework minimalista para criação de APIs.
- **SQLite**: Banco de dados leve e eficiente.
- **Zod**: Biblioteca de validação de esquemas.
- **Winston**: Biblioteca de registro de logs.
- **Swagger**: Documentação interativa da API.
- **ESLint e Prettier**: Ferramentas de qualidade e formatação de código.

---

## Instalação

### Pré-requisitos

- Node.js (v16+)
- npm ou yarn

### Passos para Configuração

# Dependências do Projeto

Este projeto utiliza as seguintes dependências. Para instalá-las, utilize o comando `npm install`.

## Dependências Principais

- **express**: Framework para criar servidores web e APIs.
- **typescript**: Superset do JavaScript que adiciona tipagem estática.
- **sqlite3**: Biblioteca para interagir com bancos de dados SQLite.
- **zod**: Biblioteca para validação de esquemas de dados.
- **winston**: Biblioteca para logging (registro de logs).
- **swagger-ui-express**: Integração do Swagger UI com o Express para documentação da API.

## Dependências de Desenvolvimento

- **@types/node**: Tipos TypeScript para Node.js.
- **@types/express**: Tipos TypeScript para Express.js.
- **@types/sqlite3**: Tipos TypeScript para SQLite3.
- **eslint**: Ferramenta para análise de código estático para encontrar problemas.
- **prettier**: Ferramenta de formatação de código.
- **ts-node**: Execução de arquivos TypeScript diretamente.

## Instalação

Para instalar as dependências principais, execute:

```bash
npm install express typescript sqlite3 zod winston swagger-ui-express cors
```

Para instalar as dependências de desenvolvimento, execute:

```bash
npm install --save-dev @types/node @types/express @types/sqlite3 eslint prettier ts-node
```

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

## Fontes de Dados

Durante o desenvolvimento, utilizamos as seguintes fontes de dados:

- **Banco de Dados**: SQLite

  - A estrutura do banco de dados possui uma tabela tasks com as seguintes colunas:
    - `id`: UUID (Chave primária)
    - `name`: string (máximo de 128 caracteres)
    - `description`: string (máximo de 255 caracteres, opcional)
    - `status`: string (enum: `pending`, `in_progress`, `done`)

- **Validação de Esquemas**: Utilizamos o Zod para validar os dados das tarefas no arquivo `schemas/task.ts`:

  ```typescript
  const taskSchema = z.object({
    name: z.string().max(128),
    description: z.string().max(255).optional(),
    status: z.enum(["pending", "in_progress", "done"]),
  });
  ```

  Esse esquema também é utilizado para validar atualizações parciais com `taskSchema.partial()`.

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
