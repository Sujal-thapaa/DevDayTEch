import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Mail, 
  Building2, 
  Grid3x3, 
  List, 
  X,
  Award,
  ChevronDown,
  Map as MapIcon
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Organization {
  org_id: string;
  org_name: string;
  org_type: 'emitter' | 'utilizer' | 'storage' | 'transport';
  verification_status: 'Gold' | 'Silver' | 'Bronze';
  hq_location: string;
  lat: number;
  lon: number;
  region: string;
  contact_email: string;
}

type ViewMode = 'cards' | 'table' | 'map';

export const MarketPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    orgType: [] as string[],
    region: 'all',
    verificationStatus: [] as string[],
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [organizations, searchQuery, filters]);

  const loadOrganizations = async () => {
    try {
      const response = await fetch('/data/Marketplace.json');
      const data: Organization[] = await response.json();
      setOrganizations(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading organizations:', error);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = organizations.filter(org => {
      const matchesSearch = 
        org.org_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.hq_location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filters.orgType.length === 0 || filters.orgType.includes(org.org_type);
      const matchesRegion = filters.region === 'all' || org.region === filters.region;
      const matchesVerification = 
        filters.verificationStatus.length === 0 || 
        filters.verificationStatus.includes(org.verification_status);

      return matchesSearch && matchesType && matchesRegion && matchesVerification;
    });
    setFilteredOrgs(filtered);
  };

  const toggleFilter = (type: 'orgType' | 'verificationStatus', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      orgType: [],
      region: 'all',
      verificationStatus: [],
    });
    setSearchQuery('');
  };

  const getOrgTypeColor = (type: string) => {
    const colors = {
      emitter: 'bg-red-100 text-red-800',
      utilizer: 'bg-blue-100 text-blue-800',
      storage: 'bg-purple-100 text-purple-800',
      transport: 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getVerificationColor = (status: string) => {
    const colors = {
      Gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Silver: 'bg-gray-200 text-gray-800 border-gray-400',
      Bronze: 'bg-orange-100 text-orange-800 border-orange-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const activeFilterCount = 
    filters.orgType.length + 
    filters.verificationStatus.length + 
    (filters.region !== 'all' ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
        <div>
        <h1 className="text-3xl font-bold text-gray-900">CO₂ Mediator Portal</h1>
        <p className="text-gray-600 mt-2">
          Explore and connect with emission organizations, verifiers, and mediators across Louisiana.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Organizations</p>
              <p className="text-2xl font-bold text-[#174B7A]">{organizations.length}</p>
            </div>
            <Building2 className="text-[#174B7A]" size={32} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Emitters</p>
              <p className="text-2xl font-bold text-red-600">
                {organizations.filter(o => o.org_type === 'emitter').length}
              </p>
            </div>
            <Building2 className="text-red-600" size={32} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilizers</p>
              <p className="text-2xl font-bold text-blue-600">
                {organizations.filter(o => o.org_type === 'utilizer').length}
              </p>
            </div>
            <Building2 className="text-blue-600" size={32} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gold Verified</p>
              <p className="text-2xl font-bold text-yellow-600">
                {organizations.filter(o => o.verification_status === 'Gold').length}
              </p>
            </div>
            <Award className="text-yellow-600" size={32} />
          </div>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by organization name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AAE9F] focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#1AAE9F] text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded ${viewMode === 'cards' ? 'bg-[#174B7A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Card View"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-[#174B7A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Table View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded ${viewMode === 'map' ? 'bg-[#174B7A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Map View"
            >
              <MapIcon size={18} />
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Organization Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Type</label>
                <div className="space-y-2">
                  {['emitter', 'utilizer', 'storage', 'transport'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.orgType.includes(type)}
                        onChange={() => toggleFilter('orgType', type)}
                        className="rounded border-gray-300 text-[#1AAE9F] focus:ring-[#1AAE9F]"
                      />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AAE9F] focus:border-transparent"
                >
                  <option value="all">All Regions</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                  <option value="central">Central</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="southeast">Southeast</option>
                  <option value="gulf">Gulf</option>
                </select>
              </div>

              {/* Verification Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Status</label>
                <div className="space-y-2">
                  {['Gold', 'Silver', 'Bronze'].map(status => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.verificationStatus.includes(status)}
                        onChange={() => toggleFilter('verificationStatus', status)}
                        className="rounded border-gray-300 text-[#1AAE9F] focus:ring-[#1AAE9F]"
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#174B7A] hover:text-[#1AAE9F] font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredOrgs.length}</span> of{' '}
          <span className="font-semibold">{organizations.length}</span> organizations
        </p>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1AAE9F]"></div>
        </div>
      ) : filteredOrgs.length === 0 ? (
        <Card className="p-12 text-center">
          <Search className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No organizations found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-[#1AAE9F] text-white rounded-lg hover:bg-[#158F85] transition-colors"
          >
            Clear Filters
          </button>
        </Card>
      ) : (
        <div className="flex gap-6">
          {/* Main Content */}
          <div className={selectedOrg ? 'flex-1' : 'w-full'}>
            {/* Card View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrgs.map(org => (
                  <Card
                    key={org.org_id}
                    className="p-6 hover:shadow-lg transition-all cursor-pointer hover:border-[#1AAE9F]"
                    onClick={() => setSelectedOrg(org)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Building2 className="text-[#174B7A]" size={32} />
                      <span className={`text-xs px-2 py-1 rounded-full border ${getVerificationColor(org.verification_status)}`}>
                        {org.verification_status}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-2">{org.org_name}</h3>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getOrgTypeColor(org.org_type)}`}>
                          {org.org_type}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{org.hq_location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Region:</span>
                        <span className="capitalize">{org.region}</span>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Mail size={16} className="mt-0.5 flex-shrink-0" />
                        <span className="truncate">{org.contact_email}</span>
                      </div>
                    </div>

                    <button className="mt-4 w-full px-4 py-2 bg-[#174B7A] text-white rounded-lg hover:bg-[#1AAE9F] transition-colors text-sm font-medium">
                      View Details
                    </button>
                  </Card>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Organization</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Region</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredOrgs.map(org => (
                        <tr key={org.org_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{org.org_name}</div>
                            <div className="text-xs text-gray-500">{org.org_id}</div>
                  </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${getOrgTypeColor(org.org_type)}`}>
                              {org.org_type}
                            </span>
                  </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getVerificationColor(org.verification_status)}`}>
                              {org.verification_status}
                            </span>
                  </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{org.hq_location}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 capitalize">{org.region}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{org.contact_email}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedOrg(org)}
                              className="px-3 py-1 bg-[#174B7A] text-white rounded text-xs hover:bg-[#1AAE9F] transition-colors"
                            >
                              View
                            </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
            )}

            {/* Map View */}
            {viewMode === 'map' && (
              <Card className="overflow-hidden" style={{ height: '600px' }}>
                <MapContainer
                  center={[30.9843, -91.9623]}
                  zoom={7}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredOrgs.map(org => (
                    <Marker key={org.org_id} position={[org.lat, org.lon]}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold text-sm mb-1">{org.org_name}</h3>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <span className={`px-2 py-0.5 rounded-full ${getOrgTypeColor(org.org_type)}`}>
                                {org.org_type}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full border ${getVerificationColor(org.verification_status)}`}>
                                {org.verification_status}
                              </span>
                            </div>
                            <p className="text-gray-600">{org.hq_location}</p>
                            <p className="text-gray-600">{org.contact_email}</p>
                          </div>
                          <button
                            onClick={() => setSelectedOrg(org)}
                            className="mt-2 w-full px-3 py-1 bg-[#174B7A] text-white rounded text-xs hover:bg-[#1AAE9F]"
                          >
                            View Details
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Card>
            )}
          </div>

          {/* Details Sidebar */}
          {selectedOrg && (
            <Card className="w-96 p-6 space-y-6 relative h-fit sticky top-6">
              <button
                onClick={() => setSelectedOrg(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

                <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#174B7A] text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {selectedOrg.org_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{selectedOrg.org_name}</h2>
                    <p className="text-sm text-gray-500">{selectedOrg.org_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${getOrgTypeColor(selectedOrg.org_type)}`}>
                    {selectedOrg.org_type}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full border ${getVerificationColor(selectedOrg.verification_status)}`}>
                    {selectedOrg.verification_status} Verified
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Mail size={16} className="mt-0.5 text-gray-400" />
                      <a href={`mailto:${selectedOrg.contact_email}`} className="text-[#174B7A] hover:underline">
                        {selectedOrg.contact_email}
                      </a>
              </div>
            </div>
        </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Location</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="mt-0.5 text-gray-400" />
                      <span>{selectedOrg.hq_location}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Region:</span>{' '}
                      <span className="capitalize">{selectedOrg.region}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Coordinates:</span>{' '}
                      <span>{selectedOrg.lat.toFixed(4)}, {selectedOrg.lon.toFixed(4)}</span>
                    </div>
            </div>
          </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Verification Details</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className={selectedOrg.verification_status === 'Gold' ? 'text-yellow-600' : selectedOrg.verification_status === 'Silver' ? 'text-gray-500' : 'text-orange-600'} size={20} />
                      <span className="font-medium text-gray-900">{selectedOrg.verification_status} Status</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      This organization has been verified and meets the {selectedOrg.verification_status.toLowerCase()}-tier standards for CO₂ operations.
                    </p>
                  </div>
            </div>
          </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-[#1AAE9F] text-white rounded-lg hover:bg-[#158F85] transition-colors font-medium">
                  Contact Organization
                </button>
                <button className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  View on Map
                </button>
            </div>
            </Card>
          )}
          </div>
      )}

      {/* Footer */}
      <Card className="p-6 bg-gradient-to-r from-[#174B7A] to-[#1AAE9F] text-white">
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2">Want to register your organization?</h3>
          <p className="text-sm mb-4 opacity-90">
            Join the Mediator Network today and connect with emission organizations across Louisiana.
          </p>
          <button className="px-6 py-2 bg-white text-[#174B7A] rounded-lg hover:bg-gray-100 transition-colors font-medium">
            Register Now
          </button>
        </div>
      </Card>
    </div>
  );
};
