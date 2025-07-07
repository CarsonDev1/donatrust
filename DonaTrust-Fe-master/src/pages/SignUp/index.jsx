import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import EditText from '../../components/ui/EditText';
import { useAuth } from '../../context/AuthContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register, googleLogin, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await register({
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
      });

      alert('Account created successfully! Please check your email to verify your account.');
      navigate('/signin');
    } catch (error) {
      // Handle specific error cases
      if (error.status === 422) {
        // Handle validation errors
        const validationErrors = {};
        if (error.errors) {
          error.errors.forEach((err) => {
            validationErrors[err.field] = err.message;
          });
        }
        setErrors(validationErrors);
      } else if (error.status === 409) {
        setErrors({
          email: 'An account with this email already exists',
        });
      } else {
        setErrors({
          general: error.message || 'Failed to create account. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      // Note: In a real implementation, you would use Google OAuth2 SDK
      // This is a placeholder for Google OAuth integration
      alert(
        'Google OAuth integration needs to be implemented. Please use email/password registration for now.'
      );

      // Example of how it would work:
      // const googleToken = await getGoogleToken(); // This would come from Google OAuth
      // await googleLogin(googleToken);
    } catch (error) {
      setErrors({
        general: error.message || 'Google sign up failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInRedirect = () => {
    navigate('/signin');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white lg:flex-row">
      {/* Left Side - Sign Up Form */}
      <div className="flex flex-col justify-center items-center px-4 py-6 w-full lg:items-start lg:w-1/2 sm:px-6 md:px-8 lg:px-10 xl:px-16 sm:py-8 lg:py-12">
        {/* Logo */}
        <div className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[381px] h-auto mb-6 sm:mb-8 lg:mb-10">
          <img src="/logo-auth.png" alt="DonaTrust Logo" className="object-contain w-full h-auto" />
        </div>

        {/* Sign Up Form */}
        <div className="flex flex-col w-full max-w-[400px] sm:max-w-[450px] lg:max-w-[455px]">
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-black mb-2 text-center lg:text-left">
            Sign up
          </h1>

          <p className="mb-6 text-sm leading-relaxed text-center text-gray-500 sm:mb-8 sm:text-base lg:text-left">
            Sign up to join hands for the community with DonaTrust
          </p>

          {/* Form */}
          <form onSubmit={handleSignUp} className="flex flex-col space-y-4 sm:space-y-5">
            {/* Name Field */}
            <div className="relative w-full">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange('name')}
                className="px-3 py-3 w-full text-sm bg-transparent rounded-lg border border-gray-200 transition-colors duration-300 outline-none sm:px-4 sm:py-3.5 sm:text-base peer focus:border-blue-500"
              />
              <span
                className={`absolute transition-all duration-300 pointer-events-none text-gray-400 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 text-sm sm:text-base ${
                  formData.name
                    ? '-top-2.5 sm:-top-3 left-2 scale-[0.85] sm:scale-[0.9] text-blue-500 bg-white px-1'
                    : 'top-3 sm:top-3.5 left-3 sm:left-4 peer-focus:-top-2.5 sm:peer-focus:-top-3 peer-focus:left-2 peer-focus:scale-[0.85] sm:peer-focus:scale-[0.9]'
                }`}
              >
                Your Name
              </span>
              {errors.name && (
                <span className="mt-1 text-xs text-red-500 sm:text-sm">{errors.name}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="relative w-full">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className="px-3 py-3 w-full text-sm bg-transparent rounded-lg border border-gray-200 transition-colors duration-300 outline-none sm:px-4 sm:py-3.5 sm:text-base peer focus:border-blue-500"
              />
              <span
                className={`absolute transition-all duration-300 pointer-events-none text-gray-400 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 text-sm sm:text-base ${
                  formData.email
                    ? '-top-2.5 sm:-top-3 left-2 scale-[0.85] sm:scale-[0.9] text-blue-500 bg-white px-1'
                    : 'top-3 sm:top-3.5 left-3 sm:left-4 peer-focus:-top-2.5 sm:peer-focus:-top-3 peer-focus:left-2 peer-focus:scale-[0.85] sm:peer-focus:scale-[0.9]'
                }`}
              >
                Email
              </span>
              {errors.email && (
                <span className="mt-1 text-xs text-red-500 sm:text-sm">{errors.email}</span>
              )}
            </div>

            {/* Phone Field */}
            <div className="relative w-full">
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                className="px-3 py-3 w-full text-sm bg-transparent rounded-lg border border-gray-200 transition-colors duration-300 outline-none sm:px-4 sm:py-3.5 sm:text-base peer focus:border-blue-500"
              />
              <span
                className={`absolute transition-all duration-300 pointer-events-none text-gray-400 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 text-sm sm:text-base ${
                  formData.phone
                    ? '-top-2.5 sm:-top-3 left-2 scale-[0.85] sm:scale-[0.9] text-blue-500 bg-white px-1'
                    : 'top-3 sm:top-3.5 left-3 sm:left-4 peer-focus:-top-2.5 sm:peer-focus:-top-3 peer-focus:left-2 peer-focus:scale-[0.85] sm:peer-focus:scale-[0.9]'
                }`}
              >
                Phone number
              </span>
              {errors.phone && (
                <span className="mt-1 text-xs text-red-500 sm:text-sm">{errors.phone}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                className="px-3 py-3 pr-10 w-full text-sm bg-transparent rounded-lg border border-gray-200 transition-colors duration-300 outline-none sm:px-4 sm:py-3.5 sm:pr-12 sm:text-base peer focus:border-blue-500"
              />
              <span
                className={`absolute transition-all duration-300 pointer-events-none text-gray-400 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 text-sm sm:text-base ${
                  formData.password
                    ? '-top-2.5 sm:-top-3 left-2 scale-[0.85] sm:scale-[0.9] text-blue-500 bg-white px-1'
                    : 'top-3 sm:top-3.5 left-3 sm:left-4 peer-focus:-top-2.5 sm:peer-focus:-top-3 peer-focus:left-2 peer-focus:scale-[0.85] sm:peer-focus:scale-[0.9]'
                }`}
              >
                Password
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 text-gray-400 transition-colors transform -translate-y-1/2 sm:right-3 hover:text-gray-600"
              >
                {showPassword ? (
                  // Eye slash icon (hide password)
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="sm:w-5 sm:h-5"
                  >
                    <path
                      d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m2 2 20 20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  // Eye icon (show password)
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="sm:w-5 sm:h-5"
                  >
                    <path
                      d="M1 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              {errors.password && (
                <span className="mt-1 text-xs text-red-500 sm:text-sm">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className="px-3 py-3 pr-10 w-full text-sm bg-transparent rounded-lg border border-gray-200 transition-colors duration-300 outline-none sm:px-4 sm:py-3.5 sm:pr-12 sm:text-base peer focus:border-blue-500"
              />
              <span
                className={`absolute transition-all duration-300 pointer-events-none text-gray-400 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 text-sm sm:text-base ${
                  formData.confirmPassword
                    ? '-top-2.5 sm:-top-3 left-2 scale-[0.85] sm:scale-[0.9] text-blue-500 bg-white px-1'
                    : 'top-3 sm:top-3.5 left-3 sm:left-4 peer-focus:-top-2.5 sm:peer-focus:-top-3 peer-focus:left-2 peer-focus:scale-[0.85] sm:peer-focus:scale-[0.9]'
                }`}
              >
                Confirm Password
              </span>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 text-gray-400 transition-colors transform -translate-y-1/2 sm:right-3 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  // Eye slash icon (hide password)
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="sm:w-5 sm:h-5"
                  >
                    <path
                      d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m2 2 20 20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  // Eye icon (show password)
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="sm:w-5 sm:h-5"
                  >
                    <path
                      d="M1 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              {errors.confirmPassword && (
                <span className="mt-1 text-xs text-red-500 sm:text-sm">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className="py-3 mt-6 w-full text-sm font-semibold text-white bg-blue-500 rounded-lg transition-colors duration-200 sm:py-3.5 sm:text-base hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading || authLoading ? 'Creating Account...' : 'Sign up'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5 sm:my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-xs text-gray-500 sm:px-4 sm:text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignUp}
            className="flex justify-center items-center py-3 w-full text-sm font-semibold text-gray-700 bg-white rounded-lg border border-gray-300 transition-colors duration-200 sm:py-3.5 sm:text-base hover:bg-gray-50"
          >
            <svg className="mr-2 w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Sign In Link */}
          <div className="mt-6 text-center sm:mt-8">
            <span className="text-sm text-gray-600 sm:text-base">Already have an account? </span>
            <button
              onClick={handleSignInRedirect}
              className="text-sm font-semibold text-blue-500 sm:text-base hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden justify-center items-center p-6 lg:flex lg:w-1/2 xl:p-8">
        <div className="w-full max-w-[700px] xl:max-w-[825px] h-full max-h-[900px] xl:max-h-[1000px] rounded-2xl xl:rounded-3xl overflow-hidden">
          <img
            src="/images/img_container.png"
            alt="Children playing together in nature - DonaTrust community"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
