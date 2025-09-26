import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// Import the event dispatcher from NavBar
import { dispatchLoginEvent } from "../components/NavBar";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
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

      const res = await axios.post(endpoint, payload); // 1. Store user info

      localStorage.setItem("userInfo", JSON.stringify(res.data));

      // 2. Dispatch event to notify the NavBar (and other components) of the change
      dispatchLoginEvent();

      toast.success(`${isLogin ? "Login" : "Registration"} successful!`);
      navigate("/my-plants");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong!";
      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-tr from-green-100 via-white to-green-200">
      {" "}
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        {" "}
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-6 tracking-wide">
          {isLogin ? "Welcome Back" : "Create Your Account"}{" "}
        </h1>{" "}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {" "}
          {!isLogin && (
            <div>
                           {" "}
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Full Name"
                className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
                           {" "}
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                                    {errors.name.message}               {" "}
                </p>
              )}
                         {" "}
            </div>
          )}
                   {" "}
          <div>
                       {" "}
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              })}
              placeholder="Email"
              className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
                       {" "}
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}             {" "}
              </p>
            )}
                     {" "}
          </div>
                   {" "}
          <div>
                       {" "}
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message:
                    "Password must be at least 6 characters and contain at least one letter and one number",
                },
              })}
              placeholder="Password"
              className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
                       {" "}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}             {" "}
              </p>
            )}
                       {" "}
            <label className="inline-flex items-center mt-2 text-sm text-gray-600">
                           {" "}
              <input
                type="checkbox"
                className="mr-2"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
                            Show Password            {" "}
            </label>
                     {" "}
          </div>
                   {" "}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold text-lg transition duration-200"
          >
                        {isLogin ? "Sign In" : "Register"}         {" "}
          </button>
                 {" "}
        </form>
               {" "}
        <div className="text-center text-gray-600 mt-6 text-sm">
                   {" "}
          {isLogin ? (
            <>
                            Don’t have an account?              {" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-green-600 font-medium hover:underline"
              >
                                Register              {" "}
              </button>
                         {" "}
            </>
          ) : (
            <>
                            Already have an account?              {" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-green-600 font-medium hover:underline"
              >
                                Sign In              {" "}
              </button>
                         {" "}
            </>
          )}
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}
