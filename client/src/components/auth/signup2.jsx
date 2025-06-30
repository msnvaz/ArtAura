import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Palette, Store, ShoppingBag, Brush } from 'lucide-react';
import { useUser} from '../../context/UserContext'; 
import axios from 'axios';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    artistType: '',
    nic: ''
  });

  const { setUser } = useUser();
  const navigate = useNavigate();

  // Email validation function (simple regex)
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email format validation
    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Password length validation
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Prepare payload based on user type
    let endpoint = '';
    let payload = {};
    if (userType === 'artist') {
      endpoint = 'http://localhost:8080/api/auth/artist';
      payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        contactNo: formData.contactNumber,
        password: formData.password,
        artistType: formData.artistType,
        nic: formData.nic,
        agreedTerms: true // or get from checkbox if you have one
        // Add address fields if needed
      };
    } else if (userType === 'buyer') {
      endpoint = 'http://localhost:8080/api/auth/buyer';
      payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        contactNo: formData.contactNumber,
        password: formData.password,
        agreedTerms: true // or get from checkbox if you have one
        // Add address fields if needed
      };
    }

    // Example API call — replace with your actual API
    try {
      const res = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (res.status === 200) {
        alert('Registration successful! Please sign in.');
        navigate('/');
      } else {
        alert(res.data.message || 'Registration failed');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert('Something went wrong!');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setFormData({
      ...formData,
      role: type
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-cream/50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-brown p-3 rounded-full">
              <Palette className="h-8 w-8 text-cream" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-brown">Join ArtCommunity</h2>
          <p className="mt-2 text-sm text-brown/70">Create your account and start your art journey</p>
        </div>

        {!userType && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-brown mb-4">How do you want to join our community?</h3>
            </div>

            <div className="space-y-4">
              <button onClick={() => handleUserTypeSelect('artist')} className="w-full p-6 border-2 border-brown/20 rounded-lg hover:border-brown hover:bg-brown/5">
                <div className="flex items-center space-x-4">
                  <div className="bg-brown/10 p-3 rounded-full">
                    <Brush className="h-6 w-6 text-brown" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-brown">I'm an Artist</h4>
                    <p className="text-brown/70 text-sm">Create and sell your artwork, participate in challenges, showcase your portfolio</p>
                  </div>
                </div>
              </button>

              <button onClick={() => handleUserTypeSelect('buyer')} className="w-full p-6 border-2 border-brown/20 rounded-lg hover:border-brown hover:bg-brown/5">
                <div className="flex items-center space-x-4">
                  <div className="bg-brown/10 p-3 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-brown" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-brown">I want to discover art</h4>
                    <p className="text-brown/70 text-sm">Browse and purchase artwork, commission custom pieces, support artists</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brown/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-cream text-brown/60">or</span>
              </div>
            </div>

            <Link to="/register/shop" className="w-full bg-brown text-cream p-4 rounded-lg flex justify-center items-center space-x-3">
              <Store className="h-5 w-5" />
              <span>Register as Art Supply Shop</span>
            </Link>

            <div className="text-center">
              <span className="text-brown/70">Already have an account? </span>
              <Link to="/login" className="font-medium text-brown">Sign in here</Link>
            </div>
          </div>
        )}

        {userType && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-brown/5 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                {userType === 'artist' ? <Brush className="h-5 w-5 text-brown" /> : <ShoppingBag className="h-5 w-5 text-brown" />}
                <span className="font-medium text-brown">
                  Registering as {userType === 'artist' ? 'an Artist' : 'an Art Enthusiast'}
                </span>
                <button type="button" onClick={() => setUserType('')} className="ml-auto text-brown/60 text-sm">Change</button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-brown mb-1">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-brown/20 text-brown rounded-lg bg-white"
                placeholder="Enter your first name"
              />
              </div>

              <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-brown mb-1">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-brown/20 text-brown rounded-lg bg-white"
                placeholder="Enter your last name"
              />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brown mb-1">Email Address</label>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-brown/20 text-brown rounded-lg bg-white" placeholder="Enter your email" />
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-brown mb-1">Contact Number</label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  required
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-brown/20 text-brown rounded-lg bg-white"
                  placeholder="Enter your contact number"
                />
              </div>

              {userType === 'artist' && (
                <div className="space-y-4">
                <div>
                  <label htmlFor="artistType" className="block text-sm font-medium text-brown mb-1">Artist Specialization</label>
                  <select id="artistType" name="artistType" className="w-full px-3 py-3 border border-brown/20 text-brown rounded-lg bg-white">
                    <option value="">Select your specialization</option>
                    <option value="painting">Painting</option>
                    <option value="digital">Digital Art</option>
                    <option value="photography">Photography</option>
                    <option value="sculpture">Sculpture</option>
                    <option value="drawing">Drawing & Illustration</option>
                    <option value="mixed">Mixed Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                <label htmlFor="nic" className="block text-sm font-medium text-brown mb-1">NIC Number</label>
                <input
                  id="nic"
                  name="nic"
                  type="text"
                  required
                  value={formData.nic}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-brown/20 text-brown rounded-lg bg-white"
                  placeholder="Enter your NIC number"
                />
                </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-brown mb-1">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleInputChange}
                    className="w-full px-3 py-3 pr-10 border border-brown/20 text-brown rounded-lg bg-white" placeholder="Create a password" />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-brown/50" /> : <Eye className="h-5 w-5 text-brown/50" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-brown mb-1">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-brown/20 text-brown rounded-lg bg-white" placeholder="Confirm your password" />
              </div>
            </div>

            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-brown border-brown/20" />
              <label htmlFor="terms" className="ml-2 block text-sm text-brown">
                I agree to the <a href="#" className="font-medium text-brown">Terms and Conditions</a>
              </label>
            </div>

            <button type="submit" className="w-full py-3 px-4 rounded-lg text-white bg-brown hover:bg-brown/90">
              Create Account
            </button>

            <div className="text-center">
              <span className="text-brown/70">Already have an account? </span>
              <Link to="/login" className="font-medium text-brown">Sign in here</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
