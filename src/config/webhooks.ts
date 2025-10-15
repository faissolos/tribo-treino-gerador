// ============================================
// CONFIGURAÇÃO CENTRALIZADA DE WEBHOOKS DO N8N
// ============================================
//
// Este arquivo gerencia todas as URLs dos webhooks do n8n
// Configure as URLs reais no arquivo .env (veja .env.example)
//
// ESTRUTURA DE REQUISIÇÃO:
// Todas as requisições incluem um campo "tag" no body JSON
// para permitir roteamento no n8n via Switch Node
//
// ============================================

export const WEBHOOKS = {
  // Webhook para autenticação de usuários
  // Tag: "LOGIN"
  // Body: { tag: "LOGIN", email: string, password: string }
  // Response: { status: "success" | "error", message?: string }
  LOGIN: import.meta.env.VITE_WEBHOOK_LOGIN || "/webhook-login",
  
  // Webhook para gerar treinos com IA (OpenAI)
  // Tag: "GENERATE_WORKOUT"
  // Body: { tag: "GENERATE_WORKOUT", prompt: string, foco: string, equipamento: string, sexo?: string, tempo?: string, limitacoes?: string }
  // Response: JSON do treino (ver estrutura em src/utils/aiPrompts.ts)
  GENERATE_WORKOUT: import.meta.env.VITE_WEBHOOK_TREINO || "/webhook-treino",
  
  // Webhook para salvar treinos no banco de dados
  // Tag: "SAVE_WORKOUT"
  // Body: { tag: "SAVE_WORKOUT", email: string, workout: object, foco: string, date: string }
  // Response: { status: "success" | "error", message?: string }
  SAVE_WORKOUT: import.meta.env.VITE_WEBHOOK_SAVE_WORKOUT || "/webhook-save-workout",
  
  // Webhook para buscar histórico de treinos do usuário
  // Tag: "GET_WORKOUTS"
  // Body: { tag: "GET_WORKOUTS", email: string }
  // Response: { workouts: Array<{ id: string, date: string, foco: string, workout: object }> }
  GET_WORKOUTS: import.meta.env.VITE_WEBHOOK_GET_WORKOUTS || "/webhook-get-workouts",
  
  // Webhook para deletar um treino
  // Tag: "DELETE_WORKOUT"
  // Body: { tag: "DELETE_WORKOUT", email: string, workoutId: string }
  // Response: { status: "success" | "error", message?: string }
  DELETE_WORKOUT: import.meta.env.VITE_WEBHOOK_DELETE_WORKOUT || "/webhook-delete-workout",
};

// Tags para roteamento no n8n
export const WEBHOOK_TAGS = {
  LOGIN: "LOGIN",
  GENERATE_WORKOUT: "GENERATE_WORKOUT",
  SAVE_WORKOUT: "SAVE_WORKOUT",
  GET_WORKOUTS: "GET_WORKOUTS",
  DELETE_WORKOUT: "DELETE_WORKOUT",
} as const;

// Modo de desenvolvimento - permite login sem webhook
export const DEV_MODE = import.meta.env.DEV;

// Credenciais de teste para modo de desenvolvimento
export const DEV_CREDENTIALS = {
  email: "teste@tribo.com",
  password: "123456",
};
