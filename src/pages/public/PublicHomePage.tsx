import React from 'react';
import { MapPin, TrendingUp, Users, Briefcase } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FacilityMap } from '../../components/maps/FacilityMap';
import { GOOGLE_MAPS_API_KEY } from '../../config/maps';
import facilitiesData from '../../data/facilities.json';

export const PublicHomePage: React.FC = () => {
  const facilities = facilitiesData;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/image/bg.jpg)' }}
    >
      <div className="min-h-screen bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Louisiana Carbon Capture Transparency Portal
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Track carbon capture operations, environmental impact, and economic benefits across Louisiana
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="text-[#174B7A]" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">58.7K</div>
          <div className="text-sm text-gray-600">Tons CO₂ Captured (MTD)</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MapPin className="text-green-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
          <div className="text-sm text-gray-600">Active Facilities</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="text-yellow-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">247</div>
          <div className="text-sm text-gray-600">Jobs Created</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Briefcase className="text-purple-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">$8.4M</div>
          <div className="text-sm text-gray-600">Tax Revenue (Annual)</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Facility Locations</h2>
          <div className="flex gap-3 items-center text-sm">
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-sm bg-[#ffe8b3] border-2 border-[#800000] opacity-30"></span>
              <span className="text-gray-600 font-medium">Louisiana Border</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#1AAE9F]"></span>
              <span className="text-gray-600">Active Capture</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#E9A23B]"></span>
              <span className="text-gray-600">Monitored</span>
            </div>
          </div>
        </div>
        <FacilityMap facilities={facilities} apiKey={GOOGLE_MAPS_API_KEY} />
        <p className="text-sm text-gray-600 mt-4">
          Interactive map showing {facilities.length} facilities across Louisiana. Click on markers for detailed information including facility type, emissions data, and location coordinates. Hover over the state to see it highlight.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#174B7A] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Capture</h3>
                <p className="text-sm text-gray-600">
                  Industrial facilities capture CO₂ from their operations before it enters the atmosphere
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#1AAE9F] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Transport</h3>
                <p className="text-sm text-gray-600">
                  Captured CO₂ is compressed and transported via pipeline or truck to storage sites
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#3A7BF7] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Store or Utilize</h3>
                <p className="text-sm text-gray-600">
                  CO₂ is either permanently stored underground in geological formations or used in industrial processes
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Updates</h2>
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-200">
              <div className="flex justify-between items-start mb-1">
                <Badge variant="success" size="sm">
                  Milestone
                </Badge>
                <span className="text-xs text-gray-600">Oct 10, 2025</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                Port Allen Reaches 100K Tons
              </h3>
              <p className="text-sm text-gray-600">
                Port Allen Ethanol facility reaches 100,000 tons captured milestone
              </p>
            </div>
            <div className="pb-3 border-b border-gray-200">
              <div className="flex justify-between items-start mb-1">
                <Badge variant="info" size="sm">
                  Report
                </Badge>
                <span className="text-xs text-gray-600">Oct 5, 2025</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                Q3 Economic Impact Released
              </h3>
              <p className="text-sm text-gray-600">
                New report shows 247 jobs created and $8.4M in annual tax revenue
              </p>
            </div>
            <div className="pb-3">
              <div className="flex justify-between items-start mb-1">
                <Badge variant="neutral" size="sm">
                  Update
                </Badge>
                <span className="text-xs text-gray-600">Oct 1, 2025</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                New Safety Dashboard Launched
              </h3>
              <p className="text-sm text-gray-600">
                Enhanced transparency with real-time incident tracking and reporting
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 bg-gradient-to-r from-[#174B7A] to-[#1AAE9F] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">
            Commitment to Transparency
          </h2>
          <p className="text-lg text-white/90">
            This portal provides the public with access to real-time data on carbon capture
            operations, safety incidents, and economic benefits. We believe in open
            communication and community engagement.
          </p>
        </div>
      </Card>
        </div>
      </div>
    </div>
  );
};
