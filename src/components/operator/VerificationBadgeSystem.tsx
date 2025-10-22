import React, { useState } from 'react';
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
      {/* Interactive Simulation Interface */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-l-purple-500">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          🧮 Interactive CO₂ Verification Simulator
        </h2>
        <p className="text-gray-600 mb-6">
          Simulate investments and see how they affect verification badges in real-time
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Company Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CO₂ Capture Company
            </label>
            <Select
              value={selectedCompany.toString()}
              onChange={(e) => setSelectedCompany(Number(e.target.value))}
              options={captureCompanies.map(company => ({
                value: company.id.toString(),
                label: company.name
              }))}
            />
          </div>
          
          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Investment Type
            </label>
            <Select
              value={selectedProject.toString()}
              onChange={(e) => setSelectedProject(Number(e.target.value))}
              options={simulationProjects.map(project => ({
                value: project.id.toString(),
                label: project.name
              }))}
            />
          </div>
          
          {/* Investment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount ($)
            </label>
            <Input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
          </div>
          
          {/* Calculate Button */}
          <div className="flex items-end">
            <Button
              onClick={calculateSimulation}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Calculate Impact
            </Button>
          </div>
        </div>
        
        {/* Company Details Panel */}
        {(() => {
          const selectedCompanyData = captureCompanies.find(c => c.id === selectedCompany);
          return selectedCompanyData && (
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-l-green-500 mb-6">
              <div className="flex items-start gap-4">
                {/* Company Logo with Diamond Badge */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedCompanyData.name.charAt(0)}
                  </div>
                  {/* Diamond Badge */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full shadow-lg overflow-hidden">
                    <img 
                      src="/image/diamond.png"
                      alt="Diamond verification badge"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold';
                        fallback.textContent = '💎';
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                  </div>
                </div>
                
                {/* Company Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedCompanyData.name}</h3>
                  <p className="text-gray-600 mb-3">{selectedCompanyData.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <div className="font-semibold text-gray-900">{selectedCompanyData.type}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Capacity:</span>
                      <div className="font-semibold text-green-600">{formatNumber(selectedCompanyData.capacity)} tons/year</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <div className="font-semibold text-gray-900">{selectedCompanyData.location}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Efficiency:</span>
                      <div className="font-semibold text-blue-600">{selectedCompanyData.efficiency}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Founded:</span>
                      <div className="font-semibold text-gray-900">{selectedCompanyData.founded}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Employees:</span>
                      <div className="font-semibold text-gray-900">{selectedCompanyData.employees}</div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Technology:</span>
                      <div className="font-semibold text-gray-900">{selectedCompanyData.technology}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })()}
        
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
      </Card>

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
