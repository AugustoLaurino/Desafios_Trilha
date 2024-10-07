const express = require("express");
const router = express.Router();
const { Task, taskSchema } = require("../models/taskModel");
const taskService = require("../services/taskService");

router.post("/", (req, res) => {
  const { name, description, status } = req.body;
  if (!name || !description || !status) {
    return res
      .status(400)
      .json({ message: "Nome, descrição e status são obrigatórios" });
  }
  const task = new Task(name, description, status);
  taskService.addTask(task);
  res.status(201).json({ message: "Tarefa criada com sucesso!", task });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  if (!name && !description && !status) {
    return res.status(400).json({
      message:
        "Pelo menos um campo (nome, descrição ou status) deve ser fornecido.",
    });
  }

  const updatedData = {};
  if (name) updatedData.name = name;
  if (description) updatedData.description = description;

  if (status) {
    try {
      updatedData.status = status;
      taskSchema.partial().parse({ ...updatedData, id });
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message).join(", ") });
    }
  }

  const updatedTask = taskService.updateTask(id, updatedData);
  if (!updatedTask) {
    return res.status(404).json({ message: "Tarefa não encontrada." });
  }

  res.json({ message: "Tarefa atualizada com sucesso!", task: updatedTask });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  taskService.deleteTask(id);
  const task = taskService.findTaskById(id);
  if (!task) {
    return res.status(404).json({ message: "Tarefa não encontrada" });
  }
  res.status(200).json({ message: "Tarefa deletada com sucesso!" });
});

router.get("/", (req, res) => {
  const { status } = req.query;
  const tasks = taskService.listTasks(status);
  res.json(tasks);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const task = taskService.findTaskById(id);
  if (!task) {
    return res.status(404).json({ message: "Tarefa não encontrada" });
  }
  res.json(task);
});

module.exports = router;
