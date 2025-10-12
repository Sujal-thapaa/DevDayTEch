/**
 * Type definitions for Data Loader Utility
 */

// Individual data record types
export interface FacilityRecord {
  'Facility Name'?: string;
  facility_name?: string;
  Identifier?: string;
  Year?: number;
  Address?: string;
  'Total CO2'?: number;
  'Total CO2e'?: number;
  'NAICS Code'?: string;
  Basin?: string;
  [key: string]: any;
}

export interface FlareStackRecord {
  'Facility Name'?: string;
  facility_name?: string;
  'Flare ID'?: string;
  Month?: string;
  month?: string;
  Volume?: number;
  Efficiency?: number;
  'CO2 Emissions (t)'?: number;
  co2_emissions?: number;
  [key: string]: any;
}

export interface AtmosphericTankRecord {
  'Facility Name'?: string;
  facility_name?: string;
  Month?: string;
  month?: string;
  Temperature?: number;
  Pressure?: number;
  'CO2 Mole Fraction'?: number;
  'VRU Controls'?: string;
  'Annual CO2 (t)'?: number;
  annual_co2?: number;
  [key: string]: any;
}

export interface BlowdownRecord {
  'Facility Name'?: string;
  facility_name?: string;
  Month?: string;
  month?: string;
  'Equipment Type'?: string;
  'Number of Blowdowns'?: number;
  'Annual CO2 (t)'?: number;
  annual_co2?: number;
  [key: string]: any;
}

export interface TransportRecord {
  'Facility Name'?: string;
  facility_name?: string;
  Month?: string;
  month?: string;
  'Shipment ID'?: string;
  'Batch ID'?: string;
  Mode?: string;
  Distance?: number;
  'CO2 Transported (t)'?: number;
  co2_transported?: number;
  'Leakage Loss'?: number;
  [key: string]: any;
}

export interface SourceRecord {
  'Facility Name'?: string;
  facility_name?: string;
  Month?: string;
  month?: string;
  'Flare Stacks (t)'?: number;
  flare_stacks?: number;
  'Atmospheric Tanks (t)'?: number;
  atmospheric_tanks?: number;
  'Blowdowns (t)'?: number;
  blowdowns?: number;
  'Equip Leaks (t)'?: number;
  equip_leaks?: number;
  'Total CO2'?: number;
  [key: string]: any;
}

export interface InjectionRecord {
  'Facility Name'?: string;
  facility_name?: string;
  Month?: string;
  month?: string;
  'Injection Site ID'?: string;
  'Well ID'?: string;
  'Batch ID'?: string;
  'Injection Rate'?: number;
  'Injected CO2 (t)'?: number;
  injected_co2?: number;
  'Reservoir Type'?: string;
  Pressure?: number;
  Temperature?: number;
  [key: string]: any;
}

export interface StorageRecord {
  'Facility Name'?: string;
  facility_name?: string;
  Month?: string;
  month?: string;
  'Storage Site ID'?: string;
  'Storage Type'?: string;
  'Inflow (t)'?: number;
  inflow?: number;
  'Outflow (t)'?: number;
  outflow?: number;
  'Inventory Start'?: number;
  'Inventory End'?: number;
  'Loss/Boil-off'?: number;
  [key: string]: any;
}

export interface UtilizationRecord {
  'Facility Name'?: string;
  facility_name?: string;
  Month?: string;
  month?: string;
  'Contract ID'?: string;
  'Buyer ID'?: string;
  'Buyer Type'?: string;
  'Quantity Sold (t)'?: number;
  quantity_sold?: number;
  Price?: number;
  Revenue?: number;
  Destination?: string;
  [key: string]: any;
}

export interface EquipLeakRecord {
  'Facility Name'?: string;
  facility_name?: string;
  'Emission Source Type'?: string;
  Region?: string;
  Count?: number;
  'Operational Hours'?: number;
  'Annual CO2 Emissions (t)'?: number;
  annual_co2?: number;
  [key: string]: any;
}

