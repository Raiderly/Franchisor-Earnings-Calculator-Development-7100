import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('sign_in');
  
  const handleAuthChange = (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      navigate('/');
    }
  };
  
  return (
    <div className="page-container max-w-md mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {authMode === 'sign_in' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-600">
          {authMode === 'sign_in' 
            ? 'Sign in to access your saved scenarios'
            : 'Sign up to save and manage your franchise scenarios'
          }
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card shadow-lg"
      >
        <div className="p-6">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3b82f6',
                    brandAccent: '#2563eb',
                  },
                },
              },
            }}
            providers={[]}
            view={authMode}
            onlyThirdPartyProviders={false}
            redirectTo={window.location.origin}
          />
          
          <div className="mt-6 text-center text-sm">
            {authMode === 'sign_in' ? (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => setAuthMode('sign_up')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => setAuthMode('sign_in')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;