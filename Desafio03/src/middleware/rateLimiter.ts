import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: {
    status: 429,
    error:
      "Você atingiu o limite de 60 requisições em um minuto, tente novamente mais tarde.",
  },
});

export default limiter;
