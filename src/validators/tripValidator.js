const { z } = require("zod");

const tripSchema = z.object({
  title: z.string({ required_error: "El título es obligatorio" }).min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string({ required_error: "La descripción es obligatoria" }).min(10, "La descripción es muy corta"),
  destination: z.string({ required_error: "El destino es obligatorio" }),
  start_date: z.string({ required_error: "La fecha de inicio es obligatoria" }).refine((date) => !isNaN(Date.parse(date)), "Fecha de inicio inválida"),
  end_date: z.string({ required_error: "La fecha de fin es obligatoria" }).refine((date) => !isNaN(Date.parse(date)), "Fecha de fin inválida"),
  estimated_cost: z.number({ invalid_type_error: "El coste debe ser un número" }).nonnegative("El coste no puede ser negativo"),
  min_participants: z.number().int().min(1, "Debe haber al menos 1 participante"),
  transport_details: z.string().optional(),
  itinerary: z.string().optional(),
  // Validamos que end_date sea posterior a start_date
}).refine(data => new Date(data.end_date) >= new Date(data.start_date), {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["end_date"]
});

// Middleware de validación para Express
const validateTrip = (req, res, next) => {
  try {
    tripSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Formateamos los errores de Zod para devolverlos limpios
      return res.status(400).json({ 
        error: "Error de validación", 
        details: error.errors.map(e => e.message) 
      });
    }
    return res.status(500).json({ error: "Error interno de validación" });
  }
};

module.exports = { validateTrip };