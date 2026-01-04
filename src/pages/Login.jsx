import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginSchema } from '../lib/validations';

const Login = () => {
  const [formData, setFormData] = useState({ email: undefined '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = loginSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0]] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const success = await login(result.data.email);
    if (success) {
      showToast("Login successful! Welcome back", "success");
      navigate('/');
    } else {
      setErrors({ email: undefined "Invalid credentials or user not found" });
      showToast("Invalid credentials or user not found", "error");
    }
  };

  return (
    
      
        Welcome Back
        Please enter your details to sign in

        
          
            
              Email Address
            
             {
                setFormData({ email: undefined e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined undefined });
              }}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              {errors.email}
            )}
          

          
            Sign In
          
        

        
          Don't have an account?{' '}
          
            Create account
          
        
      
    
  );
};

export default Login;
