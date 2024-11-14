import { z } from "zod";

export const taskSchema = z.object({
  name: z.string().max(128),
  description: z.string().max(255),
  status: z.enum(["pending", "in_progress", "done"]),
});

export type ITask = z.infer<typeof taskSchema>;
