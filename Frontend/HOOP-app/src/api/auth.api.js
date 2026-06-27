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

export const registerUser = async(userData) =>{
    try{
        const response = await apiClient.post('/auth/register', userData)
        return response.data

    }catch(err) {
        throw err ;
    }
}