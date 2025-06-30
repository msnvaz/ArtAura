import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Store } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

// Step 1: Basic Info
function BasicInfoStep({ formData, onChange, showPassword, setShowPassword }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-brown">Basic Information</h3>
        <p className="text-brown/70">Let's start with your shop and personal details</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="shopName" className="block text-sm font-medium text-brown mb-1">
            Shop Name <span className="text-red-500">*</span>
          </label>
          <input
            id="shopName"
            name="shopName"
            type="text"
            required
            value={formData.shopName}
            onChange={onChange}
            className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
            placeholder="Enter shop name"
          />
        </div>
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-brown mb-1">
            Owner Name <span className="text-red-500">*</span>
          </label>
          <input
            id="ownerName"
            name="ownerName"
            type="text"
            required
            value={formData.ownerName}
            onChange={onChange}
            className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
            placeholder="Enter owner name"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brown mb-1">
          Business Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={onChange}
          className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
          placeholder="Enter business email"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-brown mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={onChange}
              className="w-full px-3 py-3 pr-10 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
              placeholder="Create a secure password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-brown/50" />
              ) : (
                <Eye className="h-5 w-5 text-brown/50" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-brown mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={onChange}
            className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
            placeholder="Confirm your password"
          />
        </div>
      </div>
    </div>
  );
}

// Step 2: Business Info
function BusinessInfoStep({ formData, onChange, businessTypes }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-brown">Business Details</h3>
        <p className="text-brown/70">Tell us more about your business</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-brown mb-1">
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            id="businessType"
            name="businessType"
            required
            value={formData.businessType}
            onChange={onChange}
            className="w-full px-3 py-3 border border-brown/20 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
          >
            <option value="">Select business type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-brown mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="contactNo"
            type="tel"
            required
            value={formData.contactNo}
            onChange={onChange}
            className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      {/* <div>
        <label htmlFor="website" className="block text-sm font-medium text-brown mb-1">
          Website (Optional)
        </label>
        <input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={onChange}
          className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
          placeholder="https://www.yourshop.com"
        />
      </div> */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-brown mb-1">
          Shop Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={onChange}
          rows={4}
          className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
          placeholder="Describe your shop, what you sell, and what makes you special..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="businessLicense" className="block text-sm font-medium text-brown mb-1">
            Business License Number
          </label>
          <input
            id="businessLicense"
            name="businessLicense"
            type="text"
            value={formData.businessLicense}
            onChange={onChange}
            className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
            placeholder="BL123456789"
          />
        </div>
        <div>
          <label htmlFor="taxId" className="block text-sm font-medium text-brown mb-1">
            Tax ID / EIN
          </label>
          <input
            id="taxId"
            name="taxId"
            type="text"
            value={formData.taxId}
            onChange={onChange}
            className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
            placeholder="12-3456789"
          />
        </div>
      </div>
    </div>
  );
}

// Step 3: Location Info
function LocationInfoStep({ formData, onChange }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-brown">Location Information</h3>
        <p className="text-brown/70">Where is your shop located?</p>
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-brown mb-1">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          id="address"
          name="address"
          type="text"
          required
          value={formData.address}
          onChange={onChange}
          className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
          placeholder="123 Art Street"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-brown mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            value={formData.city}
            onChange={onChange}
            className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
            placeholder="New York"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-brown mb-1">
            State/Province <span className="text-red-500">*</span>
          </label>
          <input
            id="state"
            name="state"
            type="text"
            required
            value={formData.state}
            onChange={onChange}
            className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
            placeholder="NY"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-brown mb-1">
            ZIP/Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            id="zipCode"
            name="zipCode"
            type="text"
            required
            value={formData.zipCode}
            onChange={onChange}
            className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
            placeholder="10001"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-brown mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            id="country"
            name="country"
            type="text"
            required
            value={formData.country}
            onChange={onChange}
            className="w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent bg-white"
            placeholder="United States"
          />
        </div>
      </div>
    </div>
  );
}

