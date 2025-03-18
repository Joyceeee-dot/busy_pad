import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Aurora from "../components/Aurora";
import '../css/Register.css';
import { userApi, tokenService } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    deviceCode: '',
    name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.deviceCode) {
      newErrors.deviceCode = 'Device code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        setErrors({});
        
        // Call register API
        await userApi.signup(
          formData.email.trim(),
          formData.password,
          formData.name.trim(),
          formData.deviceCode.trim()
        );

        try {
          // After successful signup, login the user
          const loginResponse = await userApi.login(formData.email.trim(), formData.password);
          
          // Store the token
          tokenService.setToken(loginResponse.access_token);
          
          // Get user profile
          const userProfile = await userApi.getProfile(loginResponse.access_token);
          
          // Initialize user data
          const userData = {
            ...userProfile,
            allowList: userProfile.allowList || []
          };

          // Save user data
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userData", JSON.stringify(userData));
          
          // Navigate to home page
          navigate("/home");
        } catch (loginError) {
          console.error('Login error after registration:', loginError);
          setErrors({
            submit: { 
              type: 'success',
              message: 'Registration successful! Redirecting to login page...'
            }
          });
          // Redirect to login page after a short delay
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({
          submit: {
            type: 'error',
            message: error.message || 'Registration failed. Please try again.'
          }
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Aurora 
        colorStops={["#000000", "#6A3093", "#A044FF", "#0F2027"]}
        blend={0.4}
        amplitude={0.8}
        speed={0.6}
      />
      <div className="register-container">
        <div className="register-box">
          <h2 className="register-title">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="register-input"
                disabled={loading}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="register-input"
                disabled={loading}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="register-input"
                disabled={loading}
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="register-input"
                disabled={loading}
              />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="deviceCode"
                placeholder="Device Code"
                value={formData.deviceCode}
                onChange={handleChange}
                className="register-input"
                disabled={loading}
              />
              {errors.deviceCode && <p className="error-text">{errors.deviceCode}</p>}
            </div>

            {errors.submit && (
              <p className={errors.submit.type === 'success' ? 'success-text' : 'error-text'}>
                {errors.submit.message}
              </p>
            )}

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "Creating Account..." : "Register"}
            </button>

            <p className="register-link">
              Already have an account?{' '}
              <span className="register-login-link" onClick={() => navigate('/login')}>
                Log In
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;