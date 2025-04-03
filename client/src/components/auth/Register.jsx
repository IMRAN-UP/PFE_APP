import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { setAuthTokens, setUserData } from '../../utils/auth';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    gender: '',
    birthday: '',
    phone_number: '',
    profile_image: null
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setErrors({});
    setSuccess('');
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    // Birthday validation
    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthday = 'Birthday cannot be in the future';
      }
    }

    // Phone number validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profile_image: 'Please upload an image file'
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profile_image: 'Image size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        profile_image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous image errors
      if (errors.profile_image) {
        setErrors(prev => ({
          ...prev,
          profile_image: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccess('');

    try {
      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post('/users/register/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.tokens) {
        setAuthTokens(response.data.tokens);
        setUserData(response.data.user);
        setSuccess('Registration successful! Redirecting...');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || 'An error occurred during registration. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="card max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Smart Wardrobe today
          </p>
        </div>
        
        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center">
              <div className="mb-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center">
                <label className="btn-primary cursor-pointer flex items-center">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Upload Photo
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
              {errors.profile_image && (
                <p className="mt-1 text-sm text-red-600">{errors.profile_image}</p>
              )}
            </div>

            {/* First row: First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="form-label">First Name</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter your first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
              </div>
              <div>
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter your last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
              </div>
            </div>
            
            {/* Second row: Email */}
            <div>
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            {/* Third row: Gender */}
            <div>
              <label className="form-label">Gender</label>
              <div className="flex space-x-4 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    checked={formData.gender === 'M'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-primary"
                    disabled={isLoading}
                  />
                  <span className="ml-2">Men</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    checked={formData.gender === 'F'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-primary"
                    disabled={isLoading}
                  />
                  <span className="ml-2">Women</span>
                </label>
              </div>
              {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
            </div>
            
            {/* Fourth row: Birthday and Phone Number */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="birthday" className="form-label">Birthday</label>
                <input
                  id="birthday"
                  name="birthday"
                  type="date"
                  required
                  className="input-field"
                  value={formData.birthday}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.birthday && <p className="mt-1 text-sm text-red-600">{errors.birthday}</p>}
              </div>
              <div>
                <label htmlFor="phone_number" className="form-label">Phone Number</label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  required
                  className="input-field"
                  placeholder="+1 (555) 555-5555"
                  value={formData.phone_number}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
              </div>
            </div>
            
            {/* Fifth row: Password and Confirm Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Confirm your password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.confirm_password && <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`btn-primary w-full flex justify-center items-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-colors duration-200">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 