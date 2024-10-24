import express, { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../database";
import logger from "../logger";
import taskSchema from "../schemas/task";

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retorna a lista de todas as tarefas
 *     description: Obtém a lista completa de tarefas cadastradas, com possibilidade de filtrar por status.
 *     tags: [Tarefas]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, done]
 *         description: Filtrar tarefas por status
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get("/", async (req, res) => {
  const database = await db;
  const { status } = req.query;

  let query = "SELECT * FROM tasks";
  let params = [];

  if (status) {
    query += " WHERE status = ?";
    params.push(status);
  }

  const tasks = await database.all(query, params);
  logger.info("Tarefas encontradas.");
  res.json(tasks);
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtém uma tarefa pelo ID
 *     description: Retorna uma tarefa específica com base no ID fornecido.
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa a ser buscada
 *     responses:
 *       200:
 *         description: Detalhes da tarefa
 *         content:
 *           application/json:
 *       404:
 *         description: Tarefa não encontrada
 */
router.get("/:id", async (req: Request<{ id: string }>, res: any) => {
  try {
    const { id } = req.params;
    const database = await db;

    const task = await database.get("SELECT * FROM tasks WHERE id = ?", [id]);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    logger.info(`Tarefa encontrada: ${JSON.stringify(task)}`);
    res.json(task);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar tarefa: ${error.message}`);
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Erro desconhecido" });
    }
  }
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Cria uma nova tarefa
 *     description: Adiciona uma nova tarefa ao sistema com nome, descrição e status.
 *     tags: [Tarefas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *                 description: O nome da tarefa (máx. 128 caracteres)
 *               description:
 *                 type: string
 *                 description: A descrição da tarefa (máx. 255 caracteres)
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, done]
 *                 description: O status da tarefa
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       400:
 *         description: Erro na requisição (validação de dados)
 */

router.post("/", async (req, res) => {
  try {
    const taskData = taskSchema.parse(req.body);
    const newTask = { ...taskData, id: uuidv4() };
    const database = await db;

    await database.run(
      "INSERT INTO tasks (id, name, description, status) VALUES (?, ?, ?, ?)",
      [newTask.id, newTask.name, newTask.description, newTask.status]
    );
    logger.info(`Nova tarefa criada: ${JSON.stringify(newTask)}`);
    res.status(201).json(newTask);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao criar tarefa: ${error.message}`);
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Erro desconhecido" });
    }
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Atualiza uma tarefa existente
 *     description: Atualiza o nome, descrição ou status de uma tarefa específica.
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: O nome da tarefa (máx. 128 caracteres)
 *               description:
 *                 type: string
 *                 description: A descrição da tarefa (máx. 255 caracteres)
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, done]
 *                 description: O status da tarefa
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *       400:
 *         description: Erro na validação dos dados
 *       404:
 *         description: Tarefa não encontrada
 */
router.patch("/:id", async (req: Request<{ id: string }>, res: any) => {
  try {
    const { id } = req.params;
    const taskData = taskSchema.partial().parse(req.body);
    const database = await db;

    const task = await database.get("SELECT * FROM tasks WHERE id = ?", [id]);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    await database.run(
      "UPDATE tasks SET name = ?, description = ?, status = ? WHERE id = ?",
      [
        taskData.name || task.name,
        taskData.description || task.description,
        taskData.status || task.status,
        id,
      ]
    );
    logger.info(
      `Tarefa atualizada: ${JSON.stringify({ ...task, ...taskData })}`
    );
    res.status(200).json({ ...task, ...taskData });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao atualizar tarefa: ${error.message}`);
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Erro desconhecido" });
    }
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Remove uma tarefa
 *     description: Deleta uma tarefa existente com base no ID.
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa a ser removida
 *     responses:
 *       200:
 *         description: Tarefa removida com sucesso
 *       404:
 *         description: Tarefa não encontrada
 */
router.delete("/:id", async (req: Request<{ id: string }>, res: any) => {
  try {
    const { id } = req.params;
    const database = await db;

    const task = await database.get("SELECT * FROM tasks WHERE id = ?", [id]);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    await database.run("DELETE FROM tasks WHERE id = ?", [id]);
    logger.info(`Tarefa deletada: ${id}`);
    res.json({ message: "Tarefa removida com sucesso" });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao deletar tarefa: ${error.message}`);
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Erro desconhecido" });
    }
  }
});

export default router;
