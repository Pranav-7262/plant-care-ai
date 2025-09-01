import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // ✅ Save token here
      localStorage.setItem("token", data.token);

      alert("Login successful! Token saved.");
      window.location.href = "/my-plants"; // redirect to MyPlants page
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-64">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
