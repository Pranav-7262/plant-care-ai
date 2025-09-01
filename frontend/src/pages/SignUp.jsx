import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      // ✅ Save token here too
      localStorage.setItem("token", data.token);

      alert("Registration successful! Token saved.");
      window.location.href = "/my-plants"; // redirect
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-64">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
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
          Register
        </button>
      </form>
    </div>
  );
}
