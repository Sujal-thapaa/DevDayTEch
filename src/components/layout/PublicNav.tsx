import React from 'react';
import { LogOut } from 'lucide-react';
import { PublicPage } from '../../types';

interface PublicNavProps {
  currentPage: PublicPage;
  onNavigate: (page: PublicPage) => void;
  onBack?: () => void;
}

export const PublicNav: React.FC<PublicNavProps> = ({ currentPage, onNavigate, onBack }) => {
  const navItems: { id: PublicPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Industry' },
    { id: 'economy', label: 'Economic Impact' },
    { id: 'alerts', label: 'Safety Alerts' },
    { id: 'bridge', label: 'University Bridge' },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-6 text-sm font-medium text-center">
        Louisiana Carbon Capture Transparency Portal - Real-time data for community awareness
      </div>
      <nav className="bg-white border-b border-green-200 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/image/CarbonHorizon.png" 
              alt="CarbonHorizon" 
              className="h-16 w-auto"
            />
            <div className="border-l border-green-300 pl-4">
              <p className="text-sm text-green-700 font-semibold">Public Portal</p>
              <p className="text-xs text-green-600">Community Access</p>
            </div>
          </div>
          <div className="flex gap-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'text-green-600 border-b-2 border-green-600 pb-1 font-semibold'
                    : 'text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-300 pb-1'
                }`}
              >
                {item.label}
              </button>
            ))}
            {onBack && (
              <button
                onClick={onBack}
                className="ml-6 flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <LogOut size={16} />
                Back to Entry
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
