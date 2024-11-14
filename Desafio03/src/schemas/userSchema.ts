import { z } from "zod";

export const userRegisterSchema = z.object({
  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export type UserRegisterData = z.infer<typeof userRegisterSchema>;

export const userLoginSchema = z.object({
  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
  password: z.string(),
});

export type UserLoginData = z.infer<typeof userLoginSchema>;
