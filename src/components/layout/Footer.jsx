import React from 'react';
import { FiHeart, FiMail, FiGlobe } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                className="h-8 w-auto" 
                src="/franchise-logo.png" 
                alt="FranCalc Logo" 
              />
              <span className="ml-3 text-xl font-semibold">FranCalc</span>
            </div>
            <p className="text-gray-300 text-sm">
              Professional franchise financial calculator for business owners and entrepreneurs looking to expand through franchising.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Franchise Guide
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Financial Models
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-300">
                <SafeIcon icon={FiMail} className="h-4 w-4 mr-2 text-blue-400" />
                <a href="mailto:info@francalc.com" className="hover:text-white transition-colors">
                  info@francalc.com
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <SafeIcon icon={FiGlobe} className="h-4 w-4 mr-2 text-blue-400" />
                <a href="https://francalc.com" className="hover:text-white transition-colors">
                  www.francalc.com
                </a>
              </div>
            </div>
            
            <div className="pt-4">
              <a 
                href="#" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Support
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} FranCalc. All rights reserved.
          </p>
          <p className="mt-4 sm:mt-0 text-gray-400 text-sm flex items-center">
            Made with <SafeIcon icon={FiHeart} className="text-red-500 mx-1" /> by Franchise Experts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;