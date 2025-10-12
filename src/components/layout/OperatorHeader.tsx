import React, { useState } from 'react';
import { Search, Plus, Bell, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Input';

interface OperatorHeaderProps {
  onLogout?: () => void;
}

export const OperatorHeader: React.FC<OperatorHeaderProps> = ({ onLogout }) => {
  const [tenant, setTenant] = useState('all');

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
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
            className="input w-full pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <Button variant="primary" size="md">
          <Plus size={18} className="inline mr-1" />
          Create Report
        </Button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        )}
      </div>
    </header>
  );
};
