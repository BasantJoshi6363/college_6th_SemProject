import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const SignInWithGoogle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      try {
        setLoading(true);

        const resp = await axios.post(
          "http://localhost:5000/api/auth/google",
          { code: response.code }
        );

        console.log("login success", resp.data);

        localStorage.setItem("google-token", resp.data.token);
        navigate("/");
      } catch (error) {
        console.error("Google login failed:", error);
        alert("Google sign-in failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.error("Google login error");
      alert("Google sign-in was cancelled or failed.");
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <FcGoogle size={22} />
      <span className="text-sm font-medium text-gray-700">
        {loading ? "Signing in..." : "Continue with Google"}
      </span>
    </button>
  );
};

export default SignInWithGoogle;
