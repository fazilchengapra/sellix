import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../api/axios";

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const { token: paramToken } = useParams();
  const token = searchParams.get("token") || paramToken;
  const [status, setStatus] = useState("verifying");
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        showToast("No verification token provided.", "error");
        return;
      }

      try {
        const response = await api.post("auth/verify-account/", { token });
        setStatus("success");
        showToast(response.data.detail || "Account verified successfully. You can now log in.", "success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        setStatus("error");
        const errorData = error.response?.data;
        if (errorData && errorData.token) {
          showToast(errorData.token[0], "error");
        } else {
          showToast("Verification failed. Invalid or expired token.", "error");
        }
      }
    };

    verifyToken();
  }, [token, showToast, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Verification</h2>
        
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Verifying your account, please wait...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-green-600 font-medium mb-6">Account verified successfully! Redirecting to login...</p>
            <button 
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-6">Verification failed. The token may be invalid or expired.</p>
            <button 
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyAccount;
