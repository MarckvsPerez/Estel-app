import axios from "axios"
import { getStoredTokens } from "./utils"

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getStoredTokens()}`,
    }
})

export default api