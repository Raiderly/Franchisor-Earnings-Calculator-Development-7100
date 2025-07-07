import React, { useState } from 'react';
import Modal from 'react-modal';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { exportToPdf } from '../../utils/pdfExport';

const { FiMail, FiX, FiCheck, FiAlertCircle } = FiIcons;

// Bind modal to app element for accessibility
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

const EmailModal = ({ isOpen, onClose, inputs, projections, toggles }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    
    setIsSubmitting(true);
    setStatus(null);
    
    try {
      // First generate the PDF
      console.log('Generating PDF for email delivery...');
      const pdfBlob = await exportToPdf(inputs, projections, toggles, true);
      console.log('PDF generated successfully for email');
      
      // In a real implementation, this would send the email with the PDF
      // Simulate API call to send email with the PDF
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log email delivery attempt (in a real system, this would be an API call)
      console.log(`Email delivery requested for: ${email}`);
      console.log(`PDF attachment size: ${Math.round(pdfBlob.size / 1024)}KB`);
      
      setStatus({ 
        type: 'success', 
        message: 'Your report has been sent to ' + email
      });
      
      // Reset form
      setEmail('');
      
      // Close modal after success (with delay)
      setTimeout(() => {
        onClose();
        setStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setStatus({ 
        type: 'error', 
        message: 'We encountered an error sending your report. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Email Report"
      className="afi-modal"
      overlayClassName="afi-modal-overlay"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
          border: 'none',
          background: 'white',
          borderRadius: '10px',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }
      }}
    >
      <div className="relative">
        <button 
          onClick={onClose}
          className="absolute right-0 top-0 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          <SafeIcon icon={FiX} className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="mx-auto bg-[#1a2c43] bg-opacity-10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <SafeIcon icon={FiMail} className="w-8 h-8 text-[#1a2c43]" />
          </div>
          <h2 className="text-xl font-bold text-[#1a2c43]">Email Your Report</h2>
          <p className="text-gray-600 mt-2">
            We'll send your franchise earnings report to your email address
          </p>
        </div>
        
        {status && (
          <div className={`mb-4 p-3 rounded-lg ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex items-center">
              <SafeIcon 
                icon={status.type === 'success' ? FiCheck : FiAlertCircle} 
                className="w-5 h-5 mr-2"
              />
              <p>{status.message}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="afi-input w-full"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting || status?.type === 'success'}
            />
          </div>
          
          <button
            type="submit"
            className="afi-btn w-full flex items-center justify-center"
            disabled={isSubmitting || status?.type === 'success'}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Sending...
              </>
            ) : status?.type === 'success' ? (
              <>
                <SafeIcon icon={FiCheck} className="mr-2" />
                Sent Successfully
              </>
            ) : (
              'Send Report to My Email'
            )}
          </button>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            We'll only use your email to deliver this report and will not store it for marketing purposes.
          </p>
          
          <div className="mt-4 text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700 mb-1">Email will include:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Comprehensive PDF report with all projections</li>
              <li>Subject: "Your Franchisor Earnings Report – Accurate Franchising Inc."</li>
              <li>Contact information for the Accurate Franchising team</li>
            </ul>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EmailModal;