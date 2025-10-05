"use client"
import React from "react"
import useSWR from "swr"
import axios from "axios"
import { motion } from "framer-motion"
import { Loader2, UserCircle2 } from "lucide-react"

const AGENTS_API = "http://localhost:5000/api/v1/agents"
const ASSIGNMENTS_API = "http://localhost:5000/api/v1/upload"

// Axios-based fetcher with Authorization header
const axiosFetcher = (url) =>
  axios
    .get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    })
    .then((res) => res.data)

export function AssignmentsView() {
  // Fetch agents
 const { data: agents = [], error: agentsError, isLoading: loadingAgents, } = useSWR(AGENTS_API, axiosFetcher)

  // Fetch assignments
  const {
    data: assignRes,
    error: assignError,
    isLoading: loadingAssigns,
  } = useSWR(ASSIGNMENTS_API, axiosFetcher)

  // Extract actual data arrays
  
  const assignments = assignRes?.data || []

  // ✅ Group assignments by agent ID
  const groupedAssignments = assignments.reduce((acc, item) => {
    const id = item.agent?._id
    if (!id) return acc
    if (!acc[id]) acc[id] = []
    acc[id].push(item)
    return acc
  }, {})

  // Error state
  if (agentsError || assignError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 font-semibold text-lg">⚠️ Failed to load data</p>
        <p className="text-sm text-gray-500">Please check your API server connection.</p>
      </div>
    )
  }

  // Loading state
  if (loadingAgents || loadingAssigns) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-500 w-8 h-8 mb-3" />
        <p className="text-gray-500">Loading assignments...</p>
      </div>
    )
  }

  // Render UI
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          📋 Agent Assignments
        </h2>
        <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>

      {agents?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent, idx) => {
            const items = groupedAssignments[agent._id] || []

            return (
              <motion.div
                key={agent._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-all p-5"
              >
                {/* Agent Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <UserCircle2 className="w-10 h-10 text-blue-500" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {agent.name}
                    </h4>
                    <p className="text-sm text-gray-500">{agent.email}</p>
                    <p className="text-xs text-gray-400">{agent.mobile || "No phone"}</p>
                  </div>
                </div>

                {/* Assignment Table */}
                <div className="overflow-auto max-h-64 rounded-lg border border-gray-100 dark:border-gray-800">
                  <table className="w-full text-sm border-collapse">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                      <tr className="text-left text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <th className="py-2 px-3 font-medium">#</th>
                        <th className="py-2 px-3 font-medium">First Name</th>
                        <th className="py-2 px-3 font-medium">Phone</th>
                        <th className="py-2 px-3 font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length ? (
                        items.map((it, i) => (
                          <tr
                            key={`${agent._id}_${i}`}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                          >
                            <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                              {i + 1}
                            </td>
                            <td className="py-2 px-3 text-gray-800 dark:text-gray-200">
                              {it.firstName || "-"}
                            </td>
                            <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                              {it.phone || "-"}
                            </td>
                            <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                              {it.notes || "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-4 text-center text-gray-500 dark:text-gray-400 italic"
                          >
                            No assigned items
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No agents found. Add agents to view their assignments.
          </p>
        </div>
      )}
    </div>
  )
}
