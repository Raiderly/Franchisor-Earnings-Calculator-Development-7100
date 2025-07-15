import React, { useState } from 'react';
import { FiSave, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../../lib/supabase';

const SaveScenarioModal = ({ isOpen, onClose, inputs, toggles, projections }) => {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(null); // null, success, error
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setStatus({ type: 'error', message: 'Please enter a title for your scenario' });
      return;
    }
    
    setIsSaving(true);
    setStatus(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to save a scenario');
      }
      
      const { error } = await supabase
        .from('scenarios')
        .insert({
          auth_id: user.id,
          title: title.trim(),
          data: { inputs, toggles, projections },
        });
      
      if (error) throw error;
      
      setStatus({ type: 'success', message: 'Scenario saved successfully!' });
      
      // Reset form and close modal after success
      setTimeout(() => {
        setTitle('');
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving scenario:', error);
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to save scenario. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="relative p-6">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            disabled={isSaving}
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-6">
            <div className="mx-auto bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <SafeIcon icon={FiSave} className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Save Scenario</h2>
            <p className="text-gray-600 mt-2">
              Save your current calculator settings for future reference
            </p>
          </div>
          
          {status && (
            <div className={`mb-4 p-3 rounded-lg flex items-center ${
              status.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <SafeIcon 
                icon={status.type === 'success' ? FiCheck : FiAlertCircle} 
                className="w-5 h-5 mr-2 flex-shrink-0" 
              />
              <p>{status.message}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Scenario Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="e.g., Base Case Scenario"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSaving || status?.type === 'success'}
              />
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center"
              disabled={isSaving || status?.type === 'success'}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                  </span>
                  Saving...
                </>
              ) : status?.type === 'success' ? (
                <>
                  <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                  Saved Successfully
                </>
              ) : (
                'Save Scenario'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaveScenarioModal;