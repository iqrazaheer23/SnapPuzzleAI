import api from './api.js'

export const gameService = {
  async saveScore(difficulty, completionTime, score) {
    const res = await api.post('/game/save-score', { difficulty, completionTime, score })
    return res.data
  },
  async getHistory() {
    const res = await api.get('/game/history')
    return res.data
  },
  async getLeaderboard(difficulty = 'all', sortBy = 'score') {
    const res = await api.get('/leaderboard', { params: { difficulty, sortBy } })
    return res.data
  },
  async getDashboard() {
    const res = await api.get('/dashboard')
    return res.data
  },
  async getAchievements() {
    const res = await api.get('/achievements')
    return res.data
  }
}
