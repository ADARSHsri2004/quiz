import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { HiLockClosed } from "react-icons/hi";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  console.log(`${process.env.REACT_APP_API_URL}`)

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setErr("Invalid email or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 to-white">
      <form onSubmit={submit} className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm flex flex-col gap-4">
        <div className="flex flex-col items-center mb-2">
          <span className="bg-indigo-50 p-3 rounded-full mb-1">
            <HiLockClosed className="text-3xl text-indigo-600" />
          </span>
          <h2 className="text-2xl font-bold text-indigo-700">Login to QuizPro</h2>
        </div>
        <div className="mb-1">
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Email
          </label>
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-300 transition" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Password
          </label>
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-300 transition" />
        </div>
        {err && <div className="bg-red-100 text-red-600 px-3 py-2 rounded">{err}</div>}
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white transition text-lg font-semibold py-2 rounded-lg shadow"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center text-gray-600 mt-1">
          New user?{" "}
          <Link to="/signup" className="text-indigo-500 hover:underline font-semibold">Register</Link>
        </div>
      </form>
    </div>
  );
}
