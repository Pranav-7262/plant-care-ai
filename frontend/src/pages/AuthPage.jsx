import { useState } from "react";
import axios from "axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const { data } = await axios.post(endpoint, payload);

      localStorage.setItem("userInfo", JSON.stringify(data)); // ✅ save token
      alert(`${isLogin ? "Login" : "Registration"} successful!`);
      window.location.href = "/my-plants"; // redirect after success
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          {isLogin ? "Sign In" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
          >
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-green-600 font-semibold hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-green-600 font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
