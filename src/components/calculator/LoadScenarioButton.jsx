import React, { useState } from 'react';
import { FiFolder, FiDownload } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoadScenarioButton = () => {
  const { session } = useAuth();
  
  if (!session) {
    return (
      <Link 
        to="/login" 
        className="btn-outline flex items-center"
      >
        <SafeIcon icon={FiFolder} className="mr-2" />
        Sign In to Load Scenarios
      </Link>
    );
  }
  
  return (
    <Link 
      to="/saved" 
      className="btn-outline flex items-center"
    >
      <SafeIcon icon={FiFolder} className="mr-2" />
      Load Saved Scenario
    </Link>
  );
};

export default LoadScenarioButton;