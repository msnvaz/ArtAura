import { useState } from 'react';
import { Eye, EyeOff, Palette, Heart, Store, ArrowRight } from 'lucide-react';

const ArtAuraAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (isLogin) {
      console.log('Login attempt:', { email: formData.email, password: formData.password });
    } else {
      console.log('Signup attempt:', { ...formData, userType: selectedUserType });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf3e0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col lg:flex-row my-auto">

        {/* Left Branding Section */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-[#362625] text-white w-1/2 p-10 rounded-l-3xl">
          <Palette className="w-12 h-12 mb-4" />
          <h1 className="text-4xl font-bold mb-4">ArtAura</h1>
          <p className="text-center text-lg leading-relaxed">
            Every masterpiece starts with a spark — light yours up on ArtAura. Discover diverse artworks, elevate your creativity, engage with fellow artists, and turn your passion into purpose by sharing or selling your art — all on our platform.
          </p>
        </div>

        {/* Right Auth Form Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-white">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#362625] mb-2">{isLogin ? 'Welcome Back' : 'Join ArtAura'}</h2>
              <p className="text-gray-600">{isLogin ? 'Sign in to your account' : 'Create your creative journey'}</p>
            </div>

            <div className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <label className="text-sm font-medium text-[#362625] block mb-2">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl text-gray-800 focus:ring-2 focus:ring-[#362625] outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#362625] block mb-2">Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Choose a username" className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl text-gray-800 focus:ring-2 focus:ring-[#362625] outline-none" />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium text-[#362625] block mb-2">{isLogin ? 'Email or Username' : 'Email'}</label>
                <input type={isLogin ? 'text' : 'email'} name="email" value={formData.email} onChange={handleInputChange} placeholder={isLogin ? 'Enter your email or username' : 'Enter your email'} className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl text-gray-800 focus:ring-2 focus:ring-[#362625] outline-none" />
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-[#362625] block mb-2">Password</label>
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter your password" className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl text-gray-800 focus:ring-2 focus:ring-[#362625] outline-none pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-9 right-3 text-gray-500 bg-transparent">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {!isLogin && (
                <>
                  <div className="relative">
                    <label className="text-sm font-medium text-[#362625] block mb-2">Confirm Password</label>
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your password" className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl text-gray-800 focus:ring-2 focus:ring-[#362625] outline-none pr-10" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-9 right-3 text-gray-500 bg-transparent">
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#362625] block mb-3">I am a...</label>
                    <div className="grid grid-cols-1 gap-3">
                      {userTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div
                            key={type.id}
                            onClick={() => setSelectedUserType(type.id)}
                            className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                              selectedUserType === type.id
                                ? 'border-2 border-[#362625] bg-[#362625]10'
                                : 'border border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div
                              className="w-10 h-10 flex items-center justify-center mr-4 rounded-full"
                              style={{ backgroundColor: `${type.color}20` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: type.color }} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-[#362625]">{type.name}</h3>
                              <p className="text-sm text-gray-500">{type.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handleSubmit}
                disabled={!isLogin && !selectedUserType}
                className="w-full py-3 bg-[#362625] text-white rounded-xl font-semibold flex justify-center items-center space-x-2 hover:bg-[#2c1f1f] transition"
              >
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={20} />
              </button>

              <div className="text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setSelectedUserType('');
                    setFormData({ email: '', username: '', password: '', confirmPassword: '', fullName: '' });
                  }}
                  className="text-[#362625] font-medium underline bg-transparent"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </div>

              <p className="text-xs text-center text-gray-500 mt-6">
                By {isLogin ? 'signing in' : 'signing up'}, you agree to our{' '}
                <button className="underline text-[#362625] font-medium bg-transparent">Terms of Service</button>,{' '}
                <button className="underline text-[#362625] font-medium bg-transparent">Privacy Policy</button>{' '}
                and{' '}
                <button className="underline text-[#362625] font-medium bg-transparent">Cookie Policy</button>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtAuraAuth;




