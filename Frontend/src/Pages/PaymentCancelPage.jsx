import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa'; // Import an icon for attention
import { Link } from 'react-router-dom'; // Correct import statement for Link component

const PaymentCancelPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-200 to-red-400">
      <div className="bg-white rounded-lg shadow-xl p-10 max-w-md text-center transform transition-all duration-300 hover:scale-105">
        <FaExclamationTriangle className="text-6xl text-red-600 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-700 mb-6">
          We're sorry, but your payment could not be processed. Please try again, or contact support if the issue persists.
        </p>
        <div className="flex justify-center">
          <Link
            to="/" 
            className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition duration-200 shadow-md transform hover:scale-105"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;