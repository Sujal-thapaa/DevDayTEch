import React, { useEffect, useState } from 'react';
import { Search, Filter, MapPin, TrendingUp, Building2, X, ArrowRight, BarChart3 } from 'lucide-react';
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
      'Refining': 'bg-red-100 text-red-800 border-red-200',
      'Power': 'bg-blue-100 text-blue-800 border-blue-200',
      'Petrochemical': 'bg-purple-100 text-purple-800 border-purple-200',
      'Fertilizer': 'bg-green-100 text-green-800 border-green-200',
      'Cement': 'bg-gray-100 text-gray-800 border-gray-200',
      'Biofuels': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Pulp & Paper': 'bg-orange-100 text-orange-800 border-orange-200',
      'Public Sector': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[sector] || 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
        {/* Hero Section - Asymmetric Layout */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  Louisiana Industrial
                  <span className="block text-green-600">Facilities Directory</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Comprehensive database of {facilities.length} industrial facilities across Louisiana. 
                  Explore emissions data, facility types, and environmental performance metrics.
                </p>
              </div>
            </div>
            
            {/* Offset Visual Element */}
            <div className="lg:col-span-4 lg:ml-8">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{facilities.length}</div>
                  <div className="text-green-100">Total Facilities</div>
                  <div className="text-sm text-green-200 mt-2">Across Louisiana</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Creative Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{facilities.length}</div>
                  <div className="text-sm text-gray-600">Total Facilities</div>
                  <div className="text-xs text-green-600 font-medium mt-1">Statewide coverage</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Building2 className="text-green-600" size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{sectorStats.length}</div>
                  <div className="text-sm text-gray-600">Industry Sectors</div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">Diverse operations</div>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Filter className="text-emerald-600" size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {(facilities.reduce((sum, f) => sum + f["Total CO2e (mt CO2e)"], 0) / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600">Total Emissions (mt)</div>
                  <div className="text-xs text-teal-600 font-medium mt-1">Annual output</div>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="text-teal-600" size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{filteredFacilities.length}</div>
                  <div className="text-sm text-gray-600">Filtered Results</div>
                  <div className="text-xs text-green-600 font-medium mt-1">Current view</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="text-green-600" size={24} />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Search and Filters - Enhanced Design */}
        <Card className="p-8 shadow-lg">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by facility name or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sector Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Filter className="inline mr-2" size={16} />
                  Filter by Sector
                </label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <BarChart3 className="inline mr-2" size={16} />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'emissions')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="emissions">Highest Emissions</option>
                  <option value="name">Facility Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedSector !== 'all') && (
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {searchQuery && (
                  <Badge variant="info" className="flex items-center gap-2 px-3 py-1">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-gray-600">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedSector !== 'all' && (
                  <Badge variant="info" className="flex items-center gap-2 px-3 py-1">
                    Sector: {selectedSector}
                    <button onClick={() => setSelectedSector('all')} className="ml-1 hover:text-gray-600">
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
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading facility data...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Facilities ({filteredFacilities.length})
              </h2>
              {filteredFacilities.length > 0 && (
                <div className="text-sm text-gray-600">
                  Showing {filteredFacilities.length} of {facilities.length} facilities
                </div>
              )}
            </div>

            {filteredFacilities.length === 0 ? (
              <Card className="p-16 text-center shadow-lg">
                <Search className="mx-auto mb-6 text-gray-400" size={64} />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No facilities found</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Try adjusting your search criteria or filters to find what you're looking for
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSector('all');
                  }}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Clear All Filters
                </button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFacilities.map((facility, index) => (
                  <Card 
                    key={index} 
                    className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:border-green-300 relative group"
                    onClick={() => setSelectedFacility(facility["Facility Name"])}
                  >
                    {/* Verification Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <img 
                        src={`/image/${getRandomBadge(facility["Facility Name"])}.png`}
                        alt={`${getRandomBadge(facility["Facility Name"])} verification badge`}
                        className="w-10 h-10 object-contain drop-shadow-lg"
                        onError={(e) => {
                          // Fallback to colored circle if image not found
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = `w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${
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

                    <div className="space-y-4 pr-14">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl leading-tight mb-2">
                          {facility["Facility Name"]}
                        </h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getSectorColor(facility.Sector)}`}>
                          {facility.Sector}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Annual Emissions ({facility["Reporting Year"]})</p>
                          <p className="text-3xl font-bold text-green-600">
                            {(facility["Total CO2e (mt CO2e)"] / 1000).toFixed(1)}K
                          </p>
                          <p className="text-sm text-gray-500">mt CO₂e</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-200">
                          <MapPin size={16} />
                          <span>{facility.Latitude.toFixed(4)}°N, {Math.abs(facility.Longitude).toFixed(4)}°W</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-gray-500">Click to view details</span>
                        <ArrowRight className="text-gray-400 group-hover:text-green-600 transition-colors" size={16} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Sector Breakdown - Enhanced Design */}
        {!isLoading && facilities.length > 0 && (
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Industry Sector Analysis</h2>
            <div className="space-y-4">
              {sectorStats.map(({ sector, count, totalEmissions }) => (
                <div key={sector} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                  onClick={() => setSelectedSector(sector)}
                >
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getSectorColor(sector)}`}>
                      {sector}
                    </span>
                    <span className="text-sm text-gray-600 font-medium">{count} facilities</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">{(totalEmissions / 1000000).toFixed(2)}M mt</p>
                    <p className="text-sm text-gray-500">
                      {((totalEmissions / facilities.reduce((sum, f) => sum + f["Total CO2e (mt CO2e)"], 0)) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-green-600 transition-colors ml-4" size={20} />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

