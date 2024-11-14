import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRegisterSchema, userLoginSchema } from "../schemas/userSchema";
import pool from "../services/database";
import dotenv from "dotenv";

dotenv.config();

const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "";

authRouter.post("/register", async (req: Request, res: any) => {
  try {
    const { username, password } = userRegisterSchema.parse(req.body);

    const { rowCount } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    if (rowCount !== null && rowCount > 0) {
      return res.status(400).json({ error: "Usuário já registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Erro no registro",
    });
  }
});

authRouter.post("/login", async (req: Request, res: any) => {
  try {
    const { username, password } = userLoginSchema.parse(req.body);

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Erro no login",
    });
  }
});

export default authRouter;
