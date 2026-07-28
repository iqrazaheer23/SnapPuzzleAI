import React, { useState, useEffect, createContext, useContext } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/profile`)
      setUser(res.data.user)
    } catch (err) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    setToken(token)
    setUser(userData)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
