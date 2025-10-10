import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { dispatchLoginEvent } from "../components/NavBar";
import { useNavigate } from "react-router-dom";
// Import icons for modern form fields
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state for UX

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const payload = isLogin
        ? { email: data.email, password: data.password }
        : data;

      // NOTE: Using localStorage for user info - consider using Firebase Auth for production
      const res = await axios.post(endpoint, payload);

      localStorage.setItem("userInfo", JSON.stringify(res.data));
      dispatchLoginEvent(); // Call the defined function

      toast.success(`${isLogin ? "Login" : "Registration"} successful!`);
      navigate("/my-plants");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "An unexpected error occurred!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper component for styled input fields with icons
  const InputField = ({
    icon: Icon,
    type = "text",
    placeholder,
    name,
    validation,
    error,
    children,
  }) => (
    <div>
      <div className="relative flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition-all duration-300">
        <div className="pl-4 pr-3 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          {...register(name, validation)}
          className="w-full p-3 bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
        />
        {children}
      </div>
      {error && (
        <p className="text-red-500 text-xs font-medium mt-1 ml-1">
          {error.message}
        </p>
      )}
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen p-3 bg-gray-50">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-lg transform hover:shadow-3xl transition-shadow duration-500 border border-gray-100">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
          {isLogin ? "Sign In to PlantCareAI" : "Join the Plant Community"}
        </h1>
        <p className="text-center text-gray-500 mb-8">
          {isLogin
            ? "Welcome back, plant whisperer."
            : "Start tracking your green friends today."}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Name Field (Register Only) */}
          {!isLogin && (
            <InputField
              icon={User}
              placeholder="Full Name"
              name="name"
              validation={{ required: "Name is required" }}
              error={errors.name}
            />
          )}

          {/* Email Field */}
          <InputField
            icon={Mail}
            type="email"
            placeholder="Email Address"
            name="email"
            validation={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            }}
            error={errors.email}
          />

          {/* Password Field */}
          <InputField
            icon={Lock}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            validation={{
              required: "Password is required",
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message: "Min 6 characters, must include a letter and a number",
              },
            }}
            error={errors.password}
          >
            {/* Password Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 bottom-0 pr-4 flex items-center text-gray-500 hover:text-green-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </InputField>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full p-4 rounded-xl font-bold text-white text-lg 
                       bg-gradient-to-r from-green-500 to-green-600 
                       shadow-lg shadow-green-300/50 
                       hover:from-green-600 hover:to-green-700 
                       transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="text-center text-gray-500 mt-6 text-sm">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-green-600 font-semibold hover:text-green-700 hover:underline transition-colors"
              >
                SignUp
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-green-600 font-semibold hover:text-green-700 hover:underline transition-colors"
              >
                SignIn
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
