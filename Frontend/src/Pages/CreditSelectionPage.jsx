// Frontend: CreditSelectionPage.jsx
import React from 'react';
import { CreditCard, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PK}`);

function getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  
  const CreditSelectionPage = () => {
      const [credits, setCredits] = useState(1);
      const [isLoading, setIsLoading] = useState(false);
      const pricePerCredit = 150;
    
      const incrementCredits = () => {
        setCredits(prev => prev + 1);
      };
    
      const decrementCredits = () => {
        if (credits > 1) {
          setCredits(prev => prev - 1);
        }
      };
  
      const handleInputChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
          const numValue = value === '' ? 1 : parseInt(value);
          setCredits(Math.max(1, numValue));
        }
      };
  
      const handleBlur = () => {
        if (!credits || credits < 1) {
          setCredits(1);
        }
      };
  
      const handleCheckout = async () => {
        try {
          setIsLoading(true);
      
          // Get Stripe instance
          const stripe = await stripePromise;
          if (!stripe) throw new Error('Stripe failed to initialize');
      
          // Create checkout session using Django backend
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session/`, {
            credits,  // The credits field
            price_per_credit: pricePerCredit,  // The price_per_credit field
            currency: 'inr',  // The currency field
          }, {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCsrfToken(),
            },
            withCredentials: true,  // Important for sending cookies
          });
      
          const data = response.data; 
      
          if (!data.session_id) {
            throw new Error('Failed to create checkout session');
          }
      
          // Redirect to Stripe Checkout
          const result = await stripe.redirectToCheckout({
            sessionId: data.session_id,
          });
          console.log('result', result);
          if (result.error) {
            throw new Error(result.error.message);
          }
        } catch (error) {
          console.error('Checkout error:', error);
          // You might want to show an error notification here
        } finally {
          setIsLoading(false);
        }
      };
      
  
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Purchase Credits</h2>
            <p className="text-gray-500 mt-2">1 Credit = ₹150</p>
          </div>

          {/* Credit Selection */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Amount of Credits</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={decrementCredits}
                  disabled={isLoading}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-[#6772E5] hover:text-[#6772E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <input
                  type="text"
                  value={credits}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className="font-semibold text-lg w-20 text-center bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#6772E5] focus:ring-1 focus:ring-[#6772E5] disabled:opacity-50"
                  placeholder="1"
                />

                <button 
                  onClick={incrementCredits}
                  disabled={isLoading}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-[#6772E5] hover:text-[#6772E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Price Calculation */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Price per credit</span>
                <span>₹{pricePerCredit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Number of credits</span>
                <span>× {credits.toLocaleString()}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>₹{(credits * pricePerCredit).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
            
            <button 
              className="relative w-full px-8 py-4 bg-[#6772E5] text-white border border-[#6772E5] hover:bg-white hover:text-[#6772E5] rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              <CreditCard className="w-5 h-5 text-white group-hover:text-[#6772E5] transition-colors duration-300" />
              <span className="font-medium text-white group-hover:text-[#6772E5] transition-colors duration-300">
                {isLoading ? 'Processing...' : `Pay ₹${(credits * pricePerCredit).toLocaleString()}`}
              </span>
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Secure payment processing
          </div>
        </div>
      </div>
    );
}

export default CreditSelectionPage;