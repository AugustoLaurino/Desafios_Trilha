const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "tasks.json");

function readTasksFile() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeTasksFile(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function addTask(task) {
  const tasks = readTasksFile();
  tasks.push(task);
  writeTasksFile(tasks);
}

function updateTask(id, updatedTask) {
  const tasks = readTasksFile();
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedTask };
    writeTasksFile(tasks);
    return tasks[index];
  }
  return null;
}

function deleteTask(id) {
  const tasks = readTasksFile();
  const updatedTasks = tasks.filter((task) => task.id !== id);
  writeTasksFile(updatedTasks);
}

function listTasks(status) {
  const tasks = readTasksFile();
  return status ? tasks.filter((task) => task.status === status) : tasks;
}

function findTaskById(id) {
  const tasks = readTasksFile();
  return tasks.find((task) => task.id === id);
}

module.exports = { addTask, updateTask, deleteTask, listTasks, findTaskById };
