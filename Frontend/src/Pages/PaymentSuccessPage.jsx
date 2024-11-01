import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const location = useLocation();

  // Helper function to get query params
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get('amount');
  const credits = queryParams.get('credits');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Success Icon */}
        <div className="flex items-center justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Thank you for your purchase! Your transaction has been completed successfully.
        </p>

        {/* Transaction Details */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800">Transaction Details:</h3>
          <p className="text-gray-600">Amount: ₹{amount}</p>
          <p className="text-gray-600">Credits Purchased: {credits}</p>
          <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Call to Action Button */}
        <div className="text-center">
          <a 
            href="/" 
            className="inline-block w-full py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
