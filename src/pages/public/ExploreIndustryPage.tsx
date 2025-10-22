import React, { useEffect, useState } from 'react';
import { Search, Filter, MapPin, TrendingUp, Building2, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { FacilityDetailPage } from './FacilityDetailPage';

interface FacilityData {
  "Facility Name": string;
  "Sector": string;
  "Reporting Year": number;
  "Total CO2 (mt)": number;
  "Total CO2e (mt CO2e)": number;
  "Latitude": number;
  "Longitude": number;
}

export const ExploreIndustryPage: React.FC = () => {
  const [facilities, setFacilities] = useState<FacilityData[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<FacilityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'emissions'>('emissions');
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  // Load facility data
  useEffect(() => {
    fetch('/data/facility.json')
      .then(response => response.json())
      .then((data: FacilityData[]) => {
        console.log(`📥 Loaded ${data.length} facilities for Explore Industry page`);
        setFacilities(data);
        setFilteredFacilities(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('❌ Error loading facility data:', error);
        setIsLoading(false);
      });
  }, []);

  // Get unique sectors
  const sectors = ['all', ...Array.from(new Set(facilities.map(f => f.Sector)))];

  // Filter and search facilities
  useEffect(() => {
    let results = [...facilities];

    // Apply sector filter
    if (selectedSector !== 'all') {
      results = results.filter(f => f.Sector === selectedSector);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(f => 
        f["Facility Name"].toLowerCase().includes(query) ||
        f.Sector.toLowerCase().includes(query)
      );
    }

    // Sort results
    if (sortBy === 'name') {
      results.sort((a, b) => a["Facility Name"].localeCompare(b["Facility Name"]));
    } else {
      results.sort((a, b) => b["Total CO2e (mt CO2e)"] - a["Total CO2e (mt CO2e)"]);
    }

    setFilteredFacilities(results);
  }, [searchQuery, selectedSector, sortBy, facilities]);

  // Get sector stats
  const sectorStats = sectors
    .filter(s => s !== 'all')
    .map(sector => {
      const sectorFacilities = facilities.filter(f => f.Sector === sector);
      const totalEmissions = sectorFacilities.reduce((sum, f) => sum + f["Total CO2e (mt CO2e)"], 0);
      return {
        sector,
        count: sectorFacilities.length,
        totalEmissions
      };
    })
    .sort((a, b) => b.totalEmissions - a.totalEmissions);

  const getSectorColor = (sector: string): string => {
    const colors: { [key: string]: string } = {
      'Refining': 'bg-red-100 text-red-800',
      'Power': 'bg-blue-100 text-blue-800',
      'Petrochemical': 'bg-purple-100 text-purple-800',
      'Fertilizer': 'bg-green-100 text-green-800',
      'Cement': 'bg-gray-100 text-gray-800',
      'Biofuels': 'bg-yellow-100 text-yellow-800',
      'Pulp & Paper': 'bg-orange-100 text-orange-800',
      'Public Sector': 'bg-indigo-100 text-indigo-800',
    };
    return colors[sector] || 'bg-gray-100 text-gray-800';
  };

  // Verification badge types
  const verificationBadges = ['bronze', 'silver', 'gold', 'diamond'];
  
  // Function to get random badge for a facility
  const getRandomBadge = (facilityName: string) => {
    // Use facility name as seed for consistent badge assignment
    const hash = facilityName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return verificationBadges[Math.abs(hash) % verificationBadges.length];
  };

  // If a facility is selected, show detail page
  if (selectedFacility) {
    return <FacilityDetailPage facilityName={selectedFacility} onBack={() => setSelectedFacility(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Industry</h1>
        <p className="text-gray-600">
          Browse and search through {facilities.length} facilities across Louisiana's key industrial sectors
        </p>
      </div>

      {/* Stats Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{facilities.length}</div>
            <div className="text-sm text-gray-600">Total Facilities</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Filter className="text-green-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{sectorStats.length}</div>
            <div className="text-sm text-gray-600">Industry Sectors</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="text-red-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {(facilities.reduce((sum, f) => sum + f["Total CO2e (mt CO2e)"], 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Total Emissions (mt)</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="text-purple-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{filteredFacilities.length}</div>
            <div className="text-sm text-gray-600">Filtered Results</div>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by facility name or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AAE9F] focus:border-transparent text-gray-900 placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Sector Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline mr-2" size={16} />
                Filter by Sector
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AAE9F] focus:border-transparent"
              >
                <option value="all">All Sectors ({facilities.length})</option>
                {sectors.filter(s => s !== 'all').map(sector => (
                  <option key={sector} value={sector}>
                    {sector} ({facilities.filter(f => f.Sector === sector).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'emissions')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AAE9F] focus:border-transparent"
              >
                <option value="emissions">Highest Emissions</option>
                <option value="name">Facility Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedSector !== 'all') && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <Badge variant="info" className="flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="ml-1">
                    <X size={12} />
                  </button>
                </Badge>
              )}
              {selectedSector !== 'all' && (
                <Badge variant="info" className="flex items-center gap-1">
                  Sector: {selectedSector}
                  <button onClick={() => setSelectedSector('all')} className="ml-1">
                    <X size={12} />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#174B7A]"></div>
        </div>
      )}

      {/* Results */}
      {!isLoading && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Facilities ({filteredFacilities.length})
            </h2>
          </div>

          {filteredFacilities.length === 0 ? (
            <Card className="p-12 text-center">
              <Search className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No facilities found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSector('all');
                }}
                className="px-4 py-2 bg-[#1AAE9F] text-white rounded-lg hover:bg-[#158F85] transition-colors"
              >
                Clear All Filters
              </button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility, index) => (
                <Card 
                  key={index} 
                  className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105 hover:border-[#1AAE9F] relative"
                  onClick={() => setSelectedFacility(facility["Facility Name"])}
                >
                  {/* Verification Badge */}
                  <div className="absolute top-3 right-3">
                    <img 
                      src={`/image/${getRandomBadge(facility["Facility Name"])}.png`}
                      alt={`${getRandomBadge(facility["Facility Name"])} verification badge`}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        // Fallback to colored circle if image not found
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = `w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          getRandomBadge(facility["Facility Name"]) === 'bronze' ? 'bg-amber-600' :
                          getRandomBadge(facility["Facility Name"]) === 'silver' ? 'bg-gray-400' :
                          getRandomBadge(facility["Facility Name"]) === 'gold' ? 'bg-yellow-500' :
                          'bg-gradient-to-r from-blue-400 to-purple-600'
                        }`;
                        fallback.textContent = getRandomBadge(facility["Facility Name"]).charAt(0).toUpperCase();
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                  </div>

                  <div className="flex items-start justify-between mb-3 pr-12">
                    <h3 className="font-bold text-gray-900 text-lg flex-1">
                      {facility["Facility Name"]}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* Sector Badge */}
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSectorColor(facility.Sector)}`}>
                        {facility.Sector}
                      </span>
                    </div>

                    {/* Emissions */}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Annual Emissions ({facility["Reporting Year"]})</p>
                      <p className="text-2xl font-bold text-[#174B7A]">
                        {(facility["Total CO2e (mt CO2e)"] / 1000).toFixed(1)}K
                      </p>
                      <p className="text-xs text-gray-500">mt CO₂e</p>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
                      <MapPin size={14} />
                      <span>{facility.Latitude.toFixed(4)}°N, {Math.abs(facility.Longitude).toFixed(4)}°W</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Sector Breakdown */}
      {!isLoading && facilities.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sector Breakdown</h2>
          <div className="space-y-3">
            {sectorStats.map(({ sector, count, totalEmissions }) => (
              <div key={sector} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setSelectedSector(sector)}
              >
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSectorColor(sector)}`}>
                    {sector}
                  </span>
                  <span className="text-sm text-gray-600">{count} facilities</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{(totalEmissions / 1000000).toFixed(2)}M mt</p>
                  <p className="text-xs text-gray-500">
                    {((totalEmissions / facilities.reduce((sum, f) => sum + f["Total CO2e (mt CO2e)"], 0)) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

