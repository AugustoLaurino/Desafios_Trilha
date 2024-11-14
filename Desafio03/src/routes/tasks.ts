import express, { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../services/database";
import logger from "../utils/logger";
import { cacheTasks } from "../services/cache";
import redisClient from "../services/redisClient";
import { taskSchema } from "../schemas/task";
import authenticateToken from "../auth/authenticateToken";

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Tarefas]
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Erro ao listar tarefas
 */
router.get("/", cacheTasks, async (req: Request, res: any) => {
  const { status } = req.query;

  try {
    let query = "SELECT * FROM tasks";
    const params: any[] = [];

    if (status) {
      query += " WHERE status = $1";
      params.push(status);
    }

    const { rows: tasks } = await pool.query(query, params);

    if (tasks.length === 0) {
      logger.info("Nenhuma tarefa encontrada.");
      return res.status(404).json({ message: "Nenhuma tarefa encontrada." });
    }

    await redisClient.set("tasks", JSON.stringify(tasks), {
      EX: 3600,
    });

    logger.info("Tarefas encontradas.");
    res.status(200).json(tasks);
  } catch (error) {
    logger.error(`Erro ao buscar tarefas: ${error}`);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Busca uma tarefa por ID
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao buscar tarefa
 */
router.get("/:id", async (req: Request<{ id: string }>, res: any) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);
    const task = rows[0];

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    logger.info(`Tarefa encontrada: ${JSON.stringify(task)}`);
    res.status(200).json(task);
  } catch (error) {
    logger.error(`Erro ao buscar tarefa: ${error}`);
    res.status(400).json({
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Tarefas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       500:
 *         description: Erro ao criar tarefa
 */
router.post("/", authenticateToken, async (req: Request, res: any) => {
  try {
    const taskData = taskSchema.parse(req.body);
    const newTask = { ...taskData, id: uuidv4() };

    const query =
      "INSERT INTO tasks (id, name, description, status) VALUES ($1, $2, $3, $4)";
    const params = [
      newTask.id,
      newTask.name,
      newTask.description,
      newTask.status,
    ];

    await pool.query(query, params);

    await redisClient.del("tasks");

    logger.info(`Nova tarefa criada: ${JSON.stringify(newTask)}`);
    res.status(201).json(newTask);
  } catch (error) {
    logger.error(`Erro ao criar tarefa: ${error}`);
    res.status(400).json({
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Atualiza uma tarefa por ID
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao atualizar tarefa
 */
router.patch(
  "/:id",
  authenticateToken,
  async (req: Request<{ id: string }>, res: any) => {
    try {
      const { id } = req.params;
      const taskData = taskSchema.partial().parse(req.body);

      const { rows } = await pool.query("SELECT * FROM tasks WHERE id = $1", [
        id,
      ]);
      const task = rows[0];

      if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada" });
      }

      const query = `
      UPDATE tasks 
      SET name = $1, description = $2, status = $3
      WHERE id = $4
    `;
      const params = [
        taskData.name || task.name,
        taskData.description || task.description,
        taskData.status || task.status,
        id,
      ];

      await pool.query(query, params);

      const updatedTask = { ...task, ...taskData };

      await redisClient.del("tasks");

      logger.info(`Tarefa atualizada: ${JSON.stringify(updatedTask)}`);
      res.status(200).json(updatedTask);
    } catch (error) {
      logger.error(`Erro ao atualizar tarefa: ${error}`);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Exclui uma tarefa por ID
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     responses:
 *       204:
 *         description: Tarefa excluída com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao excluir tarefa
 */
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request<{ id: string }>, res: any) => {
    try {
      const { id } = req.params;

      const { rows } = await pool.query("SELECT * FROM tasks WHERE id = $1", [
        id,
      ]);
      const task = rows[0];

      if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada" });
      }

      await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
      await redisClient.del("tasks");

      logger.info(`Tarefa deletada: ${id}`);
      res.json({ message: "Tarefa removida com sucesso" });
    } catch (error) {
      logger.error(`Erro ao deletar tarefa: ${error}`);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },
);

export default router;
