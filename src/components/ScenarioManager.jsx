import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCalculator } from '../context/CalculatorContext';
import { supabase } from '../lib/supabase';

const ScenarioManager = () => {
  const { user } = useAuth();
  const { inputs, updateMultipleInputs } = useCalculator();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadScenarios();
    }
  }, [user]);

  const loadScenarios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScenarios(data || []);
    } catch (error) {
      console.error('Error loading scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveScenario = async () => {
    if (!scenarioName.trim()) return;

    setSaveLoading(true);
    try {
      const { error } = await supabase
        .from('scenarios')
        .insert({
          user_id: user.id,
          name: scenarioName.trim(),
          inputs: inputs
        });

      if (error) throw error;

      setScenarioName('');
      setShowSaveModal(false);
      loadScenarios();
    } catch (error) {
      console.error('Error saving scenario:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const loadScenario = (scenario) => {
    updateMultipleInputs(scenario.inputs);
  };

  const deleteScenario = async (id) => {
    if (!confirm('Are you sure you want to delete this scenario?')) return;

    try {
      const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadScenarios();
    } catch (error) {
      console.error('Error deleting scenario:', error);
    }
  };

  if (!user) {
    return (
      <div className="afi-card">
        <div className="afi-card-body text-center py-8">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-afi-text mb-2">
            Sign In Required
          </h3>
          <p className="text-afi-text-light">
            Sign in to save and manage your calculation scenarios
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="afi-card">
      <div className="afi-card-header">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Saved Scenarios</h3>
          <button
            onClick={() => setShowSaveModal(true)}
            className="afi-btn text-sm"
          >
            Save Current
          </button>
        </div>
      </div>

      <div className="afi-card-body">
        {loading ? (
          <div className="text-center py-4">
            <div className="loading-spinner mx-auto mb-2"></div>
            <p className="text-afi-text-light">Loading scenarios...</p>
          </div>
        ) : scenarios.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-afi-text-light">No saved scenarios yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-afi-text">{scenario.name}</div>
                  <div className="text-sm text-afi-text-light">
                    {new Date(scenario.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => loadScenario(scenario)}
                    className="afi-btn-outline text-sm px-3 py-1"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteScenario(scenario.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-afi-text mb-4">
                Save Scenario
              </h3>
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="Enter scenario name"
                className="afi-input w-full mb-4"
                onKeyPress={(e) => e.key === 'Enter' && saveScenario()}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="afi-btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={saveScenario}
                  disabled={saveLoading || !scenarioName.trim()}
                  className="afi-btn"
                >
                  {saveLoading ? (
                    <div className="loading-spinner mr-2"></div>
                  ) : null}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioManager;