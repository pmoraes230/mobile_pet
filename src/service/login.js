import axios from "axios"

export const login = async (email, password) => {
    try {
        const response = await axios.post("https://api-pet-fmdo.onrender.com/docs/")
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}