import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session, supabase } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    closeMenu();
  };
  
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  className="h-8 w-auto sm:h-10" 
                  src="/franchise-logo.png" 
                  alt="Franchise Calculator Logo" 
                />
                <span className="ml-3 text-xl font-semibold text-gray-900">
                  FranCalc
                </span>
              </Link>
            </div>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8 md:items-center">
            <Link 
              to="/" 
              className={`px-3 py-2 text-sm font-medium ${
                location.pathname === '/' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Calculator
            </Link>
            
            {session && (
              <Link 
                to="/saved" 
                className={`px-3 py-2 text-sm font-medium ${
                  location.pathname === '/saved' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Saved Scenarios
              </Link>
            )}
            
            <div className="ml-3 relative">
              {session ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 focus:outline-none"
                >
                  <span className="mr-2">{session.user.email}</span>
                  <SafeIcon icon={FiLogOut} className="h-5 w-5" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <SafeIcon icon={FiLogIn} className="h-5 w-5 mr-1" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <SafeIcon icon={FiX} className="block h-6 w-6" />
              ) : (
                <SafeIcon icon={FiMenu} className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/'
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={closeMenu}
            >
              Calculator
            </Link>
            
            {session && (
              <Link
                to="/saved"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === '/saved'
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={closeMenu}
              >
                Saved Scenarios
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {session ? (
              <div>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <SafeIcon icon={FiUser} className="h-10 w-10 bg-gray-100 rounded-full p-2" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 truncate max-w-[200px]">
                      {session.user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4">
                <Link
                  to="/login"
                  className="block text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-4 py-2"
                  onClick={closeMenu}
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;