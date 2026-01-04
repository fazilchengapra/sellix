import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { registerSchema } from '../lib/validations';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = registerSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const success = await register(result.data.name, result.data.email);
    if (success) {
      showToast(`Welcome ${result.data.name}! Your account has been created`, "success");
      navigate('/');
    } else {
      setErrors({ email: "User might already exist" });
      showToast("Registration failed. User might already exist", "error");
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-500 mb-8">Start your shopping journey today</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

