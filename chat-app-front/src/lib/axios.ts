import axios from "axios"

const apiUrl = import.meta.env.VITE_MODE === "development" ? "http://localhost:5001/api" : "/api"

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default api