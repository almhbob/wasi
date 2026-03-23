/**
 * Global fetch interceptor to automatically inject the Authorization header
 * for requests made by the auto-generated API client.
 */
const originalFetch = window.fetch;

window.fetch = async (...args) => {
  let [resource, config] = args;
  
  if (typeof resource === 'string' && resource.startsWith('/api')) {
    const token = localStorage.getItem('wasi_token');
    
    if (token) {
      config = config || {};
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
  }
  
  // Also handle URL object cases if necessary
  if (resource instanceof URL && resource.pathname.startsWith('/api')) {
    const token = localStorage.getItem('wasi_token');
    if (token) {
      config = config || {};
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
  }

  return originalFetch(resource, config);
};

export {};
