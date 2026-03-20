import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function Login() {

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {

    e.preventDefault()
    setLoading(true)

    try {

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {

        login(data)   // ✅ context login

        navigate("/dashboard")

      } else {

        alert(data?.msg || "Login failed")

      }

    } catch {

      alert("Server error")

    } finally {

      setLoading(false)

    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 px-4">

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >

        <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-105 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-5 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

      </form>

    </div>
  )

}