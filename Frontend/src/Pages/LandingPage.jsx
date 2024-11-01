import React from 'react'
import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="relative group">
        {/* Gradient border effect on hover */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
        
        <button 
          className="relative px-8 py-4 bg-[#6772E5] text-white border border-[#6772E5] hover:bg-white hover:text-[#6772E5] rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-xl"
          onClick={() => navigate('/credit-selection')}
        >
          <CreditCard className="w-5 h-5 text-white group-hover:text-[#6772E5] transition-colors duration-300" />
          <span className="font-medium text-white group-hover:text-[#6772E5] transition-colors duration-300">
            Purchase Credits with Stripe
          </span>
          
          {/* Subtle shine effect */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default LandingPage