const KEYS = {
  admin: "demo_admin_user",
  token: "demo_auth_token",
  agents: "demo_agents",
  assignments: "demo_assignments",
}

function readJSON(key, fallback) {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

// Admin
export function seedDefaultAdmin() {
  const existing = readJSON(KEYS.admin, null)
  if (!existing) {
    writeJSON(KEYS.admin, { email: "admin@example.com", password: "admin123" })
  }
}
export function getAdmin() {
  return readJSON(KEYS.admin, null)
}

// Auth token
export function setToken(token) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(KEYS.token, token)
}
export function getToken() {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(KEYS.token)
}
export function clearToken() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(KEYS.token)
}

// Agents
export function getAgents() {
  return readJSON(KEYS.agents, [])
}
export function saveAgents(list) {
  writeJSON(KEYS.agents, list)
}
export function addAgent(agent) {
  const list = getAgents()
  list.push(agent)
  saveAgents(list)
}
export function deleteAgent(id) {
  const list = getAgents().filter((a) => a.id !== id)
  saveAgents(list)
}

// Assignments
export function getAssignments() {
  return readJSON(KEYS.assignments, {})
}
export function saveAssignments(data) {
  writeJSON(KEYS.assignments, data)
}
export function clearAssignments() {
  writeJSON(KEYS.assignments, {})
}
