const { v4: uuidv4 } = require("uuid");
const { z } = require("zod");

const taskSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(128),
  description: z.string().max(255),
  status: z.enum(["pendente", "em progresso", "concluído"]),
});

class Task {
  constructor(name, description, status) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.status = status;

    taskSchema.parse(this);
  }
}

module.exports = { Task, taskSchema };
