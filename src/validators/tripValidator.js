const { z } = require("zod");

const tripSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  origin: z.string().min(2),
  destination: z.string().min(2),
  price: z.number().positive(),
  start_date: z.string(),
  end_date: z.string()
});

module.exports = { tripSchema };
