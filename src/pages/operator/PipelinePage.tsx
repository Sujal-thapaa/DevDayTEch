import React from 'react';
import { Route } from 'lucide-react';
import { VerificationBadgeSystem } from '../../components/operator/VerificationBadgeSystem';

export const PipelinePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Route className="text-[#174B7A]" size={32} />
            Verification Badge System
          </h1>
          <p className="text-gray-600 mt-2">
            Track CO₂ emissions, offset progress, and investment verification across Louisiana companies
          </p>
        </div>
      </div>

      {/* Verification Badge System */}
      <VerificationBadgeSystem />
    </div>
  );
};