import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // 🔥 Context Hook
import { useCart } from "../../context/CartContext"; // Import CartContext

const roleDashboardMap = {
  admin: "/admin/dashboard",
  moderator: "/ModeratorDashboard",
  artist: "/artist/artistportfolio",
  shop: "/shop/dashboard",
  buyer: "/community",
  delivery_partner: "/delivery-partner",
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth(); // 🔥 Get login function from context
  const { fetchCartFromBackend } = useCart(); // Get fetchCartFromBackend

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      const { token, role, userId } = response.data;

      // 🌍 Use context + persist to localStorage
      login(token, role, userId);
      // Only fetch cart for buyers
      if (role?.toLowerCase() === "buyer" && fetchCartFromBackend) {
        await fetchCartFromBackend();
      }

      const userRole = role?.toLowerCase();
      const dashboardPath = roleDashboardMap[userRole];

      console.log("✅ Login successful:", { token, role, userId });

      if (dashboardPath) {
        navigate(dashboardPath);
      } else {
        setError("Unknown user role. Contact support.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf3e0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col lg:flex-row my-auto">
        {/* Left Side Images */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-[#362625] w-1/2 p-8 relative rounded-l-3xl">
          <div className="relative w-full h-[400px] flex items-center justify-center">
            <img
              src="/src/assets/bg5.jpg"
              alt="art1"
              className="absolute top-24 left-6 w-48 rounded-2xl shadow-xl z-10 transform -rotate-6"
            />
            <img
              src="/src/assets/bg4.jpg"
              alt="art2"
              className="absolute top-8 left-1/2 transform -translate-x-1/2 scale-110 w-52 rounded-2xl shadow-2xl z-20"
            />
            <img
              src="/src/assets/bg3.jpg"
              alt="art3"
              className="absolute top-24 right-6 w-48 rounded-2xl shadow-xl z-10 transform rotate-6"
            />
          </div>
          <div className="text-white text-center mt-10 px-4">
            <h1 className="text-4xl font-bold mb-4">ArtAura</h1>
            <p className="text-lg leading-relaxed">
              Every masterpiece starts with a spark — light yours up on ArtAura.
              Discover diverse artworks, elevate your creativity, and turn your
              passion into purpose.
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-white">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#362625] mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="text-sm font-medium text-[#362625] block mb-2">
                  Email or Username
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl text-gray-800 focus:ring-2 focus:ring-[#362625] outline-none"
                  required
                />
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-[#362625] block mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl text-gray-800 focus:ring-2 focus:ring-[#362625] outline-none pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-9 right-3 text-gray-500 bg-transparent"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-[#362625] text-white rounded-xl font-semibold flex justify-center items-center space-x-2 hover:bg-[#2c1f1f] transition ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <span>{loading ? "Signing In..." : "Sign In"}</span>
                <ArrowRight size={20} />
              </button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-[#362625] font-medium underline bg-transparent"
                >
                  Sign Up
                </button>
              </div>

              <p className="text-xs text-center text-gray-500 mt-6">
                By signing in, you agree to our{" "}
                <button className="underline text-[#362625] font-medium bg-transparent">
                  Terms of Service
                </button>
                ,{" "}
                <button className="underline text-[#362625] font-medium bg-transparent">
                  Privacy Policy
                </button>{" "}
                and{" "}
                <button className="underline text-[#362625] font-medium bg-transparent">
                  Cookie Policy
                </button>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
