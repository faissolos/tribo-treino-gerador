// Configuração centralizada de webhooks do n8n
// Altere estas URLs quando tiver seus webhooks configurados no n8n

export const WEBHOOKS = {
  // Webhook para autenticação de usuários
  LOGIN: import.meta.env.VITE_WEBHOOK_LOGIN || "/webhook-login",
  
  // Webhook para gerar treinos com IA
  GENERATE_WORKOUT: import.meta.env.VITE_WEBHOOK_TREINO || "/webhook-treino",
  
  // Webhook para salvar treinos no banco de dados
  SAVE_WORKOUT: import.meta.env.VITE_WEBHOOK_SAVE_WORKOUT || "/webhook-save-workout",
  
  // Webhook para buscar histórico de treinos do usuário
  GET_WORKOUTS: import.meta.env.VITE_WEBHOOK_GET_WORKOUTS || "/webhook-get-workouts",
  
  // Webhook para deletar um treino
  DELETE_WORKOUT: import.meta.env.VITE_WEBHOOK_DELETE_WORKOUT || "/webhook-delete-workout",
};

// Modo de desenvolvimento - permite login sem webhook
export const DEV_MODE = import.meta.env.DEV;

// Credenciais de teste para modo de desenvolvimento
export const DEV_CREDENTIALS = {
  email: "teste@tribo.com",
  password: "123456",
};
