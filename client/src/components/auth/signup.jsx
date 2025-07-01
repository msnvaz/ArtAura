// src/components/auth/SignupForm.jsx

import { useState } from 'react';
import { Eye, EyeOff, Heart, Palette, Store, ArrowRight } from 'lucide-react';

const userTypes = [
  {
    id: 'art-lover',
    name: 'Art Lover',
    icon: Heart,
    description: 'Discover and collect amazing artworks',
    color: '#ff6b6b'
  },
  {
    id: 'artist',
    name: 'Artist',
    icon: Palette,
    description: 'Showcase and sell your creative works',
    color: '#4ecdc4'
  },
  {
    id: 'shop',
    name: 'Art Shop',
    icon: Store,
    description: 'Manage your art business and inventory',
    color: '#45b7d1'
  }
];

const SignupForm = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const [selectedUserType, setSelectedUserType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!selectedUserType) newErrors.userType = 'Please select a user type';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (validateForm()) {
      const signupData = { ...formData, userType: selectedUserType };
      console.log('Signup data:', signupData);

      // Later replace this with your Spring Boot backend API call
      // axios.post('/api/auth/signup', signupData)
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#362625] mb-1">Full Name</label>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="input-style"
          placeholder="Enter your full name"
        />
        {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#362625] mb-1">Username</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="input-style"
          placeholder="Choose a username"
        />
        {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#362625] mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="input-style"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-[#362625] mb-1">Password</label>
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleInputChange}
          className="input-style pr-10"
          placeholder="Enter your password"
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-toggle">
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-[#362625] mb-1">Confirm Password</label>
        <input
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="input-style pr-10"
          placeholder="Confirm your password"
        />
        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-toggle">
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#362625] mb-2">I am a...</label>
        <div className="grid grid-cols-1 gap-3">
          {userTypes.map(({ id, name, icon: Icon, color, description }) => (
            <div
              key={id}
              onClick={() => setSelectedUserType(id)}
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                selectedUserType === id ? 'border-[#362625] border-2' : 'border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center mr-4 rounded-full" style={{ backgroundColor: `${color}20` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <h3 className="font-medium text-[#362625]">{name}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
        {errors.userType && <p className="text-red-500 text-xs mt-1">{errors.userType}</p>}
      </div>

      <button
        onClick={handleSignup}
        className="w-full py-3 bg-[#362625] text-white rounded-xl font-semibold flex justify-center items-center space-x-2 hover:bg-[#2c1f1f] transition"
      >
        <span>Create Account</span>
        <ArrowRight size={20} />
      </button>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button onClick={onBackToLogin} className="text-[#362625] font-medium underline bg-transparent">
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
