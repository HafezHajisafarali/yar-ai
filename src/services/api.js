import axios from 'axios';

// شبیه‌سازی پاسخ‌های API
const mockApiResponse = (data) => {
  return Promise.resolve({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  });
};

// استفاده از نسخه شبیه‌سازی شده API یا نسخه واقعی
const USE_MOCK_API = false; // برای فعال کردن نسخه شبیه‌سازی شده API این مقدار را true قرار دهید

// Create an axios instance with default config یا یک شبیه‌سازی از آن
const api = USE_MOCK_API ? {
  // شبیه‌سازی کامل instance axios
  post: (url, data) => {
    console.log(`🔶 MOCK API Request: POST ${url}`, data);
    
    // Google login/signup simulation
    if (url.includes('/auth/google')) {
      const credential = data.credential;
      try {
        const base64Url = credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        
        return mockApiResponse({ 
          token: credential,
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        });
      } catch (err) {
        console.error("Error decoding Google token:", err);
        return mockApiResponse({ token: 'mock-token', email: 'user@example.com' });
      }
    }
    
    // Phone login simulation
    if (url.includes('/auth/login')) {
      return mockApiResponse({ message: 'Code sent to phone', success: true });
    }
    
    // Verification code simulation
    if (url.includes('/auth/verify-phone')) {
      return mockApiResponse({ token: 'mock-token', phone: data.phone });
    }
    
    // Default response for other endpoints
    return mockApiResponse({ success: true });
  },
  
  get: (url) => {
    console.log(`🔶 MOCK API Request: GET ${url}`);
    return mockApiResponse({ success: true });
  },
  
  // Add other methods as needed
  put: (url, data) => {
    console.log(`🔶 MOCK API Request: PUT ${url}`, data);
    return mockApiResponse({ success: true });
  },
  
  delete: (url) => {
    console.log(`🔶 MOCK API Request: DELETE ${url}`);
    return mockApiResponse({ success: true });
  }
} : axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// افزودن رهگیرها فقط اگر از نسخه واقعی استفاده می‌کنیم
if (!USE_MOCK_API) {
  // Add a request interceptor for auth tokens
  api.interceptors.request.use(
    (config) => {
      // Log requests in development
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

  // Add response interceptor to handle errors globally
  api.interceptors.response.use(
    (response) => {
      // Log successful responses in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ API Response: ${response.status}`, response.data);
      }
      return response;
    },
    (error) => {
      // Handle errors globally
      console.error('❌ API Error:', error.message);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('❌ API Response Status:', error.response.status);
        console.error('❌ API Response Data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('❌ No response received:', error.request);
      }
      
      return Promise.reject(error);
    }
  );
}

// Auth services
export const authService = {
  login: (phone) => api.post('/auth/login', { phone }),
  verifyCode: (phone, code) => api.post('/auth/verify-phone', { phone, code }),
  googleLogin: (credential) => api.post('/auth/google', { credential, isNewUser: false }),
  googleSignup: (credential) => api.post('/auth/google', { credential, isNewUser: true }),
};

export default api;