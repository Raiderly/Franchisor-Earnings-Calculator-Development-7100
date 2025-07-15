import React, { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabase'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'

const AuthModal = ({ isOpen, onClose, setUser }) => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        onClose();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [onClose, setUser]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-afi-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiIcons.FiUser} className="w-8 h-8 text-afi-primary" />
            </div>
            <h2 className="text-2xl font-bold text-afi-primary">Sign In</h2>
            <p className="text-gray-600 mt-2">
              Sign in to save and manage your scenarios
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#262262',
                    brandAccent: '#caa74d',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  )
}

export default AuthModal