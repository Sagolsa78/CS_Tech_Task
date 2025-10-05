import React from "react";
import { createContext, useContext, useMemo, useSyncExternalStore, useCallback } from "react"
import { clearToken, getAdmin, getToken, setToken } from "./Local-db"

const AuthContext = createContext(null)

function subscribeAuth(callback) {
  const handler = () => callback()
  window.addEventListener("storage", handler)
  return () => window.removeEventListener("storage", handler)
}
function getSnapshotAuth() {
  return !!getToken()
}

export function AuthProvider({ children }) {
  const isAuthenticated = useSyncExternalStore(subscribeAuth, getSnapshotAuth, () => false)

  const login = useCallback(async (email, password) => {
    const admin = getAdmin()
    if (admin && admin.email === email && admin.password === password) {
      setToken("fake-jwt-demo")
      window.dispatchEvent(new StorageEvent("storage", { key: "demo_auth_token" }))
      return { ok: true }
    }
    return { ok: false, message: "Invalid credentials" }
  }, [])

  const logout = useCallback(() => {
    clearToken()
    window.dispatchEvent(new StorageEvent("storage", { key: "demo_auth_token" }))
  }, [])

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
