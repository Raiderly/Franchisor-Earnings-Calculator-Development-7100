import React from "react";
import { CalculatorProvider } from "./context/CalculatorContext";
import Header from "./components/layout/Header";
import InputPanel from "./components/InputPanel";
import ResultsPanel from "./components/ResultsPanel";
import ExportPanel from "./components/ExportPanel";
import { motion } from "framer-motion";
import "./App.css";

const App = () => {
  return (
    <CalculatorProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Franchise Earnings Calculator
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Calculate comprehensive financial projections for your franchise business
              with detailed revenue streams and growth modeling.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Panel - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5"
            >
              <InputPanel />
            </motion.div>

            {/* Results Panel - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-7"
            >
              <div className="space-y-6">
                <ResultsPanel />
                <ExportPanel />
              </div>
            </motion.div>
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center text-sm text-slate-500"
          >
            <p className="max-w-4xl mx-auto">
              <strong>Disclaimer:</strong> These projections are estimates based on your inputs 
              and are for planning purposes only. Actual results may vary significantly based on 
              market conditions, location, management, and other factors.
            </p>
          </motion.div>
        </div>
      </div>
    </CalculatorProvider>
  );
};

export default App;