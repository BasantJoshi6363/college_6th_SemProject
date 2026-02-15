import React, { useState, useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";

const SignInWithGoogle = () => {
  const navigate = useNavigate();
  const { googleLogin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      try {
        setLoading(true);
        const data = await googleLogin(response.code);

        if (!data) throw new Error("Google login failed");

        console.log("login success", data);
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
