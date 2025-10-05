"use client"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
  LogOut,
  Users,
  Upload,
  ClipboardList,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react"

import { AgentsManager } from "../components/AgentManager"
import { UploadAndDistribute } from "../components/uploadAndDIs"
import { AssignmentsView } from "../components/AssignmentView"

export default function DashboardShell() {
  const navigate = useNavigate()
  const [tab, setTab] = useState("agents")
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    if (!storedToken) navigate("/signin")
  }, [navigate])

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("authToken")
      const res = await axios.get("http://localhost:5000/api/v1/agents", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAgents(res.data.agents || [])
    } catch (err) {
      console.error(err)
      alert("⚠️ Failed to fetch agents")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/signin")
  }

  const tabs = [
    { id: "agents", label: "Agents", icon: <Users size={18} /> },
    { id: "upload", label: "Upload & Distribute", icon: <Upload size={18} /> },
    { id: "assignments", label: "Assignments", icon: <ClipboardList size={18} /> },
  ]

  return (
    <div className="w-screen h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
          <h1 className="text-lg font-bold text-blue-600 flex items-center gap-2">
            <LayoutDashboard size={20} /> Admin Dashboard
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((t) => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setTab(t.id)
                setSidebarOpen(false)
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all duration-200 ${
                tab === t.id
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {t.icon}
              <span className="font-medium">{t.label}</span>
            </motion.button>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 relative overflow-x-hidden">
        {/* Topbar (Mobile) */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Card container */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
            {tabs.find((t) => t.id === tab)?.icon}
            {tabs.find((t) => t.id === tab)?.label}
          </h2>

          {loading ? (
            <p className="text-gray-500 animate-pulse">Loading data...</p>
          ) : tab === "agents" ? (
            <AgentsManager agents={agents} refresh={fetchAgents} />
          ) : tab === "upload" ? (
            <UploadAndDistribute />
          ) : (
            <AssignmentsView />
          )}
        </motion.div>
      </main>
    </div>
  )
}
