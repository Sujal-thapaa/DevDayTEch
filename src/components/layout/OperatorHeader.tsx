import React, { useState } from 'react';
import { Search, Plus, Bell, LogOut, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Input';

interface OperatorHeaderProps {
  onLogout?: () => void;
}

export const OperatorHeader: React.FC<OperatorHeaderProps> = ({ onLogout }) => {
  const [tenant, setTenant] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateReport = () => {
    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      // Trigger PDF download
      const link = document.createElement('a');
      link.href = '/image/CO₂ Operations & Compliance Report - Q4 2025.pdf';
      link.download = 'CO2_Operations_Compliance_Report_Q4_2025.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close modal after download starts
      setIsGenerating(false);
    }, 5000);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-green-200 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <Select
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            options={[
              { value: 'all', label: 'All Facilities' },
              { value: 'port-allen', label: 'Port Allen Ethanol' },
              { value: 'geismar', label: 'Geismar Ammonia' },
              { value: 'st-james', label: 'St. James Industrial' },
            ]}
            className="w-64"
          />

          <div className="flex-1 max-w-md relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search facilities, reports, incidents..."
              className="input w-full pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-green-50 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <button 
            onClick={handleCreateReport}
            className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            <Plus size={18} />
            Create Report
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </header>

      {/* AI Generation Modal */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="flex flex-col items-center text-center">
              {/* Animated Icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 rounded-full p-4">
                  <Sparkles className="w-12 h-12 text-white animate-pulse" />
                </div>
              </div>

              {/* Loading Spinner */}
              <Loader2 className="w-16 h-16 text-green-600 animate-spin mb-4" />

              {/* Text */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Generating Report</h3>
              <p className="text-gray-600 mb-6">
                Analyzing emissions data, compiling insights, and preparing your comprehensive report...
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full animate-progress"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-progress {
          animation: progress 5s ease-in-out;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
};
