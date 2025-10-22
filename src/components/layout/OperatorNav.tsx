import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Database,
  Settings,
  Route,
} from 'lucide-react';
import { OperatorPage } from '../../types';

interface OperatorNavProps {
  currentPage: OperatorPage;
  onNavigate: (page: OperatorPage) => void;
}

const navItems = [
  { id: 'data-entry' as OperatorPage, label: 'Data Entry', icon: Database },
  { id: 'home' as OperatorPage, label: 'Analytics', icon: LayoutDashboard },
  { id: 'analysis' as OperatorPage, label: 'Analysis & Prediction', icon: TrendingUp },
  { id: 'pipeline' as OperatorPage, label: 'V Badge', icon: Route },
  { id: 'reports' as OperatorPage, label: 'Compliance Reports', icon: FileText },
  { id: 'incidents' as OperatorPage, label: 'Incident Center', icon: AlertTriangle },
  { id: 'roi' as OperatorPage, label: 'ROI Calculator', icon: DollarSign },
  { id: 'market' as OperatorPage, label: 'Marketplace', icon: ShoppingCart },
  { id: 'settings' as OperatorPage, label: 'Settings', icon: Settings },
];

export const OperatorNav: React.FC<OperatorNavProps> = ({
  currentPage,
  onNavigate,
}) => {
  return (
    <nav className="w-64 bg-gradient-to-b from-green-700 to-green-800 h-screen fixed left-0 top-0 text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-white/10">
        <img 
          src="/image/CarbonHorizon.png" 
          alt="CarbonHorizon" 
          className="h-16 w-auto mb-3"
        />
        <p className="text-sm text-green-100 font-medium">Operator Portal</p>
        <p className="text-xs text-green-200 mt-1">Professional Dashboard</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
                isActive
                  ? 'bg-white/15 text-white border-l-4 border-emerald-400 font-semibold'
                  : 'text-green-100 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-green-300'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white shadow-lg">
            JD
          </div>
          <div>
            <p className="text-sm font-semibold text-white">John Doe</p>
            <p className="text-xs text-green-200">Administrator</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
