import React, { useState, useContext, useCallback } from "react";
import loginImg from "../assets/login.png";
import SignInWithGoogle from "../components/SignInWithGoogle";
import { AuthContext } from "../context/AuthContext";

const AuthPage = () => {
  const { login, register } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  // Handle input change
  const handleChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  // Handle submit
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        if (isLogin) {
          await login(email, password);
        } else {
          await register(name, email, password);
          setIsLogin(true);
        }
      } catch (error) {
        console.error(error.message);
        alert(error.message);
      }
    },
    [isLogin, email, password, name, login, register]
  );

  return (
    <div className="flex justify-center min-h-fit items-center">
      <div className="p-8 rounded-lg max-w-4xl w-full flex">
        
        {/* Left Image */}
        <div className="w-1/2 hidden md:block">
          <img
            src={loginImg}
            alt="Auth"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 px-6 flex flex-col justify-center">
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isLogin ? "Login to your account" : "Create an account"}
          </h2>

          <p className="text-gray-600 text-sm mb-6">
            {isLogin
              ? "Enter your details below"
              : "Enter your details to sign up"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={handleChange}
                className="w-full py-2 mb-4 outline-none border-b border-gray-300 focus:border-black"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              className="w-full py-2 mb-4 outline-none border-b border-gray-300 focus:border-black"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              className="w-full py-2 mb-4 outline-none border-b border-gray-300 focus:border-black"
              required
            />

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-md font-semibold mb-4"
            >
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          {/* Google Sign In */}
          <SignInWithGoogle />

          {/* Toggle */}
          <p className="text-center text-sm text-gray-600 mt-2">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 font-medium cursor-pointer"
            >
              {isLogin ? "Create Account" : "Log In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
