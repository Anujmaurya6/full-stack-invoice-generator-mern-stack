import { API } from "../services/api"

export default function Signup() {
// ... existing state ...
  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await API.post("/auth/register", { name, email, password })
      const data = response.data

      if (response.status === 200 || response.status === 201) {
        alert("Signup successful. Please login.")
        navigate("/login")
      } else {
        alert(data.msg)
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
        onSubmit={handleSignup}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">
          Create Account
        </h2>

        {/* Name */}
        <input
          placeholder="Full Name"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Button */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {/* Link */}
        <p className="text-sm text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
