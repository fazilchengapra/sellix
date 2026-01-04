import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { registerSchema } from '../lib/validations';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = registerSchema.safeParse(formData);
    
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

    const success = await register(result.data.name, result.data.email);
    if (success) {
      showToast(`Welcome ${result.data.name}! Your account has been created`, "success");
      navigate('/');
    } else {
      setErrors({ email: "User might already exist" });
      showToast("Registration failed. User might already exist", "error");
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    
      
        Create Account
        Start your shopping journey today

        
          
            
              Full Name
            
             updateField('name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              {errors.name}
            )}
          
          
          
            
              Email Address
            
             updateField('email', e.target.value)}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              {errors.email}
            )}
          

          
            Create Account
          
        

        
          Already have an account?{' '}
          
            Sign in
          
        
      
    
  );
};

export default Register;
