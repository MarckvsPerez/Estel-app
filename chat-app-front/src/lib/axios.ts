import axios from "axios"
import { getStoredTokens } from "./utils"

const apiUrl = import.meta.env.VITE_MODE === "development" ? "http://localhost:5001/api" : "/api"

const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getStoredTokens()}`,
    }
})

export default api