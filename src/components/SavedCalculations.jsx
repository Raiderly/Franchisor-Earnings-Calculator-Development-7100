import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import calculatorService from '../services/calculatorService';

const SavedCalculations = ({ onLoad, isSupabaseConnected }) => {
  const [calculations, setCalculations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isSupabaseConnected) {
      fetchCalculations();
    }
  }, [isSupabaseConnected]);
  
  const fetchCalculations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await calculatorService.getSavedCalculations();
      
      if (result.success) {
        setCalculations(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch saved calculations');
      }
    } catch (err) {
      console.error('Error fetching calculations:', err);
      setError('Failed to load saved calculations. Please check your Supabase connection.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this saved calculation?')) {
      return;
    }
    
    try {
      const result = await calculatorService.deleteCalculation(id);
      
      if (result.success) {
        setCalculations(calculations.filter(calc => calc.id !== id));
      } else {
        throw new Error(result.error || 'Failed to delete calculation');
      }
    } catch (err) {
      console.error('Error deleting calculation:', err);
      alert('Failed to delete calculation. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!isSupabaseConnected) {
    return (
      <div className="afi-card p-5">
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiIcons.FiFolder} className="w-5 h-5 mr-2 text-[#1a2c43]" />
          <h2 className="text-xl font-bold text-[#1a2c43]">Saved Calculations</h2>
        </div>
        
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <SafeIcon icon={FiIcons.FiDatabase} className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 mb-2">Connect to Supabase to access saved calculations</p>
          <p className="text-sm text-gray-400">
            Configure your Supabase connection in the settings panel
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="afi-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <SafeIcon icon={FiIcons.FiFolder} className="w-5 h-5 mr-2 text-[#1a2c43]" />
          <h2 className="text-xl font-bold text-[#1a2c43]">Saved Calculations</h2>
        </div>
        
        <button 
          onClick={fetchCalculations}
          className="text-[#1a2c43] hover:text-[#c0392b] p-2"
          title="Refresh"
        >
          <SafeIcon icon={FiIcons.FiRefreshCw} className="w-5 h-5" />
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <span className="inline-block w-6 h-6 border-2 border-[#1a2c43] border-t-transparent rounded-full animate-spin mr-2"></span>
          <span className="text-gray-600">Loading saved calculations...</span>
        </div>
      ) : error ? (
        <div className="text-center py-6 text-[#c0392b]">
          <SafeIcon icon={FiIcons.FiAlertCircle} className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      ) : calculations.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <SafeIcon icon={FiIcons.FiFileText} className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 mb-2">No saved calculations yet</p>
          <p className="text-sm text-gray-400">
            Use the "Save" button to store your calculations
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {calculations.map((calc) => (
            <div 
              key={calc.id}
              onClick={() => onLoad(calc)}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[#1a2c43]">{calc.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Saved on {formatDate(calc.created_at)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(calc.id, e)}
                  className="text-gray-400 hover:text-[#c0392b] p-1"
                  title="Delete"
                >
                  <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4" />
                </button>
              </div>
              
              {calc.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{calc.description}</p>
              )}
              
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <span className="flex items-center mr-4">
                  <SafeIcon icon={FiIcons.FiUsers} className="w-3 h-3 mr-1" />
                  {calc.inputs.units} units
                </span>
                <span className="flex items-center">
                  <SafeIcon icon={FiIcons.FiDollarSign} className="w-3 h-3 mr-1" />
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(calc.projections[0]?.grossRevenue || 0)} revenue
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCalculations;