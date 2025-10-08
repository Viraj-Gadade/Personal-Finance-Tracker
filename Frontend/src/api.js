import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8800/api",
});

// Attach token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle 401 errors (expired token)
API.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          // Call backend endpoint to refresh token
          const res = await axios.post("http://localhost:8800/api/refresh-token", { token: refreshToken });
          const newToken = res.data.token;

          // Save new access token
          localStorage.setItem("token", newToken);

          // Update Authorization header and retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        } catch (err) {
          // Refresh token failed → logout
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(err);
        }
      } else {
        // No refresh token → logout
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
