import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface OperatorAuthPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export const OperatorAuthPage: React.FC<OperatorAuthPageProps> = ({ onLogin, onBack }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No real validation - just redirect to operator dashboard
    onLogin();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
      style={{ backgroundImage: 'url(/image/bg.jpg)' }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-white hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-3 py-2"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        {/* Form Container */}
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <img 
                src="/image/CarbonHorizon.png" 
                alt="CarbonHorizon" 
                className="h-20 w-auto"
              />
            </div>
            <p className="text-white/90 text-lg">
              {isSignup ? 'Create Operator Account' : 'Operator Login'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <>
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 transition-all rounded-t-lg"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="block text-white font-medium mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 transition-all rounded-t-lg"
                    placeholder="Enter your organization"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 transition-all rounded-t-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border-b-2 border-white/50 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 transition-all rounded-t-lg"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 text-lg font-bold text-white bg-white/15 backdrop-blur-sm rounded-xl border-2 border-white/30 hover:bg-white hover:text-[#174B7A] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 mt-6"
            >
              {isSignup ? 'Create Account' : 'Login'}
            </button>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-white hover:text-white/80 transition-colors focus:outline-none focus:underline"
            >
              {isSignup ? (
                <>Already have an account? <span className="font-bold">Login</span></>
              ) : (
                <>Don't have an account? <span className="font-bold">Sign up</span></>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/70">
          Louisiana Carbon Capture Transparency Portal
        </p>
      </div>
    </div>
  );
};

