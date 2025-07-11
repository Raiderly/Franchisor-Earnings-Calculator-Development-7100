import supabase from '../lib/supabase';

/**
 * Service for managing calculator data with Supabase
 */
const calculatorService = {
  /**
   * Save calculation to Supabase
   * @param {Object} data - Calculator data to save
   * @returns {Promise} - Supabase response
   */
  async saveCalculation(data) {
    try {
      // Check if Supabase is properly configured
      if (supabase.supabaseUrl.includes('<PROJECT-ID>')) {
        console.warn('Supabase not configured. Data not saved.');
        return { success: false, error: 'Supabase not configured' };
      }
      
      const { inputs, toggles, projections } = data;
      
      // Create a record to save
      const record = {
        title: data.title || `Calculation ${new Date().toLocaleString()}`,
        description: data.description || '',
        inputs: inputs,
        toggles: toggles,
        projections: projections,
        created_at: new Date().toISOString()
      };
      
      // Insert into Supabase
      const { data: savedData, error } = await supabase
        .from('calculator_saves_abc123')
        .insert(record)
        .select();
      
      if (error) throw error;
      
      return { success: true, data: savedData };
    } catch (error) {
      console.error('Error saving calculation:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Fetch saved calculations from Supabase
   * @returns {Promise} - Saved calculations
   */
  async getSavedCalculations() {
    try {
      // Check if Supabase is properly configured
      if (supabase.supabaseUrl.includes('<PROJECT-ID>')) {
        console.warn('Supabase not configured. Cannot fetch data.');
        return { success: false, error: 'Supabase not configured' };
      }
      
      const { data, error } = await supabase
        .from('calculator_saves_abc123')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching calculations:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Delete a saved calculation
   * @param {string} id - ID of calculation to delete
   * @returns {Promise} - Supabase response
   */
  async deleteCalculation(id) {
    try {
      // Check if Supabase is properly configured
      if (supabase.supabaseUrl.includes('<PROJECT-ID>')) {
        console.warn('Supabase not configured. Cannot delete data.');
        return { success: false, error: 'Supabase not configured' };
      }
      
      const { error } = await supabase
        .from('calculator_saves_abc123')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting calculation:', error);
      return { success: false, error: error.message };
    }
  }
};

export default calculatorService;