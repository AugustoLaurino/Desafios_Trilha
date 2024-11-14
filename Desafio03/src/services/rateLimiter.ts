import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2,
  message: {
    status: 429,
    error: "Limite de requisições excedido. Tente novamente mais tarde.",
  },
});

export default limiter;
