import axios from 'axios'
import { getCookie } from 'cookies-next'

// const token = getCookie('token')

axios.defaults.baseURL = process.env.REACT_APP_API_URL

if (typeof window !== 'undefined' && getCookie('token')) {
    const token: any = getCookie('token')
    if (token) axios.defaults.headers.common = {'Authorization': `${token}`}
}

export default axios