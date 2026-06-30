import apiClient from "./axios.js";

export const loginUser = async (email, password) => {
    try{
        const response = await apiClient.post('/auth/login', {
            email,
            password
        })
        return response.data ;

    }catch(err){
        console.error("Login API Error", err.response?.data?.message || err.message);
        throw err ;
    }
}

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (err) {
        console.error("Register API Error", err.response?.data?.message || err.message);
        throw err;
    }
};

// GET /api/auth/profile — Get the currently authenticated user's profile
export const getProfile = async () => {
    try {
        const response = await apiClient.get('/auth/profile');
        return response.data;
    } catch (err) {
        console.error("Profile API Error", err.response?.data?.message || err.message);
        throw err;
    }
};