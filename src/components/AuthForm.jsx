import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setSuccess('Account created successfully! Please check your email to verify your account.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-afi-background px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="https://app1.sharemyimage.com/2025/07/07/AFI-Logo.png" 
            alt="Accurate Franchising Inc." 
            className="h-16 w-auto mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-afi-text">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-afi-text-light mt-2">
            {isLogin 
              ? 'Access your franchise calculator' 
              : 'Get started with your franchise projections'
            }
          </p>
        </div>

        <div className="afi-card">
          <div className="afi-card-body">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-afi-text mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="afi-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-afi-text mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="afi-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="afi-btn w-full"
              >
                {loading ? (
                  <div className="loading-spinner mr-2"></div>
                ) : null}
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-afi-primary hover:text-afi-primary font-medium"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;