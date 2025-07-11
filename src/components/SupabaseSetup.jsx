import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const SupabaseSetup = ({ onConnect }) => {
  const [projectUrl, setProjectUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  
  const handleConnect = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    setError('');
    
    try {
      // Validate inputs
      if (!projectUrl || !anonKey) {
        throw new Error('Please provide both Project URL and Anonymous Key');
      }
      
      // Extract project ID from URL
      let projectId = '';
      try {
        const url = new URL(projectUrl);
        projectId = url.hostname.split('.')[0];
      } catch (e) {
        throw new Error('Invalid Project URL format. Should be https://your-project-id.supabase.co');
      }
      
      // Call onConnect with credentials
      await onConnect({
        projectUrl,
        projectId,
        anonKey
      });
      
      setIsConnecting(false);
    } catch (err) {
      setError(err.message);
      setIsConnecting(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto bg-[#1a2c43] bg-opacity-10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
          <SafeIcon icon={FiIcons.FiDatabase} className="w-8 h-8 text-[#1a2c43]" />
        </div>
        <h2 className="text-xl font-bold text-[#1a2c43]">Connect to Supabase</h2>
        <p className="text-gray-600 mt-2">
          To save your calculations, connect to your Supabase project
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
          <div className="flex items-center">
            <SafeIcon icon={FiIcons.FiAlertCircle} className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleConnect}>
        <div className="mb-4">
          <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Project URL
          </label>
          <input
            type="text"
            id="projectUrl"
            className="afi-input w-full"
            placeholder="https://your-project-id.supabase.co"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Find this in your Supabase project settings
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="anonKey" className="block text-sm font-medium text-gray-700 mb-1">
            Anonymous/Public Key
          </label>
          <input
            type="text"
            id="anonKey"
            className="afi-input w-full"
            placeholder="eyJhbGciOiJIUzI1NiIsInR..."
            value={anonKey}
            onChange={(e) => setAnonKey(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This is your project's anon/public key, not the service_role key
          </p>
        </div>
        
        <button
          type="submit"
          className="afi-btn w-full flex items-center justify-center"
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Connecting...
            </>
          ) : (
            <>
              <SafeIcon icon={FiIcons.FiLink} className="mr-2" />
              Connect to Supabase
            </>
          )}
        </button>
        
        <div className="mt-4 text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-700 mb-1">How to find your credentials:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Go to your Supabase project dashboard</li>
            <li>Click on the "Settings" icon (gear) in the sidebar</li>
            <li>Select "API" from the settings menu</li>
            <li>Copy the URL and anon/public key</li>
          </ol>
        </div>
      </form>
    </div>
  );
};

export default SupabaseSetup;