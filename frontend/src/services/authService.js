import api from './api.js'

export const authService = {
  async register(username, email, password) {
    const res = await api.post('/auth/register', { username, email, password })
    return res.data
  },
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    return res.data
  },
  async getProfile() {
    const res = await api.get('/auth/profile')
    return res.data
  }
}