// Aggregated data types
export interface AllFacilityData {
  facilities: FacilityRecord[];
  flareStacks: FlareStackRecord[];
  atmosphericTanks: AtmosphericTankRecord[];
  blowdowns: BlowdownRecord[];
  transport: TransportRecord[];
  bySource: SourceRecord[];
  injection: InjectionRecord[];
  storage: StorageRecord[];
  utilization: UtilizationRecord[];
  equipLeaks: EquipLeakRecord[];
  metadata: {
    totalRecords: number;
    loadedAt: string;
  };
}

export interface MergedFacilityData {
  facilityName: string;
  info: FacilityRecord;
  flares: FlareStackRecord[];
  tanks: AtmosphericTankRecord[];
  blowdowns: BlowdownRecord[];
  transport: TransportRecord[];
  sources: SourceRecord[];
  injection: InjectionRecord[];
  storage: StorageRecord[];
  utilization: UtilizationRecord[];
  leaks: EquipLeakRecord[];
  summary: {
    totalFlareRecords: number;
    totalTankRecords: number;
    totalBlowdownRecords: number;
    totalTransportRecords: number;
    totalSourceRecords: number;
    totalInjectionRecords: number;
    totalStorageRecords: number;
    totalUtilizationRecords: number;
    totalLeaksRecords: number;
  };
}

export interface MonthlyAggregation {
  month: string;
  flareEmissions: number;
  tankEmissions: number;
  blowdownEmissions: number;
  transportEmissions: number;
  injectedCO2: number;
  storedCO2: number;
  utilizedCO2: number;
  leaksEmissions: number;
  totalEmissions: number;
  facilityCount: number;
  facilities: string[];
}

export interface EmissionsSummary {
  totalFacilities: number;
  totalFlareEmissions: number;
  totalTankEmissions: number;
  totalBlowdownEmissions: number;
  totalTransported: number;
  totalInjected: number;
  totalStored: number;
  totalUtilized: number;
  totalLeaks: number;
  totalEmissions: number;
  totalCaptured: number;
}

export interface FacilityRanking {
  facilityName: string;
  totalEmissions: number;
  info: FacilityRecord;
  recordCounts: {
    totalFlareRecords: number;
    totalTankRecords: number;
    totalBlowdownRecords: number;
    totalTransportRecords: number;
    totalSourceRecords: number;
    totalInjectionRecords: number;
    totalStorageRecords: number;
    totalUtilizationRecords: number;
    totalLeaksRecords: number;
  };
}

export interface EmissionsBySource {
  sources: {
    flareStacks: number;
    atmosphericTanks: number;
    blowdowns: number;
    equipmentLeaks: number;
    transport: number;
    other: number;
  };
  total: number;
  percentages: {
    flareStacks: string;
    atmosphericTanks: string;
    blowdowns: string;
    equipmentLeaks: string;
    transport: string;
    other: string;
  };
}

// Function signatures
export function loadAllFacilityData(): Promise<AllFacilityData>;
export function getAllFacilityNames(allData: AllFacilityData): string[];
export function mergeByFacility(allData: AllFacilityData, facilityName: string): MergedFacilityData;
export function aggregateByMonth(allData: AllFacilityData): MonthlyAggregation[];
export function getTotalEmissionsSummary(allData: AllFacilityData): EmissionsSummary;
export function getFacilityRankings(allData: AllFacilityData, limit?: number): FacilityRanking[];
export function getEmissionsBySource(allData: AllFacilityData): EmissionsBySource;
export function searchFacilities(allData: AllFacilityData, searchTerm: string): string[];
export function exportToCSV(data: any[], columns?: string[]): string;

// Default export
declare const dataLoader: {
  loadAllFacilityData: typeof loadAllFacilityData;
  getAllFacilityNames: typeof getAllFacilityNames;
  mergeByFacility: typeof mergeByFacility;
  aggregateByMonth: typeof aggregateByMonth;
  getTotalEmissionsSummary: typeof getTotalEmissionsSummary;
  getFacilityRankings: typeof getFacilityRankings;
  getEmissionsBySource: typeof getEmissionsBySource;
  searchFacilities: typeof searchFacilities;
  exportToCSV: typeof exportToCSV;
};

export default dataLoader;

