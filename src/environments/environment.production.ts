// Environment Production
// API URL will be proxied through Nginx in production Docker
export const environment = {
  production: true,
  apiUrl: '/api',
  wsUrl: '/ws'
};
