import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginSchema } from "../lib/validations";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const labels = [
    {
      label: "email",
      type: "email",
      id: "email",
      name: "email",
      placeholder: "Enter your email",
    },
    {
      label: "password",
      type: "text",
      id: "password",
      name: "password",
      placeholder: "Enter your password...",
    },
  ];

  const handleSubmit = async (e) => {
    if (isSubmitting) return;
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate with Zod
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const success = await login(result.data.email, result.data.password);
      if (success) {
        if (success.blocked)
          return showToast("The user has been blocked!", "error");
        showToast("Login successful! Welcome back", "success");

        // Redirect admin (is_staff) users to admin dashboard
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.is_staff) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setErrors({ email: "Invalid credentials or user not found" });
        showToast("Invalid credentials or user not found", "error");
      }
    } catch (err) {
      setErrors({ email: "An error occurred during login" });
      showToast("An error occurred during login", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8">
          Please enter your details to sign in
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {labels.map((e) => (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {e.label}
              </label>
              <input
                type={e.type}
                id={e.id}
                value={formData[e.name]}
                onChange={(ev) => {
                  setFormData((prev) => ({
                    ...prev,
                    [e.name]: ev.target.value,
                  }));
                }}
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="john@example.com"
              />
              {errors[e.name] && (
                <p className="mt-1 text-sm text-red-600">{errors[e.name]}</p>
              )}
            </div>
          ))}

          <button
            disabled={isSubmitting}
            type="submit"
            className={`w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
