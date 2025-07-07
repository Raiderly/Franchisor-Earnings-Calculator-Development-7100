import React from 'react';
import FranchisorCalculator from './components/FranchisorCalculator';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="afi-header py-3 px-6 shadow-md flex items-center">
        <img 
          src="https://app1.sharemyimage.com/2025/07/07/Accurate-Franchising-Logo-1.webp" 
          alt="Accurate Franchising Inc. Logo" 
          className="afi-logo"
        />
      </header>
      <FranchisorCalculator />
    </div>
  );
}

export default App;