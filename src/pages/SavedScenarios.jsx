import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiFolder, 
  FiDownload, 
  FiTrash2, 
  FiAlertCircle, 
  FiSearch 
} from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useCalculator } from '../context/CalculatorContext';
import { formatDate } from '../utils/formatters';
import supabase from '../lib/supabase';

const SavedScenarios = () => {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { loadScenario } = useCalculator();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchScenarios();
  }, []);
  
  const fetchScenarios = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setScenarios(data || []);
    } catch (err) {
      console.error('Error fetching scenarios:', err);
      setError('Failed to load your saved scenarios. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLoadScenario = (scenario) => {
    loadScenario(scenario);
    navigate('/');
  };
  
  const handleDeleteScenario = async (e, id) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this scenario?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the local state
      setScenarios(scenarios.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting scenario:', err);
      alert('Failed to delete scenario. Please try again.');
    }
  };
  
  const filteredScenarios = scenarios.filter(scenario => 
    scenario.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Saved Scenarios</h1>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-control pl-10"
            placeholder="Search saved scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading your saved scenarios...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <SafeIcon icon={FiAlertCircle} className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchScenarios}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : filteredScenarios.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <SafeIcon icon={FiFolder} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {searchQuery ? 'No matching scenarios found' : 'No saved scenarios yet'}
          </h2>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Try adjusting your search or clear the search field.'
              : 'Save your calculator configurations to access them later.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go to Calculator
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenarios.map(scenario => (
            <div
              key={scenario.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleLoadScenario(scenario)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <SafeIcon icon={FiFolder} className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 truncate max-w-[180px]">
                      {scenario.title}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => handleDeleteScenario(e, scenario.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Delete scenario"
                  >
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 mb-4">
                  Saved on {formatDate(new Date(scenario.created_at))}
                </div>
                
                {scenario.data?.inputs && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Units:</span>
                        <span className="font-medium">{scenario.data.inputs.units}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Royalty:</span>
                        <span className="font-medium">{scenario.data.inputs.royaltyRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growth:</span>
                        <span className="font-medium">{scenario.data.inputs.growthRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Years:</span>
                        <span className="font-medium">{scenario.data.inputs.projectionYears}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 text-center">
                  <button 
                    className="btn-primary w-full flex items-center justify-center"
                    onClick={() => handleLoadScenario(scenario)}
                  >
                    <SafeIcon icon={FiDownload} className="mr-2" />
                    Load Scenario
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedScenarios;