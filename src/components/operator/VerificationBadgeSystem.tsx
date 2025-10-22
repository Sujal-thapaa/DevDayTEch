import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Input';

interface OffsetProject {
  type: string;
  value: number;
}

interface Company {
  id: number;
  name: string;
  logo: string;
  emission: number; // tons/year
  offsetProjects: OffsetProject[];
}

interface CompanyWithBadge extends Company {
  totalOffset: number;
  offsetPercent: number;
  investment: number;
  badge: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
}



// CO₂ Capture Companies (replacing emitting companies)
const captureCompanies = [
  { 
    id: 1, 
    name: "Bayou Algae Farms", 
    type: "Algae Farm",
    capacity: 50000, // tons CO₂ captured per year
    description: "Leading algae-based carbon capture facility using advanced photobioreactor technology",
    location: "Baton Rouge, LA",
    founded: 2020,
    employees: 45,
    technology: "Photobioreactor Systems",
    efficiency: "High"
  },
  { 
    id: 2, 
    name: "Pelican Direct Air Capture", 
    type: "Direct Air Capture",
    capacity: 35000,
    description: "State-of-the-art DAC facility using amine-based capture technology",
    location: "Lake Charles, LA",
    founded: 2021,
    employees: 32,
    technology: "Amine-Based Capture",
    efficiency: "Very High"
  },
  { 
    id: 3, 
    name: "Gulf Forest Conservation", 
    type: "Forest Conservation",
    capacity: 75000,
    description: "Large-scale forest protection and restoration project across Gulf Coast",
    location: "New Orleans, LA",
    founded: 2019,
    employees: 28,
    technology: "Forest Management",
    efficiency: "Medium"
  },
  { 
    id: 4, 
    name: "Louisiana Ocean Alkalinity", 
    type: "Ocean Enhancement",
    capacity: 40000,
    description: "Ocean alkalinity enhancement facility using mineral dissolution technology",
    location: "Houma, LA",
    founded: 2022,
    employees: 38,
    technology: "Mineral Dissolution",
    efficiency: "High"
  },
  { 
    id: 5, 
    name: "Mississippi Soil Carbon", 
    type: "Soil Sequestration",
    capacity: 30000,
    description: "Agricultural soil carbon enhancement through regenerative farming practices",
    location: "Alexandria, LA",
    founded: 2020,
    employees: 22,
    technology: "Regenerative Agriculture",
    efficiency: "Medium"
  },
  { 
    id: 6, 
    name: "Atchafalaya Wetland Restoration", 
    type: "Wetland Restoration",
    capacity: 60000,
    description: "Comprehensive wetland restoration project for blue carbon sequestration",
    location: "Lafayette, LA",
    founded: 2018,
    employees: 35,
    technology: "Wetland Restoration",
    efficiency: "High"
  },
];

const simulationProjects = [
  { id: 1, name: "Algae Farm 🌿", efficiency: 0.0005 }, // tons offset per $1
  { id: 2, name: "Tree Plantation 🌲", efficiency: 0.0003 },
  { id: 3, name: "Eco-Friendly CO₂ Capture Company ⚙️", efficiency: 0.0007 },
  { id: 4, name: "Direct Air Capture 🌪️", efficiency: 0.0008 },
  { id: 5, name: "Ocean Alkalinity Enhancement 🌊", efficiency: 0.0004 },
  { id: 6, name: "Forest Conservation 🌳", efficiency: 0.0006 },
];

const calculateBadge = (offsetPercent: number): CompanyWithBadge['badge'] => {
  if (offsetPercent >= 100) return "Diamond";
  if (offsetPercent >= 75) return "Gold";
  if (offsetPercent >= 50) return "Silver";
  if (offsetPercent >= 25) return "Bronze";
  return "None";
};

const getBadgeIcon = (badge: CompanyWithBadge['badge']) => {
  switch (badge) {
    case 'Bronze': return '🟤';
    case 'Silver': return '⚪';
    case 'Gold': return '🟡';
    case 'Diamond': return '💎';
    default: return '⚫';
  }
};

