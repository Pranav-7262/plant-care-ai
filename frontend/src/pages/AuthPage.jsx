import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const payload = isLogin
        ? { email: data.email, password: data.password }
        : data;

      const res = await axios.post(endpoint, payload);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      alert(`${isLogin ? "Login" : "Registration"} successful!`);
      window.location.href = "/my-plants";
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong!";
      alert(message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          {isLogin ? "Sign In" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Full Name"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </>
          )}

          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
            placeholder="Email"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message:
                  "Password must be at least 6 characters and contain at least one letter and one number",
              },
            })}
            placeholder="Password"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}

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
