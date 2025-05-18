import axios from 'axios';

const mockApiResponse = (data) => {
  return Promise.resolve({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  });
};

const USE_MOCK_API = false;

const api = USE_MOCK_API
  ? {
      post: (url, data) => {
        console.log(`🔶 MOCK API Request: POST ${url}`, data);

        if (url.includes('/auth/google')) {
          const credential = data.credential;
          try {
            const base64Url = credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );

            const payload = JSON.parse(jsonPayload);

            return mockApiResponse({
              token: credential,
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
            });
          } catch (err) {
            console.error('Error decoding Google token:', err);
            return mockApiResponse({ token: 'mock-token', email: 'user@example.com' });
          }
        }

        if (url.includes('/auth/login')) {
          return mockApiResponse({ message: 'Code sent to phone', success: true });
        }

        if (url.includes('/auth/verify-phone')) {
          return mockApiResponse({ token: 'mock-token', phone: data.phone });
        }

        return mockApiResponse({ success: true });
      },

      get: (url) => {
        console.log(`🔶 MOCK API Request: GET ${url}`);
        return mockApiResponse({ success: true });
      },

      put: (url, data) => {
        console.log(`🔶 MOCK API Request: PUT ${url}`, data);
        return mockApiResponse({ success: true });
      },

      delete: (url) => {
        console.log(`🔶 MOCK API Request: DELETE ${url}`);
        return mockApiResponse({ success: true });
      },
    }
  : axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://y4r.net/api',      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

if (!USE_MOCK_API) {
  api.interceptors.request.use(
    (config) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
      }

      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ API Response: ${response.status}`, response.data);
      }
      return response;
    },
    (error) => {
      console.error('❌ API Error:', error.message);
      if (error.response) {
        console.error('❌ API Response Status:', error.response.status);
        console.error('❌ API Response Data:', error.response.data);
      } else if (error.request) {
        console.error('❌ No response received:', error.request);
      }
      return Promise.reject(error);
    }
  );
}

export const authService = {
  login: (phone) => api.post('/auth/login', { phone }),
  verifyCode: (phone, code) => api.post('/auth/verify-phone', { phone, code }),
  googleLogin: (credential) => api.post('/api/auth/google', { credential, isNewUser: false }),
  googleSignup: (credential) => api.post('/api/auth/google', { credential, isNewUser: true }),
};

export default api;