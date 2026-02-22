//zod sera implementado futuramente para validação de dados, por enquanto as validações estão sendo feitas manualmente

export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}