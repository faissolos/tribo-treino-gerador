// Mensagens de erro padronizadas em português

export const ERROR_MESSAGES = {
  // Erros de autenticação
  INVALID_CREDENTIALS: "E-mail ou senha incorretos",
  NETWORK_ERROR: "Erro de conexão. Verifique sua internet e tente novamente",
  SERVER_ERROR: "Erro no servidor. Tente novamente mais tarde",
  TIMEOUT: "Requisição demorou muito. Tente novamente",
  UNAUTHORIZED: "Sessão expirada. Faça login novamente",
  
  // Erros de formulário
  REQUIRED_FIELD: "Este campo é obrigatório",
  INVALID_EMAIL: "E-mail inválido",
  PASSWORD_TOO_SHORT: "A senha deve ter no mínimo 6 caracteres",
  
  // Erros de treino
  GENERATE_WORKOUT_ERROR: "Erro ao gerar treino. Tente novamente",
  SAVE_WORKOUT_ERROR: "Erro ao salvar treino. Tente novamente",
  LOAD_WORKOUTS_ERROR: "Erro ao carregar treinos. Tente novamente",
  DELETE_WORKOUT_ERROR: "Erro ao deletar treino. Tente novamente",
  
  // Erros genéricos
  UNKNOWN_ERROR: "Erro desconhecido. Tente novamente",
};

export const getErrorMessage = (statusCode?: number): string => {
  if (!statusCode) return ERROR_MESSAGES.NETWORK_ERROR;
  
  switch (statusCode) {
    case 401:
      return ERROR_MESSAGES.INVALID_CREDENTIALS;
    case 403:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 404:
      return "Recurso não encontrado. Verifique a configuração dos webhooks";
    case 408:
      return ERROR_MESSAGES.TIMEOUT;
    case 500:
    case 502:
    case 503:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};
