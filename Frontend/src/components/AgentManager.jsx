"use client"
import React, { useState } from "react"
import useSWR, { mutate } from "swr"
import axios from "axios"
import { Trash2, UserPlus } from "lucide-react"

const AGENTS_API = "http://localhost:5000/api/v1/agents"

const fetcher = async (url) => {
  const token = localStorage.getItem("authToken")
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export function AgentsManager() {
  const { data: agents, error } = useSWR(AGENTS_API, fetcher, { fallbackData: [] })
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" })
  const [saving, setSaving] = useState(false)
  const [banner, setBanner] = useState(null)

  const onAdd = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.mobile || !form.password) {
      return setBanner({ kind: "err", text: "⚠️ Please fill all fields." })
    }

    setSaving(true)
    try {
      const token = localStorage.getItem("authToken")
      await axios.post(AGENTS_API, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      await mutate(AGENTS_API)
      setForm({ name: "", email: "", mobile: "", password: "" })
      setBanner({ kind: "ok", text: "✅ Agent added successfully!" })
      setTimeout(() => setBanner(null), 2500)
    } catch (err) {
      setBanner({ kind: "err", text: err.response?.data?.message || "Something went wrong" })
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this agent?")) return
    try {
      const token = localStorage.getItem("authToken")
      await axios.delete(`${AGENTS_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await mutate(AGENTS_API)
      setBanner({ kind: "ok", text: "🗑️ Agent removed successfully" })
      setTimeout(() => setBanner(null), 2500)
    } catch (err) {
      setBanner({ kind: "err", text: err.response?.data?.message || err.message })
    }
  }

  if (error)
    return (
      <p className="text-red-500 font-medium bg-red-50 p-3 rounded-md border border-red-200">
        Failed to load agents: {error.message}
      </p>
    )

  return (
    <div className="space-y-8">
      {/* Add Agent Form */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-8 hover:shadow-xl transition">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent mb-2 flex items-center gap-2">
          <UserPlus className="text-blue-500" /> Add New Agent
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Fill in the details below to register a new agent.
        </p>

        {banner && (
          <div
            className={`rounded-md px-4 py-2 mb-4 text-sm ${
              banner.kind === "ok"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {banner.text}
          </div>
        )}

        <form
          onSubmit={onAdd}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Full Name"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Email Address"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            value={form.mobile}
            onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
            placeholder="+15551234567"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Password"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <div className="col-span-full">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Add Agent"}
            </button>
          </div>
        </form>
      </div>

      {/* Agents Table */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-8 hover:shadow-xl transition">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-2">
          Agents List
        </h2>
        <p className="text-sm text-gray-500 mb-4">View and manage all registered agents.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-200">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Mobile</th>
                <th className="p-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents?.length ? (
                agents.map((a, idx) => (
                  <tr
                    key={a._id || idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{a.name}</td>
                    <td className="p-3">{a.email}</td>
                    <td className="p-3">{a.mobile}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDelete(a._id)}
                        className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-medium hover:bg-red-200 transition"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No agents available. Add new agents above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
