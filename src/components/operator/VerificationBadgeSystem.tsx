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

const initialCompanies: Company[] = [
  {
    id: 1,
    name: "Bayou Carbon Industries",
    logo: "/logos/bayou.png",
    emission: 120000,
    offsetProjects: [
      { type: "Algae Farm Investment", value: 30000 },
      { type: "Tree Plantation", value: 15000 },
    ],
  },
  {
    id: 2,
    name: "Pelican Energy Co.",
    logo: "/logos/pelican.png",
    emission: 80000,
    offsetProjects: [
      { type: "Carbon Capture Company", value: 80000 },
    ],
  },
  {
    id: 3,
    name: "Gulf Petrochem Corp",
    logo: "/logos/gulf.png",
    emission: 150000,
    offsetProjects: [
      { type: "Tree Plantation", value: 75000 },
      { type: "Carbon Sequestration Partnership", value: 25000 },
    ],
  },
  {
    id: 4,
    name: "Louisiana Refining Ltd",
    logo: "/logos/louisiana.png",
    emission: 200000,
    offsetProjects: [
      { type: "Direct Air Capture", value: 120000 },
      { type: "Ocean Alkalinity Enhancement", value: 30000 },
    ],
  },
  {
    id: 5,
    name: "Mississippi Chemical Co",
    logo: "/logos/mississippi.png",
    emission: 95000,
    offsetProjects: [
      { type: "Forest Conservation", value: 40000 },
      { type: "Soil Carbon Sequestration", value: 15000 },
    ],
  },
  {
    id: 6,
    name: "Atchafalaya Energy Group",
    logo: "/logos/atchafalaya.png",
    emission: 180000,
    offsetProjects: [
      { type: "Blue Carbon Projects", value: 90000 },
      { type: "Wetland Restoration", value: 45000 },
    ],
  },
];

