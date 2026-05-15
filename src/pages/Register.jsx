import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { registerSchema } from "../lib/validations";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });
  const [isAdminRegistration, setIsAdminRegistration] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const labels = [
    {
      label: "name",
      type: "text",
      id: "name",
      name: 'name',
      placeholder: 'Enter your name...'
    },
    {
      label: "email",
      type: "email",
      id: "email",
      name: 'email',
      placeholder: 'Enter your email'
    },
    {
      label: "password",
      type: "text",
      id: "pass",
      name: 'password',
      placeholder: 'Enter a password'
    },
    {
      label: "confirm password",
      type: "text",
      id: "cpass",
      name: 'confirmPassword',
      placeholder: 'confirm password'
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = registerSchema.safeParse(formData);

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

    const {name, email, password, adminCode, confirmPassword} = result.data


    const response = await register(name, email, password, formData.adminCode, confirmPassword);
    if (response.success) {
      if (response.status === 201) {
        showToast(
          "Check your mail and verify your account",
          "success"
        );
        navigate("/login");
      } else {
        showToast(
          `Welcome ${result.data.name}! Your account has been created`,
          "success"
        );
        navigate("/");
      }
    } else {
      setErrors({ email: "User might already exist" });
      showToast("Registration failed. User might already exist", "error");
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h2>
        <p className="text-gray-500 mb-8">Start your shopping journey today</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {labels.map((e) => (
            <div>
              <label
                htmlFor={e.id}
                className="block text-sm font-medium text-gray-700 mb-1 capitalize"
              >
                {e.label}
              </label>
              <input
                type={e.type}
                id={e.id}
                value={formData[e.name]}
                onChange={(ev) => updateField(e.name, ev.target.value)}
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
                  errors.name ? "border-red-500" : "border-gray-200"
                }`}
                placeholder={e.placeholder}
              />
              {errors[e.name] && (
                <p className="mt-1 text-sm text-red-600">{errors[e.name]}</p>
              )}
            </div>
          ))}
              
              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="checkbox" 
                  id="admin-mode" 
                  checked={isAdminRegistration} 
                  onChange={(e) => setIsAdminRegistration(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="admin-mode" className="text-sm text-gray-600 select-none cursor-pointer">
                  Register as Admin
                </label>
              </div>

              {isAdminRegistration && (
                <div>
                  <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    Admin Secret Code
                  </label>
                  <input
                    type="password"
                    id="adminCode"
                    value={formData.adminCode}
                    onChange={(ev) => updateField("adminCode", ev.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter admin secret code"
                  />
                </div>
              )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
