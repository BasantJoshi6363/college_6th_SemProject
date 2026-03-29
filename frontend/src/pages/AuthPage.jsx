import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import loginImg from "../assets/login.png";
import SignInWithGoogle from "../components/SignInWithGoogle";
import { AuthContext } from "../context/AuthContext";

const AuthPage = () => {
  const { login, register, forgotPassword } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [message, setMessage] = useState("");

  // 1. Validation Schema using Yup
  const authSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: isForgotMode
      ? Yup.string() // Not required for forgot password
      : Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
    name: (!isLogin && !isForgotMode)
      ? Yup.string().required("Name is required")
      : Yup.string(),
  });

  // 2. Formik Logic
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: authSchema,
    onSubmit: async (values) => {
      setMessage("");
      try {
        if (isForgotMode) {
          if (isForgotMode) {
            const success = await forgotPassword(values.email);
            if (success) {
              setMessage("Reset link sent! Please check your inbox.");
              setIsForgotMode(false); // Optional: Take them back to login
            }
          }
        } else if (isLogin) {
          await login(values.email, values.password);
        } else {
          await register(values.name, values.email, values.password);
          setIsLogin(true);
        }
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      }
    },
  });

  return (
    <div className="flex justify-center min-h-screen items-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full flex overflow-hidden">

        {/* Left Side: Image */}
        <div className="w-1/2 hidden md:block">
          <img src={loginImg} alt="Auth" className="w-full h-full object-cover" />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isForgotMode ? "Reset Password" : isLogin ? "Login" : "Create Account"}
          </h2>
          <p className="text-gray-500 mb-8">
            {isForgotMode ? "We'll send a recovery link to your email" : "Enter your details below"}
          </p>

          {message && <p className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm">{message}</p>}

          <form onSubmit={formik.handleSubmit} className="space-y-4">

            {/* Name Field (Sign Up Only) */}
            {!isLogin && !isForgotMode && (
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  {...formik.getFieldProps("name")}
                  className={`w-full py-2 border-b outline-none focus:border-red-500 ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formik.touched.name && formik.errors.name && <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>}
              </div>
            )}

            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                {...formik.getFieldProps("email")}
                className={`w-full py-2 border-b outline-none focus:border-red-500 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>}
            </div>

            {/* Password Field (Hidden in Forgot Mode) */}
            {!isForgotMode && (
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  {...formik.getFieldProps("password")}
                  className={`w-full py-2 border-b outline-none focus:border-red-500 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formik.touched.password && formik.errors.password && <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-4">
              <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition duration-200">
                {isForgotMode ? "Send Reset Link" : isLogin ? "Login" : "Register"}
              </button>

              {!isForgotMode && <SignInWithGoogle />}
            </div>
          </form>

          {/* Bottom Toggles */}
          <div className="mt-8 text-center space-y-2">
            {isLogin && !isForgotMode && (
              <p className="text-sm text-blue-500 cursor-pointer hover:underline" onClick={() => setIsForgotMode(true)}>
                Forgot Password?
              </p>
            )}

            <p className="text-sm text-gray-600">
              {isForgotMode ? (
                <span onClick={() => setIsForgotMode(false)} className="text-blue-500 cursor-pointer font-medium">Back to Login</span>
              ) : isLogin ? (
                <>Don't have an account? <span onClick={() => setIsLogin(false)} className="text-blue-500 cursor-pointer font-medium">Sign Up</span></>
              ) : (
                <>Already have an account? <span onClick={() => setIsLogin(true)} className="text-blue-500 cursor-pointer font-medium">Log In</span></>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;