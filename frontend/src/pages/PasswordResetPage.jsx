import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import loginImg from "../assets/login.png";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      const success = await resetPassword(token, values.password);
      if (success) {
        navigate("/signup"); // Redirect to login page on success
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">New Password</h2>
          <p className="text-gray-500 mb-8">Please enter your new password below.</p>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                name="password"
                placeholder="New Password"
                {...formik.getFieldProps("password")}
                className={`w-full py-2 border-b outline-none focus:border-red-500 ${
                  formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                {...formik.getFieldProps("confirmPassword")}
                className={`w-full py-2 border-b outline-none focus:border-red-500 ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition duration-200"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;