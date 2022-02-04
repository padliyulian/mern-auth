import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_API_URL
if (typeof window !== 'undefined' && localStorage.getItem('user')) {
    const user: any = localStorage.getItem('user')
    if (user) axios.defaults.headers.common = {'Authorization': `${user.token}`}
}

export default axios