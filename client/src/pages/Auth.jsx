import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import axios from 'axios';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(118, 75, 162, 0.2) 0%, rgba(95, 65, 228, 0.2) 100%);
    backdrop-filter: blur(5px);
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const Alert = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 2rem;
  border-radius: 5px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  background: ${props => props.type === 'success' ? '#4CAF50' : '#f44336'};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.type === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  backdrop-filter: blur(5px);
`;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleLogin = async (formData) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/login/', formData);
      showAlert('Login successful!', 'success');
      
      // Store user data in localStorage
      const userData = {
        username: formData.username,
        email: formData.email || '',
        // Add any other user data you want to store
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      showAlert(error.response?.data?.message || 'Login failed. Please try again.', 'error');
    }
  };

  const handleRegister = (formData) => {
    console.log('Register data:', formData);
    // Add your register logic here
  };

  return (
    <AuthContainer>
      <AnimatePresence>
        {alert.show && (
          <Alert
            type={alert.type}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            {alert.message}
          </Alert>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Login
              onLogin={handleLogin}
              onSwitchToRegister={() => setIsLogin(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Register
              onRegister={handleRegister}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContainer>
  );
};

export default Auth; 