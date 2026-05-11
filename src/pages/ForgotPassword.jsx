import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import api from "../api/axios";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("auth/forgot-password/", { email });
      setIsSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      if (data?.email) {
        setError(Array.isArray(data.email) ? data.email[0] : data.email);
      } else if (data?.detail) {
        setError(data.detail);
      } else if (data?.error) {
        setError(data.error);
      } else if (data?.message && err.response?.status !== 200) {
        setError(data.message);
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
            Check Your Email
          </h2>
          <p className="text-gray-500 mb-2">
            We've sent a password reset link to
          </p>
          <p className="font-semibold text-gray-900 mb-6">{email}</p>
          <p className="text-sm text-gray-400 mb-8">
            Didn't receive the email? Check your spam folder or try again
            with a different email address.
          </p>
          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full py-3"
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
            >
              Try Another Email
            </Button>
            <Link to="/login">
              <Button variant="ghost" className="w-full py-3 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Button>
            </Link>
          </div>
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
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Forgot Password?
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />

            <Button
              type="submit"
              className="w-full py-3 text-base"
              isLoading={isSubmitting}
            >
              Send Reset Link
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
