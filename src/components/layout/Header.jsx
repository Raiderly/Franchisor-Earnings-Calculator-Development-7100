import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUser, FiLogOut } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/">
              <img 
                src="https://app1.sharemyimage.com/2025/07/07/AFI-Logo.png"
                alt="Accurate Franchising Inc."
                className="h-8 w-auto"
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Calculator
            </Link>
            {user && (
              <Link 
                to="/saved" 
                className="text-sm font-medium text-gray-700 hover:text-primary"
              >
                Saved Scenarios
              </Link>
            )}
          </nav>
          
          <div className="flex items-center">
            {user ? (
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-sm text-gray-700 mr-4">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-primary"
                >
                  <SafeIcon icon={FiLogOut} className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </motion.div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-sm font-medium text-gray-700 hover:text-primary"
              >
                <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;