// Step 4: Categories & Terms
function CategoriesStep({ formData, onCategoryToggle, categories, onTermsChange, onNewsletterChange }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-brown">Shop Categories & Final Steps</h3>
        <p className="text-brown/70">What type of art supplies do you sell?</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-brown mb-3">
          Shop Categories <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryToggle(category)}
              className={`p-3 text-sm rounded-lg border-2 transition-colors text-left ${
                formData.categories.includes(category)
                  ? 'border-brown bg-brown/5 text-brown'
                  : 'border-brown/20 text-brown/70 hover:border-brown/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <p className="text-xs text-brown/60 mt-2">
          Selected: {formData.categories.length} categories
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="terms"
            name="agreedTerms"
            type="checkbox"
            checked={formData.agreedTerms}
            onChange={onTermsChange}
            className="h-4 w-4 text-brown focus:ring-brown border-brown/20 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-brown">
            I agree to the{' '}
            <a href="#" className="font-medium text-brown hover:text-brown/80 transition-colors">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-brown hover:text-brown/80 transition-colors">
              Seller Agreement
            </a>
            <span className="text-red-500 ml-1">*</span>
          </label>
        </div>
        {/* <div className="flex items-center">
          <input
            id="newsletter"
            name="newsletter"
            type="checkbox"
            checked={formData.newsletter}
            onChange={onNewsletterChange}
            className="h-4 w-4 text-brown focus:ring-brown border-brown/20 rounded"
          />
          {/* <label htmlFor="newsletter" className="ml-2 block text-sm text-brown">
            Subscribe to our newsletter for shop updates and tips
          </label> 
        </div> */}
      </div>
    </div>
  );
}

// Progress Bar
function ProgressBar({ currentStep }) {
  const steps = [1, 2, 3, 4];
  const labels = ['Basic Info', 'Business Details', 'Location', 'Categories'];
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step) => (
          <div
            key={step}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step <= currentStep
                ? 'bg-brown text-cream'
                : 'bg-brown/20 text-brown/60'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="w-full bg-brown/20 rounded-full h-2">
        <div
          className="bg-brown h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-brown/60 mt-2">
        {labels.map((label) => <span key={label}>{label}</span>)}
      </div>
    </div>
  );
}

// Navigation Buttons
function NavigationButtons({ currentStep, prevStep, nextStep, isStepValid, isLastStep }) {
  return (
    <div className="flex justify-between pt-6 border-t border-brown/10">
      <div>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2 border border-brown text-brown rounded-lg hover:bg-brown hover:text-cream transition-colors font-medium"
          >
            Previous
          </button>
        )}
      </div>
      <div className="flex space-x-3">
        {!isLastStep ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid()}
            className="px-6 py-2 bg-brown text-cream rounded-lg hover:bg-brown/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
          </button>
        ) : (
          <button
            type="submit"
            disabled={!isStepValid()}
            className="px-6 py-2 bg-brown text-cream rounded-lg hover:bg-brown/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Shop Account
          </button>
        )}
      </div>
    </div>
  );
}

// Main Page
function ShopRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    description: '',
    contactNo: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    categories: [],
    businessLicense: '',
    taxId: '',
    agreedTerms: false,
    newsletter: false
  });

  const { setUser } = useUser();
  const navigate = useNavigate();

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Corporation',
    'LLC',
    'Other'
  ];

  const shopCategories = [
    'Painting Supplies',
    'Drawing Materials',
    'Digital Art Tools',
    'Sculpture Supplies',
    'Craft Materials',
    'Professional Equipment',
    'Canvas & Paper',
    'Brushes & Tools',
    'Art Books & Education',
    'Framing & Display'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryToggle = (category) => {
    setFormData({
      ...formData,
      categories: formData.categories.includes(category)
        ? formData.categories.filter(c => c !== category)
        : [...formData.categories, category]
    });
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
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
    if (formData.categories.length === 0) {
      alert('Please select at least one shop category');
      return;
    }
    setUser({
      id: '1',
      name: formData.ownerName,
      email: formData.email,
      role: 'shop',
      avatar: undefined
    });
    navigate('/');

     // Prepare data for backend (remove confirmPassword, etc.)
    const payload = { ...formData };
    delete payload.confirmPassword;

    try {
      const response = await axios.post('http://localhost:8080/api/auth/shop', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 201 || response.status === 200) {
        // Success logic here
        alert('Shop registered successfully!');
        navigate('/');
      } else {
        alert('Failed to register shop');
      }
    } catch (error) {
      // Axios error handling
      if (error.response && error.response.data && error.response.data.message) {
        alert('Error: ' + error.response.data.message);
      } else {
        alert('Error: ' + error.message);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.shopName && formData.ownerName && formData.email && formData.password && formData.confirmPassword;
      case 2:
        return formData.businessType && formData.description && formData.contactNo;
      case 3:
        return formData.address && formData.city && formData.state && formData.zipCode && formData.country;
      case 4:
        return formData.categories.length > 0 && formData.agreedTerms;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-cream/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-brown p-3 rounded-full">
              <Store className="h-8 w-8 text-cream" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-brown">Register Your Art Supply Shop</h2>
          <p className="mt-2 text-sm text-brown/70">
            Join our community and start selling art supplies to artists worldwide
          </p>
        </div>
        <ProgressBar currentStep={currentStep} />
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          {currentStep === 1 && (
            <BasicInfoStep
              formData={formData}
              onChange={handleInputChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          )}
          {currentStep === 2 && (
            <BusinessInfoStep
              formData={formData}
              onChange={handleInputChange}
              businessTypes={businessTypes}
            />
          )}
          {currentStep === 3 && (
            <LocationInfoStep
              formData={formData}
              onChange={handleInputChange}
            />
          )}
          {currentStep === 4 && (
            <CategoriesStep
              formData={formData}
              onCategoryToggle={handleCategoryToggle}
              categories={shopCategories}
              onTermsChange={e => setFormData({ ...formData, agreedTerms: e.target.checked })}
              onNewsletterChange={e => setFormData({ ...formData, newsletter: e.target.checked })}
            />
          )}
          <NavigationButtons
            currentStep={currentStep}
            prevStep={prevStep}
            nextStep={nextStep}
            isStepValid={isStepValid}
            isLastStep={currentStep === 4}
          />
          <div className="text-center pt-4">
            <span className="text-brown/70">Already have an account? </span>
            <Link
              to="/login"
              className="font-medium text-brown hover:text-brown/80 transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShopRegisterPage;
