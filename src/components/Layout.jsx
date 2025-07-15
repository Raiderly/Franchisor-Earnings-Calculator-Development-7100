import React from 'react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-afi-background">
      {/* Header */}
      <header className="fixed-header bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="https://app1.sharemyimage.com/2025/07/07/AFI-Logo.png" 
                alt="Accurate Franchising Inc." 
                className="h-10 w-auto"
              />
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-afi-text-light">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="afi-btn-outline text-sm"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-afi-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-afi-text-light">
            © {new Date().getFullYear()} Accurate Franchising Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;