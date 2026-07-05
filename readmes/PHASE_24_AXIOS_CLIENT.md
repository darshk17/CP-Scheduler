# Phase 24: Reusable Axios Client Documentation

This phase implements a configured, reusable Axios instance with interceptors to automate Bearer Token injection and auth error handling.

---

## 🛠️ API client: `api.js`

Created in [src/services/api.js](file:///d:/CP-Scheduler/src/services/api.js):

```javascript
import axios from 'axios';

// Create an Axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Request Interceptor: Automatically attach the JWT token if it exists in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Automatically clear expired credentials
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default API;
```

---

## 💡 Important Lines Explained

1. **`const API = axios.create({ baseURL: '...' })`**: Instantiates a customized Axios client instance. Any requests made with `API.get('/auth/me')` will automatically target `http://localhost:5000/api/auth/me`.
2. **`API.interceptors.request.use(...)`**: Registers a request interceptor. This function runs automatically *before* every single request is sent to the network.
3. **`config.headers['Authorization'] = Bearer ${token}`**: Extracts the token from local storage dynamically and injects it into the Authorization header, preventing the need to write header code manually on every API call.
4. **`API.interceptors.response.use(...)`**: Registers a response interceptor that intercepts answers from the server before they reach the controller `.then()` or `try/catch` blocks.
5. **`if (error.response.status === 401)`**: Checks if the server rejected the token as unauthorized or expired. If so, it purges the local `localStorage` token, cleanly logging the user out.