const investmentOptions = [
  { type: "Algae Farm Investment", value: 25000, icon: "🌿", description: "Invest in algae carbon capture" },
  { type: "Tree Plantation", value: 20000, icon: "🌲", description: "Plant 10,000 trees" },
  { type: "Carbon Capture Company", value: 50000, icon: "⚙️", description: "Partner with capture firm" },
  { type: "Direct Air Capture", value: 75000, icon: "🌪️", description: "Direct air capture technology" },
  { type: "Ocean Alkalinity Enhancement", value: 30000, icon: "🌊", description: "Ocean-based carbon removal" },
  { type: "Forest Conservation", value: 35000, icon: "🌳", description: "Protect existing forests" },
  { type: "Soil Carbon Sequestration", value: 15000, icon: "🌱", description: "Enhance soil carbon storage" },
  { type: "Blue Carbon Projects", value: 40000, icon: "🐚", description: "Coastal ecosystem restoration" },
  { type: "Wetland Restoration", value: 25000, icon: "🦆", description: "Restore wetland ecosystems" },
];

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
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond'>('All');
  const [animationKey, setAnimationKey] = useState(0);
  
  // Interactive simulation state
  const [selectedCompany, setSelectedCompany] = useState<number>(1);
  const [selectedProject, setSelectedProject] = useState<number>(1);
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000000);
  const [simulationResult, setSimulationResult] = useState<{
    company: typeof simulationCompanies[0];
    project: typeof simulationProjects[0];
    investment: number;
    offset: number;
    offsetPercent: number;
    badge: CompanyWithBadge['badge'];
  } | null>(null);

  const companiesWithBadges: CompanyWithBadge[] = companies.map(company => {
    const totalOffset = company.offsetProjects.reduce((a, p) => a + p.value, 0);
    const offsetPercent = Math.min((totalOffset / company.emission) * 100, 100);
    const investment = totalOffset * 20; // $20 per ton
    const badge = calculateBadge(offsetPercent);
    
    return {
      ...company,
      totalOffset,
      offsetPercent,
      investment,
      badge,
    };
  });

  const filteredCompanies = selectedFilter === 'All' 
    ? companiesWithBadges 
    : companiesWithBadges.filter(company => company.badge === selectedFilter);

  const totalEmission = companies.reduce((sum, company) => sum + company.emission, 0);
  const totalOffset = companiesWithBadges.reduce((sum, company) => sum + company.totalOffset, 0);
  const totalInvestment = companiesWithBadges.reduce((sum, company) => sum + company.investment, 0);
  const overallOffsetPercent = (totalOffset / totalEmission) * 100;

  const badgeCounts = companiesWithBadges.reduce((counts, company) => {
    counts[company.badge] = (counts[company.badge] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const handleInvestment = (companyId: number, investmentType: string, value: number) => {
    setCompanies(prevCompanies => 
      prevCompanies.map(company => 
        company.id === companyId 
          ? {
              ...company,
              offsetProjects: [
                ...company.offsetProjects,
                { type: investmentType, value }
              ]
            }
          : company
      )
    );
    
    // Trigger animation
    setAnimationKey(prev => prev + 1);
  };

  // Interactive simulation functions
  const calculateSimulation = () => {
    const company = simulationCompanies.find(c => c.id === selectedCompany);
    const project = simulationProjects.find(p => p.id === selectedProject);
    
    if (!company || !project) return;
    
    const offset = investmentAmount * project.efficiency;
    const offsetPercent = (offset / company.emission) * 100;
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

  const getNextBadgeInvestment = (currentPercent: number, company: typeof simulationCompanies[0], project: typeof simulationProjects[0]) => {
    const thresholds = [25, 50, 75, 100];
    const nextThreshold = thresholds.find(t => t > currentPercent);
    
    if (!nextThreshold) return null;
    
    const neededOffset = (nextThreshold / 100) * company.emission;
    const neededInvestment = neededOffset / project.efficiency;
    const additionalInvestment = neededInvestment - (currentPercent / 100) * company.emission / project.efficiency;
    
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
              Select Company
            </label>
            <Select
              value={selectedCompany.toString()}
              onChange={(e) => setSelectedCompany(Number(e.target.value))}
              options={simulationCompanies.map(company => ({
                value: company.id.toString(),
                label: company.name
              }))}
            />
          </div>
          
          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Project Type
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
              Calculate Badge
            </Button>
          </div>
        </div>
        
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
                    <span className="text-gray-600">CO₂ Emitted:</span>
                    <span className="font-semibold">{formatNumber(simulationResult.company.emission)} tons</span>
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
                  <div className={`inline-block px-6 py-4 rounded-full bg-gradient-to-r ${getBadgeColor(simulationResult.badge)} text-white font-bold text-xl shadow-lg ${getBadgeGlow(simulationResult.badge)} mb-4`}>
                    <span className="mr-2">{getBadgeIcon(simulationResult.badge)}</span>
                    {simulationResult.badge} Verified
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
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-l-blue-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">🌎</div>
            <div className="text-sm text-gray-600">Total CO₂ Emission</div>
            <div className="text-lg font-bold text-gray-900">{formatNumber(totalEmission)} tons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🌿</div>
            <div className="text-sm text-gray-600">Total Offset</div>
            <div className="text-lg font-bold text-green-600">
              {formatNumber(totalOffset)} tons ({overallOffsetPercent.toFixed(1)}%)
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-sm text-gray-600">Total Investment</div>
            <div className="text-lg font-bold text-blue-600">${formatNumber(totalInvestment)}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">💎</div>
            <div className="text-sm text-gray-600">Verified Companies</div>
            <div className="text-sm font-semibold text-gray-900">
              {badgeCounts.Diamond || 0} Diamond, {badgeCounts.Gold || 0} Gold, {badgeCounts.Silver || 0} Silver, {badgeCounts.Bronze || 0} Bronze
            </div>
          </div>
        </div>
      </Card>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedFilter('All')}
          variant={selectedFilter === 'All' ? 'primary' : 'secondary'}
          size="sm"
        >
          All Companies
        </Button>
        {(['Bronze', 'Silver', 'Gold', 'Diamond'] as const).map(badge => (
          <Button
            key={badge}
            onClick={() => setSelectedFilter(badge)}
            variant={selectedFilter === badge ? 'primary' : 'secondary'}
            size="sm"
            className="flex items-center gap-1"
          >
            {getBadgeIcon(badge)} {badge}
          </Button>
        ))}
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card 
            key={`${company.id}-${animationKey}`} 
            className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500"
          >
            {/* Company Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {company.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{company.name}</h3>
                <div className="text-sm text-gray-500">CO₂ Emission: {formatNumber(company.emission)} tons/year</div>
              </div>
            </div>

            {/* Badge Display */}
            <div className="flex items-center justify-center mb-4">
              <div className={`relative px-4 py-2 rounded-full bg-gradient-to-r ${getBadgeColor(company.badge)} text-white font-bold text-lg shadow-lg ${getBadgeGlow(company.badge)}`}>
                <span className="mr-2">{getBadgeIcon(company.badge)}</span>
                {company.badge} Verified
                {company.badge === 'Diamond' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Offset Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Offset Progress</span>
                <span className="font-semibold text-green-600">
                  {formatNumber(company.totalOffset)} tons ({company.offsetPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(company.offsetPercent, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Investment Amount */}
            <div className="text-center mb-4">
              <div className="text-sm text-gray-600">Total Investment</div>
              <div className="text-xl font-bold text-blue-600">${formatNumber(company.investment)}</div>
            </div>

            {/* Investment Options */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 mb-2">Quick Investment Options:</div>
              {investmentOptions.slice(0, 3).map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleInvestment(company.id, option.type, option.value)}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.description}
                  <span className="ml-auto text-xs text-gray-500">+{formatNumber(option.value)} tons</span>
                </Button>
              ))}
            </div>

            {/* Offset Projects List */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Current Projects:</div>
              <div className="space-y-1">
                {company.offsetProjects.map((project, index) => (
                  <div key={index} className="flex justify-between text-xs text-gray-600">
                    <span>{project.type}</span>
                    <span>{formatNumber(project.value)} tons</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600">No companies match the selected filter criteria.</p>
        </Card>
      )}
    </div>
  );
};
