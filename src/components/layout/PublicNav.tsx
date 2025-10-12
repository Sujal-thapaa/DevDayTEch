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
      <div className="bg-[#E9A23B] text-gray-900 py-2 px-6 text-sm font-medium text-center">
        Public Safety Portal - Information is provided for transparency and community awareness
      </div>
      <nav className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#174B7A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CO₂</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CO₂Track LA</h1>
              <p className="text-xs text-gray-600">Public Portal</p>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-[#174B7A] border-b-2 border-[#174B7A] pb-1'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            {onBack && (
              <button
                onClick={onBack}
                className="ml-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#174B7A] hover:bg-[#0f3350] rounded-lg transition-colors"
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
