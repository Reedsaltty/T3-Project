import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    // Use environment variable or fallback to localhost backend port (e.g., 5000)
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    // Allows sending cookies (like the httpOnly tokens from your Auth controller)
    withCredentials: true,
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
let isRefreshing = false; // prevents multiple refresh calls at the same time

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If we get a 403 and haven't already retried this request
        if (error.response?.status === 403 && !originalRequest._retry) {
            
            // Guard: if a refresh is already in progress, just reject
            if (isRefreshing) {
                return Promise.reject(error);
            }

            originalRequest._retry = true; // mark so we don't retry infinitely
            isRefreshing = true;

            try {
                // Silently call the refresh endpoint (refreshToken cookie is sent automatically)
                await apiClient.post('/auth/refresh');

                isRefreshing = false;

                // Retry the original request — the new accessToken cookie is now set
                return apiClient(originalRequest);

            } catch (refreshError) {
                // Refresh token is also expired → force the user to log in again
                isRefreshing = false;
                console.error('Session expired. Redirecting to login...');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
