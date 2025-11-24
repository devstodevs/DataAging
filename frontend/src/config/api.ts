const isBrowser = typeof window !== 'undefined';

// Use relative path when running via proxy (production/Docker)
// Use full URL when running in development mode directly
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envUrl && envUrl.includes('backend')) {
    return '/api/v1';
  }
  
  if (envUrl) {
    return envUrl;
  }
  
  return '/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 10000,
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};