"use client"
import React
 from "react" 
 import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HashLoader } from "react-spinners"
import { AuthProvider } from "./lib/Auth-comtext"

// Lazy load pages
const DashboardShell = lazy(() => import("./Pages/DashBoard"))

const Signup = lazy(() => import("./Pages/Signup"))
const Signin = lazy(() => import("./Pages/Signin"))

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="items-center h-screen flex justify-center">
                <HashLoader />
              </div>
            }
          >
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/dashboard" element={<DashboardShell />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App
