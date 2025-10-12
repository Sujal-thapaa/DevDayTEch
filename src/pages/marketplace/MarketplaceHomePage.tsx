import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Package, Database, Truck, Plus, ChevronDown, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

interface Listing {
  listing_id: string;
  org: Organization;
  listing_type: 'offer_CO2' | 'need_CO2' | 'storage' | 'transport';
  quantity: number;
  min_lot: number;
  price_per_ton: number | 'Negotiable';
  delivery_window: { start: string; end: string };
  region: string;
  purity_percent?: number;
  credit_eligible: boolean;
  status: 'Open' | 'Matched' | 'In Progress';
}

interface Filters {
  orgType: string[];
  listingType: string[];
  region: string;
  verificationTier: string[];
  creditEligible: boolean | null;
}

export const MarketplaceHomePage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    orgType: [],
    listingType: [],
    region: 'all',
    verificationTier: [],
    creditEligible: null
  });
  const [showFilters, setShowFilters] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/data/Marketplace.json');
      const orgs: Organization[] = await response.json();
      setOrganizations(orgs);

      // Generate mock listings based on organizations
      const mockListings: Listing[] = orgs.flatMap((org, idx) => {
        const listings: Listing[] = [];
        
        if (org.org_type === 'emitter') {
          listings.push({
            listing_id: `LST-${org.org_id}-${idx}`,
            org,
            listing_type: 'offer_CO2',
            quantity: Math.floor(Math.random() * 50000) + 10000,
            min_lot: Math.floor(Math.random() * 5000) + 1000,
            price_per_ton: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 50 : 'Negotiable',
            delivery_window: {
              start: '2025-11-01',
              end: '2025-12-31'
            },
            region: org.region,
            purity_percent: Math.floor(Math.random() * 10) + 90,
            credit_eligible: Math.random() > 0.5,
            status: ['Open', 'Open', 'Matched', 'In Progress'][Math.floor(Math.random() * 4)] as any
          });
        }
        
        if (org.org_type === 'utilizer') {
          listings.push({
            listing_id: `LST-${org.org_id}-${idx}`,
            org,
            listing_type: 'need_CO2',
            quantity: Math.floor(Math.random() * 30000) + 5000,
            min_lot: Math.floor(Math.random() * 3000) + 500,
            price_per_ton: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 50 : 'Negotiable',
            delivery_window: {
              start: '2025-11-01',
              end: '2025-12-31'
            },
            region: org.region,
            purity_percent: Math.floor(Math.random() * 10) + 90,
            credit_eligible: Math.random() > 0.5,
            status: ['Open', 'Open', 'Matched', 'In Progress'][Math.floor(Math.random() * 4)] as any
          });
        }
        
        if (org.org_type === 'storage') {
          listings.push({
            listing_id: `LST-${org.org_id}-${idx}`,
            org,
            listing_type: 'storage',
            quantity: Math.floor(Math.random() * 100000) + 20000,
            min_lot: Math.floor(Math.random() * 10000) + 2000,
            price_per_ton: Math.random() > 0.3 ? Math.floor(Math.random() * 50) + 20 : 'Negotiable',
            delivery_window: {
              start: '2025-11-01',
              end: '2026-12-31'
            },
            region: org.region,
            credit_eligible: Math.random() > 0.5,
            status: ['Open', 'Open', 'Matched'][Math.floor(Math.random() * 3)] as any
          });
        }
        
        if (org.org_type === 'transport') {
          listings.push({
            listing_id: `LST-${org.org_id}-${idx}`,
            org,
            listing_type: 'transport',
            quantity: Math.floor(Math.random() * 50000) + 10000,
            min_lot: Math.floor(Math.random() * 5000) + 1000,
            price_per_ton: Math.random() > 0.3 ? Math.floor(Math.random() * 30) + 10 : 'Negotiable',
            delivery_window: {
              start: '2025-11-01',
              end: '2025-12-31'
            },
            region: org.region,
            credit_eligible: false,
            status: ['Open', 'Open', 'Matched'][Math.floor(Math.random() * 3)] as any
          });
        }
        
        return listings;
      });

      setListings(mockListings);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading marketplace data:', error);
      setIsLoading(false);
    }
  };

  const getListingTypeColor = (type: string) => {
    const colors = {
      offer_CO2: '#10b981',
      need_CO2: '#3b82f6',
      storage: '#a855f7',
      transport: '#f97316'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  const getVerificationBadge = (status: string) => {
    const colors = {
      Gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Silver: 'bg-gray-100 text-gray-800 border-gray-300',
      Bronze: 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return `${colors[status as keyof typeof colors]} border`;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Open') return <Badge variant="success">Open</Badge>;
    if (status === 'Matched') return <Badge variant="info">Matched</Badge>;
    return <Badge variant="warning">In Progress</Badge>;
  };

  const filteredListings = listings.filter(listing => {
    if (filters.orgType.length > 0 && !filters.orgType.includes(listing.org.org_type)) return false;
    if (filters.listingType.length > 0 && !filters.listingType.includes(listing.listing_type)) return false;
    if (filters.region !== 'all' && listing.region !== filters.region) return false;
    if (filters.verificationTier.length > 0 && !filters.verificationTier.includes(listing.org.verification_status)) return false;
    if (filters.creditEligible !== null && listing.credit_eligible !== filters.creditEligible) return false;
    return true;
  });

  const kpis = {
    openOffers: listings.filter(l => l.listing_type === 'offer_CO2' && l.status === 'Open').reduce((sum, l) => sum + l.quantity, 0),
    openNeeds: listings.filter(l => l.listing_type === 'need_CO2' && l.status === 'Open').reduce((sum, l) => sum + l.quantity, 0),
    storageCapacity: listings.filter(l => l.listing_type === 'storage' && l.status === 'Open').reduce((sum, l) => sum + l.quantity, 0),
    transportCapacity: listings.filter(l => l.listing_type === 'transport' && l.status === 'Open').reduce((sum, l) => sum + l.quantity, 0)
  };

  const toggleFilter = (type: keyof Filters, value: string | boolean) => {
    if (type === 'orgType' || type === 'listingType' || type === 'verificationTier') {
      const current = filters[type] as string[];
      const updated = current.includes(value as string)
        ? current.filter(v => v !== value)
        : [...current, value as string];
      setFilters({ ...filters, [type]: updated });
    } else {
      setFilters({ ...filters, [type]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-[#174B7A]">CO₂Track LA</h1>
              <div className="flex items-center gap-6">
                <button className="text-[#174B7A] font-semibold border-b-2 border-[#1AAE9F] pb-1">
                  Marketplace
                </button>
                <button className="text-gray-600 hover:text-gray-900">Incidents</button>
                <button className="text-gray-600 hover:text-gray-900">Analytics</button>
                <button className="text-gray-600 hover:text-gray-900">Docs</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Search size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                <Package size={20} />
              </button>
              <div className="w-8 h-8 bg-[#174B7A] text-white rounded-full flex items-center justify-center font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* KPI Strip */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-6 py-6">
          <div className="grid grid-cols-4 gap-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Open Offers</p>
                  <p className="text-2xl font-bold text-green-600">{(kpis.openOffers / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-gray-500">t CO₂</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="text-green-600" size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Open Needs</p>
                  <p className="text-2xl font-bold text-blue-600">{(kpis.openNeeds / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-gray-500">t CO₂</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="text-blue-600" size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Storage Capacity</p>
                  <p className="text-2xl font-bold text-purple-600">{(kpis.storageCapacity / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-gray-500">t</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Database className="text-purple-600" size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transport Capacity</p>
                  <p className="text-2xl font-bold text-orange-600">{(kpis.transportCapacity / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-gray-500">t</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Truck className="text-orange-600" size={24} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Filter Rail */}
          {showFilters && (
            <div className="w-80 flex-shrink-0 space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Filter size={18} />
                    Filters
                  </h3>
                  <button
                    onClick={() => setFilters({ orgType: [], listingType: [], region: 'all', verificationTier: [], creditEligible: null })}
                    className="text-xs text-[#1AAE9F] hover:text-[#158F85]"
                  >
                    Clear All
                  </button>
                </div>

                {/* Role Filter */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Organization Type</p>
                  <div className="space-y-2">
                    {['emitter', 'utilizer', 'storage', 'transport'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.orgType.includes(type)}
                          onChange={() => toggleFilter('orgType', type)}
                          className="rounded text-[#1AAE9F] focus:ring-[#1AAE9F]"
                        />
                        <span className="text-sm capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Listing Type */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Listing Type</p>
                  <div className="space-y-2">
                    {[
                      { value: 'offer_CO2', label: 'Offer CO₂', color: 'green' },
                      { value: 'need_CO2', label: 'Need CO₂', color: 'blue' },
                      { value: 'storage', label: 'Storage', color: 'purple' },
                      { value: 'transport', label: 'Transport', color: 'orange' }
                    ].map(({ value, label, color }) => (
                      <label key={value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.listingType.includes(value)}
                          onChange={() => toggleFilter('listingType', value)}
                          className="rounded text-[#1AAE9F] focus:ring-[#1AAE9F]"
                        />
                        <span className="text-sm">{label}</span>
                        <div className={`ml-auto w-3 h-3 rounded-full bg-${color}-500`}></div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Region</p>
                  <select
                    value={filters.region}
                    onChange={(e) => setFilters({ ...filters, region: e.target.value })}
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

                {/* Verification Tier */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Verification Tier</p>
                  <div className="space-y-2">
                    {['Gold', 'Silver', 'Bronze'].map(tier => (
                      <label key={tier} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.verificationTier.includes(tier)}
                          onChange={() => toggleFilter('verificationTier', tier)}
                          className="rounded text-[#1AAE9F] focus:ring-[#1AAE9F]"
                        />
                        <span className={`text-xs px-2 py-1 rounded ${getVerificationBadge(tier)}`}>
                          {tier}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Credit Eligible */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Credit Eligible</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="credit"
                        checked={filters.creditEligible === null}
                        onChange={() => setFilters({ ...filters, creditEligible: null })}
                        className="text-[#1AAE9F] focus:ring-[#1AAE9F]"
                      />
                      <span className="text-sm">All</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="credit"
                        checked={filters.creditEligible === true}
                        onChange={() => setFilters({ ...filters, creditEligible: true })}
                        className="text-[#1AAE9F] focus:ring-[#1AAE9F]"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="credit"
                        checked={filters.creditEligible === false}
                        onChange={() => setFilters({ ...filters, creditEligible: false })}
                        className="text-[#1AAE9F] focus:ring-[#1AAE9F]"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Main Split Layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map */}
            <Card className="p-0 overflow-hidden" style={{ height: '600px' }}>
              <div className="h-full relative">
                {!isLoading && (
                  <MapContainer
                    center={[30.4515, -91.5]}
                    zoom={7}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredListings.map((listing, idx) => (
                      <CircleMarker
                        key={listing.listing_id}
                        center={[listing.org.lat, listing.org.lon]}
                        radius={Math.sqrt(listing.quantity / 1000) * 2}
                        fillColor={getListingTypeColor(listing.listing_type)}
                        color="white"
                        weight={2}
                        opacity={0.9}
                        fillOpacity={0.7}
                        eventHandlers={{
                          click: () => setSelectedListing(listing)
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <p className="font-bold text-sm">{listing.org.org_name}</p>
                            <p className="text-xs text-gray-600 capitalize">{listing.listing_type.replace('_', ' ')}</p>
                            <p className="text-sm font-semibold mt-1">{(listing.quantity / 1000).toFixed(1)}K t</p>
                            <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${getVerificationBadge(listing.org.verification_status)}`}>
                              {listing.org.verification_status}
                            </span>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                )}
              </div>
            </Card>

            {/* Order Book Table */}
            <Card className="p-0 overflow-hidden" style={{ height: '600px' }}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
                <h3 className="font-bold text-gray-900">Order Book ({filteredListings.length})</h3>
              </div>
              <div className="overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Org</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Qty (t)</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Price/t</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredListings.map((listing) => (
                      <tr key={listing.listing_id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedListing(listing)}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{listing.org.org_name}</p>
                            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${getVerificationBadge(listing.org.verification_status)}`}>
                              {listing.org.verification_status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className="inline-block px-2 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: getListingTypeColor(listing.listing_type) }}
                          >
                            {listing.listing_type.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-semibold">{(listing.quantity / 1000).toFixed(1)}K</p>
                          <p className="text-xs text-gray-500">Min: {(listing.min_lot / 1000).toFixed(1)}K</p>
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          {typeof listing.price_per_ton === 'number' ? `$${listing.price_per_ton}` : listing.price_per_ton}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getStatusBadge(listing.status)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="px-3 py-1 bg-[#1AAE9F] text-white text-xs rounded-lg hover:bg-[#158F85]">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#1AAE9F] text-white rounded-full shadow-lg hover:bg-[#158F85] flex items-center justify-center transition-all hover:scale-110">
        <Plus size={24} />
      </button>
    </div>
  );
};

