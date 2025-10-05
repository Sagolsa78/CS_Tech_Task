"use client"
import React, { useState } from "react"
import axios from "axios"
import { useAuth } from "../lib/Auth-comtext"
import { useNavigate } from "react-router-dom"

export default function Signup() {
  const { register } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate=useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      alert("All fields are required.")
      return
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.")
      return
    }

    try {
      console.log(email, password);
      setLoading(true)
      const res = await axios.post("http://localhost:5000/api/v1/auth/register", {
        email,
        password,
      })
      console.log(res);


      if (res.data.success) {
        // register(email, password) // optional local hook
        alert("Account created successfully. You can now sign in.")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        
      } else {
        alert(res.data.message || "User already exists.")
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.")


    } finally {
      setLoading(false)
      navigate("/signin")
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm p-8 relative">
        <h2 className="text-2xl font-bold mb-2 text-center text-indigo-700">
          Create Account
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Sign up to get started
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition transform hover:scale-[1.02] shadow-md disabled:opacity-70"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Sign In
          </a>
        </p>
      </div>
    </main>
  )
}
