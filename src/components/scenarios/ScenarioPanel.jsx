import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { supabase, saveScenario, getScenarios, deleteScenario } from '../../lib/supabase';
import { useCalculator } from '../../context/CalculatorContext';
import { motion, AnimatePresence } from 'framer-motion';

const ScenarioPanel = () => {
  const { inputs, updateMultipleFields } = useCalculator();
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) loadScenarios();
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadScenarios();
      else setScenarios([]);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const loadScenarios = async () => {
    setIsLoading(true);
    const data = await getScenarios();
    setScenarios(data);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!newScenarioName.trim()) return;
    
    const success = await saveScenario(newScenarioName, inputs);
    if (success) {
      setShowSaveModal(false);
      setNewScenarioName('');
      loadScenarios();
    }
  };

  const handleLoad = (scenarioData) => {
    updateMultipleFields(scenarioData);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scenario?')) return;
    
    const success = await deleteScenario(id);
    if (success) loadScenarios();
  };

  if (!user) {
    return (
      <div className="afi-card p-6 text-center">
        <SafeIcon icon={FiIcons.FiLock} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Sign In to Save Scenarios</h3>
        <p className="text-gray-500 text-sm mb-4">
          Create an account or sign in to save and manage your scenarios
        </p>
      </div>
    );
  }

  return (
    <div className="afi-card">
      <div className="bg-afi-primary text-white p-5 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SafeIcon icon={FiIcons.FiSave} className="w-5 h-5 mr-2 text-afi-secondary" />
            <h2 className="text-xl font-semibold">Saved Scenarios</h2>
          </div>
          <button 
            onClick={() => setShowSaveModal(true)}
            className="afi-btn bg-afi-secondary"
          >
            <SafeIcon icon={FiIcons.FiPlus} className="w-5 h-5 mr-2" />
            Save Current
          </button>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-afi-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Loading scenarios...</p>
          </div>
        ) : scenarios.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon icon={FiIcons.FiInbox} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Saved Scenarios</h3>
            <p className="text-gray-500">Save your current scenario to access it later</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-afi-primary">{scenario.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(scenario.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLoad(scenario.data)}
                      className="p-2 text-afi-primary hover:bg-afi-primary hover:text-white rounded-lg transition-colors"
                      title="Load Scenario"
                    >
                      <SafeIcon icon={FiIcons.FiDownload} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(scenario.id)}
                      className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                      title="Delete Scenario"
                    >
                      <SafeIcon icon={FiIcons.FiTrash2} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-semibold text-afi-primary mb-4">Save Scenario</h3>
              <input
                type="text"
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                placeholder="Enter scenario name"
                className="afi-input w-full mb-4"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="afi-btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!newScenarioName.trim()}
                  className="afi-btn"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScenarioPanel;