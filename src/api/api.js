import axios from 'axios'
import { api_url } from '../utils/utils'
const api = axios.create({
    baseURL: `${api_url}`
})
export default api