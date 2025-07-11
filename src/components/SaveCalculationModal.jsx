import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import calculatorService from '../services/calculatorService';

const SaveCalculationModal = ({ isOpen, onClose, inputs, projections, toggles }) => {
  const [title, setTitle] = useState(`Franchise Calculation - ${new Date().toLocaleDateString()}`);
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);
    
    try {
      const result = await calculatorService.saveCalculation({
        title,
        description,
        inputs,
        projections,
        toggles
      });
      
      if (result.success) {
        setStatus({ type: 'success', message: 'Calculation saved successfully!' });
        
        // Close modal after success (with delay)
        setTimeout(() => {
          onClose();
          setStatus(null);
          setTitle(`Franchise Calculation - ${new Date().toLocaleDateString()}`);
          setDescription('');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to save calculation');
      }
    } catch (error) {
      console.error('Failed to save calculation:', error);
      setStatus({ 
        type: 'error', 
        message: 'Failed to save calculation. Please check your Supabase connection.' 
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl">
        <div className="relative p-6">
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 text-gray-600 hover:text-gray-900"
          >
            <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-6">
            <div className="mx-auto bg-[#1a2c43] bg-opacity-10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <SafeIcon icon={FiIcons.FiSave} className="w-8 h-8 text-[#1a2c43]" />
            </div>
            <h2 className="text-xl font-bold text-[#1a2c43]">Save Calculation</h2>
            <p className="text-gray-600 mt-2">
              Save your current calculator settings and results to access later
            </p>
          </div>
          
          {status && (
            <div className={`mb-4 p-3 rounded-lg ${
              status.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <div className="flex items-center">
                <SafeIcon 
                  icon={status.type === 'success' ? FiIcons.FiCheck : FiIcons.FiAlertCircle} 
                  className="w-5 h-5 mr-2" 
                />
                <p>{status.message}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="afi-input w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSaving || status?.type === 'success'}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows="3"
                className="afi-input w-full"
                placeholder="Add notes about this calculation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSaving || status?.type === 'success'}
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="afi-btn w-full flex items-center justify-center"
              disabled={isSaving || status?.type === 'success'}
            >
              {isSaving ? (
                <>
                  <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : status?.type === 'success' ? (
                <>
                  <SafeIcon icon={FiIcons.FiCheck} className="mr-2" />
                  Saved Successfully
                </>
              ) : (
                'Save Calculation'
              )}
            </button>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>
                Calculations are saved to your Supabase database and can be accessed from the "Saved Calculations" section.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaveCalculationModal;