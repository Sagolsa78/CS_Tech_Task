"use client"
import React, { useState } from "react"
import useSWR, { mutate } from "swr"
import Papa from "papaparse"
import * as XLSX from "xlsx"
import axios from "axios"
import { ClipLoader } from "react-spinners"

const AGENTS_API = "http://localhost:5000/api/v1/agents/"
const ASSIGNMENTS_API = "http://localhost:5000/api/v1/upload"

// Fetcher with Axios and token support
const fetcher = async (url) => {
  const token = localStorage.getItem("authToken") || ""
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

// Normalize CSV/XLSX rows
function validateAndNormalizeRows(rows) {
  const items = []
  for (const r of rows) {
    const FirstName = String(r.FirstName ?? r["First Name"] ?? r.firstname ?? "").trim()
    const PhoneRaw = r.Phone ?? r.phone ?? r["Phone Number"]
    const Notes = r.Notes ?? r.notes ?? ""
    const Phone = PhoneRaw == null ? "" : String(PhoneRaw).replace(/[^\d+]/g, "")
    if (!FirstName || !Phone) continue
    items.push({ FirstName, Phone, Notes: String(Notes || "").trim() || undefined })
  }
  return items
}


export function UploadAndDistribute() {
  const { data: agents } = useSWR(AGENTS_API, fetcher, { fallbackData: [] })
  const { data: assignments } = useSWR(ASSIGNMENTS_API, fetcher, { fallbackData: {} })

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [parsedCount, setParsedCount] = useState(null)
  const [banner, setBanner] = useState(null)

  // Handle file selection with validation
  const onFileChange = (e) => {
    const f = e.target.files?.[0] ?? null
    setParsedCount(null)
    if (!f) return
    const allowedExt = [".csv", ".xlsx", ".xls"]
    const name = f.name.toLowerCase()
    if (!allowedExt.some((ext) => name.endsWith(ext))) {
      setBanner({ kind: "err", text: "Only .csv, .xlsx, and .xls files are allowed." })
      e.currentTarget.value = ""
      return
    }
    setBanner(null)
    setFile(f)
  }

  // Parse CSV/XLSX files
  async function parseFile(f) {
    if (f.name.toLowerCase().endsWith(".csv")) {
      return new Promise((resolve, reject) => {
        Papa.parse(f, {
          header: true,
          complete: (res) => resolve(validateAndNormalizeRows(res.data || [])),
          error: reject,
          skipEmptyLines: true,
        })
      })
    } else {
      const ab = await f.arrayBuffer()
      const wb = XLSX.read(ab, { type: "array" })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(ws)
      return validateAndNormalizeRows(json || [])
    }
  }

  // Distribute & save assignments
  // const onDistribute = async () => {
  //   if (!file) {
  //     setBanner({ kind: "err", text: "Please choose a file first." })
  //     return
  //   }
  //   if (!agents || agents.length !== 5) {
  //     setBanner({ kind: "err", text: "Exactly 5 agents are required before distribution." })
  //     return
  //   }

  //   try {
  //     setLoading(true)
  //     const items = await parseFile(file)
  //     // if (items.length === 0) throw new Error("No valid items found in the file.")
  //     const formData = new FormData()
  //     formData.append("file", file)


  //     setParsedCount(items.length)
  //     const assigned = distributeEqually(items, agents)

  //     const token = localStorage.getItem("authToken") || ""
  //     await axios.post(ASSIGNMENTS_API, assigned, {
  //       headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
  //     })

  //     await mutate(ASSIGNMENTS_API)
  //     setBanner({ kind: "ok", text: `Distribution complete! Assigned ${items.length} items.` })
  //   } catch (err) {
  //     setBanner({ kind: "err", text: err?.response?.data?.message || err.message || String(err) })
  //   } finally {
  //     setLoading(false)
  //     setTimeout(() => setBanner(null), 4000)
  //   }
  // }

  const onDistribute = async () => {
  if (!file) {
    setBanner({ kind: "err", text: "Please choose a file first." })
    return
  }
  if (!agents || agents.length !== 5) {
    setBanner({ kind: "err", text: "Exactly 5 agents are required before distribution." })
    return
  }

  try {
    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    const token = localStorage.getItem("authToken") || ""
    const response = await axios.post(ASSIGNMENTS_API, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })

    setBanner({ kind: "ok", text: response.data.message || "Distribution complete!" })
    await mutate(ASSIGNMENTS_API)
  } catch (err) {
    setBanner({ kind: "err", text: err?.response?.data?.message || err.message || String(err) })
  } finally {
    setLoading(false)
    setTimeout(() => setBanner(null), 4000)
  }
}

  return (
    <div className="border rounded-lg p-6 bg-white shadow-lg grid gap-4 w-full max-w-xl mx-auto">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">Upload List & Distribute</h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload CSV/XLSX/XLS with columns: <strong>FirstName, Phone, Notes</strong>. Tasks will be split equally among 5 agents.
        </p>
      </div>

      {(!agents || agents.length !== 5) && (
        <div className="rounded-md border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">
          <strong>Exactly 5 agents required</strong>
          <p>Add or remove agents so that you have exactly 5 before distributing.</p>
        </div>
      )}

      {banner && (
        <div
          className={`rounded p-2 text-sm ${banner.kind === "err" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
        >
          {banner.text}
        </div>
      )}

      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={onFileChange}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {parsedCount !== null && <p className="text-sm text-gray-500">{parsedCount} valid items parsed.</p>}

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={onDistribute}
          disabled={loading || !file || !agents || agents.length !== 5}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading && <ClipLoader size={16} color="#fff" />}
          {loading ? "Distributing…" : "Distribute"}
        </button>

        {assignments && Object.keys(assignments).length > 0 && (
          <span className="text-sm text-gray-500">Latest distribution is saved.</span>
        )}
      </div>
    </div>
  )
}
