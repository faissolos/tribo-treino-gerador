import { z } from "zod";

export const workoutSchema = z.object({
  foco: z
    .string()
    .trim()
    .min(3, "Foco deve ter no mínimo 3 caracteres")
    .max(100, "Foco muito longo"),
  equipamento: z
    .string()
    .trim()
    .min(3, "Equipamento deve ter no mínimo 3 caracteres")
    .max(100, "Equipamento muito longo"),
  sexo: z.string().optional(),
  tempo: z.string().optional(),
  limitacoes: z.string().max(500, "Limitações muito longas").optional(),
});

export type WorkoutFormData = z.infer<typeof workoutSchema>;
