import express, { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../database";
import logger from "../logger";
import taskSchema from "../schemas/task";

const router = express.Router();

router.get("/", async (req: Request, res: any) => {
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

    logger.info("Tarefas encontradas.");
    res.json(tasks);
  } catch (error) {
    logger.error(`Erro ao buscar tarefas: ${error}`);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

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
    res.json(task);
  } catch (error) {
    logger.error(`Erro ao buscar tarefa: ${error}`);
    res.status(500).json({ error: "Erro ao buscar tarefa" });
  }
});

router.post("/", async (req: Request, res: any) => {
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

    logger.info(`Nova tarefa criada: ${JSON.stringify(newTask)}`);
    res.status(201).json(newTask);
  } catch (error) {
    logger.error(`Erro ao criar tarefa: ${error}`);
    res.status(400).json({
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
});

router.patch("/:id", async (req: Request<{ id: string }>, res: any) => {
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
    logger.info(`Tarefa atualizada: ${JSON.stringify(updatedTask)}`);
    res.status(200).json(updatedTask);
  } catch (error) {
    logger.error(`Erro ao atualizar tarefa: ${error}`);
    res.status(400).json({
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
});

router.delete("/:id", async (req: Request<{ id: string }>, res: any) => {
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
    logger.info(`Tarefa deletada: ${id}`);
    res.json({ message: "Tarefa removida com sucesso" });
  } catch (error) {
    logger.error(`Erro ao deletar tarefa: ${error}`);
    res.status(400).json({
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
});

export default router;
