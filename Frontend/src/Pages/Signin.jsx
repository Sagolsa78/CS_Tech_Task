"use client"
import React, { useState } from "react"
import axios from "axios"
import { useAuth } from "../lib/Auth-comtext"
import { useNavigate } from "react-router-dom"

export default function Signin() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert("Please enter both email and password.")
      return
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/v1/auth/login", { email, password });
      console.log(res);


      if (res.data.success) {
        const token = res.data.token
        if (token) {
          // ✅ Save token in localStorage
          localStorage.setItem("authToken", token)

          // ✅ Update context state
          login(token)
        }

        alert("Login successful!");
        navigate("/dashboard");

      } else {
        console.log("Invalid credentials");
      }

    } catch (error) {
      console.log(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);

    }

  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm p-8">
        <h2 className="text-2xl font-bold mb-2 text-center text-indigo-700">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Please sign in to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition transform hover:scale-[1.02] shadow-md disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Sign Up
          </a>
        </p>
      </div>
    </main>
  )
}
