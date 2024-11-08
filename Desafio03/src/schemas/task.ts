import { z } from "zod";

const taskSchema = z.object({
  name: z.string().max(128),
  description: z.string().max(255),
  status: z.enum(["pending", "in_progress", "done"]),
});

export default taskSchema;
