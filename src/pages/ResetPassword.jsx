import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import api from "../api/axios";
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // ── Client-side validation ────────────────────────────────────────
    const errs = {};
    if (!token) errs.token = "Reset token is missing. Please use the link from your email.";
    if (!formData.new_password) errs.new_password = "New password is required";
    else if (formData.new_password.length < 4)
      errs.new_password = "Password must be at least 4 characters";
    if (!formData.confirm_password)
      errs.confirm_password = "Please confirm your password";
    else if (formData.new_password !== formData.confirm_password)
      errs.confirm_password = "Passwords do not match";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("auth/reset-password/", {
        token,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });
      setIsSuccess(true);
      showToast("Password reset successful!", "success");
    } catch (error) {
      const data = error.response?.data;
      if (data) {
        const backendErrors = {};
        if (data.token) backendErrors.token = Array.isArray(data.token) ? data.token[0] : data.token;
        if (data.new_password) backendErrors.new_password = Array.isArray(data.new_password) ? data.new_password[0] : data.new_password;
        if (data.confirm_password) backendErrors.confirm_password = Array.isArray(data.confirm_password) ? data.confirm_password[0] : data.confirm_password;
        if (data.detail) backendErrors.token = data.detail;
        if (data.error) backendErrors.token = data.error;
        if (data.message && error.response?.status !== 200) backendErrors.token = data.message;

        if (Object.keys(backendErrors).length) {
          setErrors(backendErrors);
        } else {
          showToast("Failed to reset password. Please try again.", "error");
        }
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success state ───────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Password Reset Successful
          </h2>
          <p className="text-gray-500 mb-8">
            Your password has been updated. You can now log in with your new
            password.
          </p>
          <Link to="/login">
            <Button className="w-full py-3 text-base">
              Go to Login
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // ── No token state ──────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-gray-500 mb-8">
            This password reset link is invalid or has expired. Please
            request a new one.
          </p>
          <Link to="/login">
            <Button className="w-full py-3 text-base">
              Back to Login
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // ── Form state ──────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full">
        <Card className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Set New Password
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Enter your new password below to reset your account
            </p>
          </div>

          {/* Token error banner */}
          {errors.token && (
            <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.token}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="relative">
              <Input
                label="New Password"
                type={showNew ? "text" : "password"}
                placeholder="Enter your new password"
                value={formData.new_password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    new_password: e.target.value,
                  }))
                }
                error={errors.new_password}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNew ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your new password"
                value={formData.confirm_password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirm_password: e.target.value,
                  }))
                }
                error={errors.confirm_password}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                className="w-full py-3 text-base"
                isLoading={isSubmitting}
              >
                Reset Password
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