const getBadgeImage = (badge: CompanyWithBadge['badge']) => {
  switch (badge) {
    case 'Bronze': return '/image/bronze.png';
    case 'Silver': return '/image/silver.png';
    case 'Gold': return '/image/gold.png';
    case 'Diamond': return '/image/diamond.png';
    default: return '/image/bronze.png';
  }
};

const getBadgeColor = (badge: CompanyWithBadge['badge']) => {
  switch (badge) {
    case 'Bronze': return 'from-amber-600 to-amber-800';
    case 'Silver': return 'from-gray-400 to-gray-600';
    case 'Gold': return 'from-yellow-400 to-yellow-600';
    case 'Diamond': return 'from-blue-400 to-purple-600';
    default: return 'from-gray-300 to-gray-500';
  }
};

const getBadgeGlow = (badge: CompanyWithBadge['badge']) => {
  switch (badge) {
    case 'Bronze': return 'shadow-amber-500/50';
    case 'Silver': return 'shadow-gray-400/50';
    case 'Gold': return 'shadow-yellow-400/50';
    case 'Diamond': return 'shadow-purple-500/50';
    default: return 'shadow-gray-300/50';
  }
};

export const VerificationBadgeSystem: React.FC = () => {
  // Interactive simulation state
  const [selectedCompany, setSelectedCompany] = useState<number>(1);
  const [selectedProject, setSelectedProject] = useState<number>(1);
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000000);
  const [simulationResult, setSimulationResult] = useState<{
    company: typeof captureCompanies[0];
    project: typeof simulationProjects[0];
    investment: number;
    offset: number;
    offsetPercent: number;
    badge: CompanyWithBadge['badge'];
  } | null>(null);

  // Interactive simulation functions
  const calculateSimulation = () => {
    const company = captureCompanies.find(c => c.id === selectedCompany);
    const project = simulationProjects.find(p => p.id === selectedProject);
    
    if (!company || !project) return;
    
    const offset = investmentAmount * project.efficiency;
    const offsetPercent = (offset / company.capacity) * 100;
    const badge = calculateBadge(offsetPercent);
    
    setSimulationResult({
      company,
      project,
      investment: investmentAmount,
      offset,
      offsetPercent,
      badge,
    });
  };

  const getNextBadgeInvestment = (currentPercent: number, company: typeof captureCompanies[0], project: typeof simulationProjects[0]) => {
    const thresholds = [25, 50, 75, 100];
    const nextThreshold = thresholds.find(t => t > currentPercent);
    
    if (!nextThreshold) return null;
    
    const neededOffset = (nextThreshold / 100) * company.capacity;
    const neededInvestment = neededOffset / project.efficiency;
    const additionalInvestment = neededInvestment - (currentPercent / 100) * company.capacity / project.efficiency;
    
    return Math.max(0, additionalInvestment);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Badge Tier Information */}
      <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Verification Badge Tiers</h2>
        <p className="text-gray-300 text-center mb-8">
          Achieve higher badge levels by increasing your CO₂ offset percentage through strategic investments
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bronze Badge */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-amber-400 transition-all duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-20 h-20">
                <img 
                  src="/image/bronze.png" 
                  alt="Bronze Badge"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-800 flex items-center justify-center text-white font-bold text-3xl shadow-xl';
                    fallback.textContent = '🟤';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-2">Bronze</h3>
                <div className="text-3xl font-bold mb-2">25%</div>
                <p className="text-sm text-gray-300">CO₂ Offset Required</p>
              </div>
              <div className="w-full pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400">Entry level verification for carbon capture initiatives</p>
              </div>
            </div>
          </div>

          {/* Silver Badge */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-gray-400 transition-all duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-20 h-20">
                <img 
                  src="/image/silver.png" 
                  alt="Silver Badge"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl';
                    fallback.textContent = '⚪';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">Silver</h3>
                <div className="text-3xl font-bold mb-2">50%</div>
                <p className="text-sm text-gray-300">CO₂ Offset Required</p>
              </div>
              <div className="w-full pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400">Intermediate verification for committed operators</p>
              </div>
            </div>
          </div>

          {/* Gold Badge */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-yellow-400 transition-all duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-20 h-20">
                <img 
                  src="/image/gold.png" 
                  alt="Gold Badge"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl';
                    fallback.textContent = '🟡';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Gold</h3>
                <div className="text-3xl font-bold mb-2">75%</div>
                <p className="text-sm text-gray-300">CO₂ Offset Required</p>
              </div>
              <div className="w-full pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400">Advanced verification for leading sustainability</p>
              </div>
            </div>
          </div>

          {/* Diamond Badge */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-purple-400 transition-all duration-300 hover:scale-105 relative overflow-hidden">
            {/* Sparkle Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
            
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="relative w-20 h-20">
                <img 
                  src="/image/diamond.png" 
                  alt="Diamond Badge"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl';
                    fallback.textContent = '💎';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Diamond</h3>
                <div className="text-3xl font-bold mb-2">100%</div>
                <p className="text-sm text-gray-300">CO₂ Offset Required</p>
              </div>
              <div className="w-full pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400">Premium verification for carbon neutrality excellence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-2">How Badge Verification Works</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Badge tiers are determined by your CO₂ offset percentage relative to your facility's annual emissions or capture capacity. 
                Invest in verified capture projects to increase your offset percentage and unlock higher badge tiers. 
                Each tier demonstrates your commitment to environmental responsibility and carbon neutrality.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Simulation Interface */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Interactive CO₂ Verification Simulator</h2>
          <p className="text-lg text-gray-600">
            Select a capture company and simulate investments to see how they affect verification badges in real-time
          </p>
        </div>

        {/* Company Selection Panels */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Select CO₂ Capture Company</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {captureCompanies.map((company) => (
              <Card
                key={company.id}
                className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-xl relative ${
                  selectedCompany === company.id
                    ? 'border-4 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-105'
                    : 'border-2 border-gray-200 hover:border-green-300 hover:scale-102'
                }`}
                onClick={() => setSelectedCompany(company.id)}
              >
                {/* Selection Indicator */}
                {selectedCompany === company.id && (
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
                    ✓
                  </div>
                )}

                {/* Company Logo with Diamond Badge */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className={`w-16 h-16 bg-gradient-to-br rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg ${
                      company.type === 'Algae Farm' ? 'from-green-500 to-green-700' :
                      company.type === 'Direct Air Capture' ? 'from-blue-500 to-blue-700' :
                      company.type === 'Forest Conservation' ? 'from-emerald-500 to-emerald-700' :
                      company.type === 'Ocean Enhancement' ? 'from-cyan-500 to-cyan-700' :
                      company.type === 'Soil Sequestration' ? 'from-amber-500 to-amber-700' :
                      'from-teal-500 to-teal-700'
                    }`}>
                      {company.name.charAt(0)}
                    </div>
                    {/* Diamond Badge */}
                    <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full shadow-lg overflow-hidden">
                      <img 
                        src="/image/diamond.png"
                        alt="Diamond badge"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-xs';
                          fallback.textContent = '💎';
                          target.parentNode?.appendChild(fallback);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 mb-1 text-lg truncate">{company.name}</h4>
                    <p className="text-xs text-gray-600 font-medium">{company.type}</p>
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-t border-gray-200">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-bold text-green-600">{formatNumber(company.capacity)} t/yr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold text-gray-900 text-xs">{company.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Efficiency:</span>
                    <span className={`font-semibold text-xs px-2 py-1 rounded ${
                      company.efficiency === 'Very High' ? 'bg-green-100 text-green-700' :
                      company.efficiency === 'High' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {company.efficiency}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 line-clamp-2">{company.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Investment Configuration */}
        <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-l-purple-500">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Configure Investment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Investment Type
              </label>
              <Select
                value={selectedProject.toString()}
                onChange={(e) => setSelectedProject(Number(e.target.value))}
                options={simulationProjects.map(project => ({
                  value: project.id.toString(),
                  label: project.name
                }))}
                className="text-base"
              />
              <p className="text-xs text-gray-500 mt-2">
                Efficiency: {simulationProjects.find(p => p.id === selectedProject)?.efficiency.toFixed(4)} tons/$
              </p>
            </div>
            
            {/* Investment Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Investment Amount ($)
              </label>
              <Input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="text-base"
              />
              <p className="text-xs text-gray-500 mt-2">
                Formatted: ${formatNumber(investmentAmount)}
              </p>
            </div>
            
            {/* Calculate Button */}
            <div className="flex flex-col justify-end">
              <Button
                onClick={calculateSimulation}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  Calculate Impact
                  <ArrowRight size={20} />
                </span>
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Simulation Result */}
        {simulationResult && (
          <Card className="p-6 bg-white border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation Result</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company:</span>
                    <span className="font-semibold">{simulationResult.company.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CO₂ Capacity:</span>
                    <span className="font-semibold">{formatNumber(simulationResult.company.capacity)} tons/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project:</span>
                    <span className="font-semibold">{simulationResult.project.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment:</span>
                    <span className="font-semibold text-green-600">${formatNumber(simulationResult.investment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CO₂ Offset:</span>
                    <span className="font-semibold text-blue-600">{formatNumber(simulationResult.offset)} tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Offset %:</span>
                    <span className="font-semibold text-purple-600">{simulationResult.offsetPercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Earned Badge</h3>
                <div className="text-center">
                  <div className="inline-block mb-4">
                    <div className="relative w-20 h-20 mx-auto">
                      <img 
                        src={getBadgeImage(simulationResult.badge)}
                        alt={`${simulationResult.badge} verification badge`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = `w-full h-full rounded-full bg-gradient-to-r ${getBadgeColor(simulationResult.badge)} flex items-center justify-center text-white font-bold text-lg shadow-lg ${getBadgeGlow(simulationResult.badge)}`;
                          fallback.textContent = getBadgeIcon(simulationResult.badge);
                          target.parentNode?.appendChild(fallback);
                        }}
                      />
                    </div>
                    <div className="text-lg font-bold text-gray-900 mt-2">
                      {simulationResult.badge} Verified
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(simulationResult.offsetPercent, 100)}%` }}
                    ></div>
                  </div>
                  
                  {/* Next Badge Investment */}
                  {simulationResult.badge !== 'Diamond' && (
                    <div className="text-sm text-gray-600">
                      {(() => {
                        const nextInvestment = getNextBadgeInvestment(
                          simulationResult.offsetPercent,
                          simulationResult.company,
                          simulationResult.project
                        );
                        return nextInvestment ? (
                          <span>
                            Invest ${formatNumber(nextInvestment)} more to reach{' '}
                            {simulationResult.badge === 'Bronze' ? 'Silver' : 
                             simulationResult.badge === 'Silver' ? 'Gold' : 'Diamond'} level
                          </span>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Summary Bar */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-l-green-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">🏭</div>
            <div className="text-sm text-gray-600">CO₂ Capture Companies</div>
            <div className="text-lg font-bold text-gray-900">{captureCompanies.length}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🌿</div>
            <div className="text-sm text-gray-600">Total Capture Capacity</div>
            <div className="text-lg font-bold text-green-600">
              {formatNumber(captureCompanies.reduce((sum, c) => sum + c.capacity, 0))} tons/year
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-sm text-gray-600">Average Efficiency</div>
            <div className="text-lg font-bold text-blue-600">
              {(() => {
                const efficiencies = captureCompanies.map(c => c.efficiency);
                const highCount = efficiencies.filter(e => e === 'Very High' || e === 'High').length;
                return `${Math.round((highCount / efficiencies.length) * 100)}% High`
              })()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">💎</div>
            <div className="text-sm text-gray-600">All Verified</div>
            <div className="text-sm font-semibold text-gray-900">
              Diamond Certified Capture Companies
            </div>
          </div>
        </div>
      </Card>

    </div>
  );
};
