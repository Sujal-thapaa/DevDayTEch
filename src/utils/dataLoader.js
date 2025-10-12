/**
 * Data Loader Utility for CO2 Emissions Data
 * 
 * This utility loads and processes data from multiple JSON files in ./data/Operator Side/
 * and provides functions to merge, aggregate, and analyze the data.
 */

// Base path for data files
const DATA_PATH = '/data/Operator SIde/';

/**
 * Load a single JSON file with error handling
 * @param {string} filename - Name of the file to load
 * @returns {Promise<Array>} - Parsed JSON data or empty array on error
 */
async function loadJSONFile(filename) {
  try {
    const response = await fetch(`${DATA_PATH}${filename}`);
    if (!response.ok) {
      console.warn(`⚠️ Could not load ${filename}: ${response.status}`);
      return [];
    }
    const data = await response.json();
    console.log(`✅ Loaded ${filename}: ${data.length} records`);
    return data;
  } catch (error) {
    console.error(`❌ Error loading ${filename}:`, error);
    return [];
  }
}

/**
 * Load all facility data from all JSON files
 * @returns {Promise<Object>} - Object containing all datasets
 */
export async function loadAllFacilityData() {
  console.log('🔄 Loading all facility data...');
  
  const [
    facilities,
    flareStacks,
    atmosphericTanks,
    blowdowns,
    transport,
    bySource,
    injection,
    storage,
    utilization,
    equipLeaks
  ] = await Promise.all([
    loadJSONFile('Facility2.json'),
    loadJSONFile('FlareStacks.json'),
    loadJSONFile('AtmospericTank.json'),
    loadJSONFile('BlowDowns.json'),
    loadJSONFile('C02_Transport.json'),
    loadJSONFile('CO2_by_Source.json'),
    loadJSONFile('CO2_Injection.json'),
    loadJSONFile('CO2_storage.json'),
    loadJSONFile('CO2_Utilization.json'),
    loadJSONFile('EquipLeaks.json')
  ]);

  const result = {
    facilities,
    flareStacks,
    atmosphericTanks,
    blowdowns,
    transport,
    bySource,
    injection,
    storage,
    utilization,
    equipLeaks,
    metadata: {
      totalRecords: facilities.length + flareStacks.length + atmosphericTanks.length + 
                    blowdowns.length + transport.length + bySource.length + 
                    injection.length + storage.length + utilization.length + equipLeaks.length,
      loadedAt: new Date().toISOString()
    }
  };

  console.log('✅ All data loaded successfully');
  console.log(`📊 Total records: ${result.metadata.totalRecords}`);
  
  return result;
}

/**
 * Get list of all unique facility names across all datasets
 * @param {Object} allData - Data from loadAllFacilityData()
 * @returns {Array<string>} - Array of unique facility names
 */
export function getAllFacilityNames(allData) {
  const facilityNames = new Set();
  
  // Extract from each dataset
  if (allData.facilities) {
    allData.facilities.forEach(f => facilityNames.add(f['Facility Name'] || f.facility_name));
  }
  if (allData.flareStacks) {
    allData.flareStacks.forEach(f => facilityNames.add(f['Facility Name'] || f.facility_name));
  }
  if (allData.atmosphericTanks) {
    allData.atmosphericTanks.forEach(f => facilityNames.add(f['Facility Name'] || f.facility_name));
  }
  if (allData.blowdowns) {
    allData.blowdowns.forEach(f => facilityNames.add(f['Facility Name'] || f.facility_name));
  }
  if (allData.transport) {
    allData.transport.forEach(f => facilityNames.add(f['Facility Name'] || f.facility_name));
  }
  if (allData.bySource) {
    allData.bySource.forEach(f => facilityNames.add(f['Facility Name'] || f.facility_name));
  }
  if (allData.injection) {
    allData.injection.forEach(f => facilityNames.add(f['Facility Name'] || f.facility_name));
  }
  if (allData.storage) {
    allData.storage.forEach(f => facilityNames.add(f['Facility Name'] || f.facility_name));
  }
  if (allData.utilization) {
    allData.utilization.forEach(f => facilityNames.add(f['Facility Name'] || f.facility_name));
  }
  if (allData.equipLeaks) {
    allData.equipLeaks.forEach(f => facilityNames.add(f['Facility Name'] || f.facility_name));
  }
  
  return Array.from(facilityNames).filter(Boolean).sort();
}

/**
 * Merge all data for a specific facility
 * @param {Object} allData - Data from loadAllFacilityData()
 * @param {string} facilityName - Name of the facility
 * @returns {Object} - Merged facility data
 */
export function mergeByFacility(allData, facilityName) {
  const facilityInfo = allData.facilities?.find(
    f => (f['Facility Name'] || f.facility_name) === facilityName
  ) || {};

  const flareData = allData.flareStacks?.filter(
    f => (f['Facility Name'] || f.facility_name) === facilityName
  ) || [];

  const tankData = allData.atmosphericTanks?.filter(
    f => (f['Facility Name'] || f.facility_name) === facilityName
  ) || [];

  const blowdownData = allData.blowdowns?.filter(
    f => (f['Facility Name'] || f.facility_name) === facilityName
  ) || [];

  const transportData = allData.transport?.filter(
    f => (f['Facility Name'] || f.facility_name) === facilityName
  ) || [];

  const sourceData = allData.bySource?.filter(
    f => (f['Facility Name'] || f.facility_name) === facilityName
  ) || [];

  const injectionData = allData.injection?.filter(
    f => (f['Facility Name'] || f.facility_name) === facilityName
  ) || [];

  const storageData = allData.storage?.filter(
    f => (f['Facility Name'] || f.facility_name) === facilityName
  ) || [];

  const utilizationData = allData.utilization?.filter(
    f => (f['Facility Name'] || f.facility_name) === facilityName
  ) || [];

  const leaksData = allData.equipLeaks?.filter(
    f => (f['Facility Name'] || f.facility_name) === facilityName
  ) || [];

  return {
    facilityName,
    info: facilityInfo,
    flares: flareData,
    tanks: tankData,
    blowdowns: blowdownData,
    transport: transportData,
    sources: sourceData,
    injection: injectionData,
    storage: storageData,
    utilization: utilizationData,
    leaks: leaksData,
    summary: {
      totalFlareRecords: flareData.length,
      totalTankRecords: tankData.length,
      totalBlowdownRecords: blowdownData.length,
      totalTransportRecords: transportData.length,
      totalSourceRecords: sourceData.length,
      totalInjectionRecords: injectionData.length,
      totalStorageRecords: storageData.length,
      totalUtilizationRecords: utilizationData.length,
      totalLeaksRecords: leaksData.length
    }
  };
}

/**
 * Aggregate data by month across all facilities
 * @param {Object} allData - Data from loadAllFacilityData()
 * @returns {Object} - Monthly aggregated data
 */
export function aggregateByMonth(allData) {
  const monthlyData = {};

  // Helper function to add to monthly totals
  const addToMonth = (month, category, value) => {
    if (!month) return;
    if (!monthlyData[month]) {
      monthlyData[month] = {
        month,
        flareEmissions: 0,
        tankEmissions: 0,
        blowdownEmissions: 0,
        transportEmissions: 0,
        injectedCO2: 0,
        storedCO2: 0,
        utilizedCO2: 0,
        leaksEmissions: 0,
        totalEmissions: 0,
        facilityCount: 0,
        facilities: new Set()
      };
    }
    monthlyData[month][category] = (monthlyData[month][category] || 0) + (value || 0);
  };

  // Aggregate flare stacks
  if (allData.flareStacks) {
    allData.flareStacks.forEach(record => {
      const month = record.Month || record.month;
      const emissions = parseFloat(record['CO2 Emissions (t)'] || record.co2_emissions || 0);
      addToMonth(month, 'flareEmissions', emissions);
      addToMonth(month, 'totalEmissions', emissions);
      if (month && monthlyData[month]) {
        monthlyData[month].facilities.add(record['Facility Name'] || record.facility_name);
      }
    });
  }

  // Aggregate atmospheric tanks
  if (allData.atmosphericTanks) {
    allData.atmosphericTanks.forEach(record => {
      const month = record.Month || record.month;
      const emissions = parseFloat(record['Annual CO2 (t)'] || record.annual_co2 || 0);
      addToMonth(month, 'tankEmissions', emissions);
      addToMonth(month, 'totalEmissions', emissions);
      if (month && monthlyData[month]) {
        monthlyData[month].facilities.add(record['Facility Name'] || record.facility_name);
      }
    });
  }

  // Aggregate blowdowns
  if (allData.blowdowns) {
    allData.blowdowns.forEach(record => {
      const month = record.Month || record.month;
      const emissions = parseFloat(record['Annual CO2 (t)'] || record.annual_co2 || 0);
      addToMonth(month, 'blowdownEmissions', emissions);
      addToMonth(month, 'totalEmissions', emissions);
      if (month && monthlyData[month]) {
        monthlyData[month].facilities.add(record['Facility Name'] || record.facility_name);
      }
    });
  }

  // Aggregate transport
  if (allData.transport) {
    allData.transport.forEach(record => {
      const month = record.Month || record.month;
      const transported = parseFloat(record['CO2 Transported (t)'] || record.co2_transported || 0);
      addToMonth(month, 'transportEmissions', transported);
      if (month && monthlyData[month]) {
        monthlyData[month].facilities.add(record['Facility Name'] || record.facility_name);
      }
    });
  }

  // Aggregate injection
  if (allData.injection) {
    allData.injection.forEach(record => {
      const month = record.Month || record.month;
      const injected = parseFloat(record['Injected CO2 (t)'] || record.injected_co2 || 0);
      addToMonth(month, 'injectedCO2', injected);
      if (month && monthlyData[month]) {
        monthlyData[month].facilities.add(record['Facility Name'] || record.facility_name);
      }
    });
  }

  // Aggregate storage
  if (allData.storage) {
    allData.storage.forEach(record => {
      const month = record.Month || record.month;
      const inflow = parseFloat(record['Inflow (t)'] || record.inflow || 0);
      addToMonth(month, 'storedCO2', inflow);
      if (month && monthlyData[month]) {
        monthlyData[month].facilities.add(record['Facility Name'] || record.facility_name);
      }
    });
  }

  // Aggregate utilization
  if (allData.utilization) {
    allData.utilization.forEach(record => {
      const month = record.Month || record.month;
      const quantity = parseFloat(record['Quantity Sold (t)'] || record.quantity_sold || 0);
      addToMonth(month, 'utilizedCO2', quantity);
      if (month && monthlyData[month]) {
        monthlyData[month].facilities.add(record['Facility Name'] || record.facility_name);
      }
    });
  }

  // Aggregate equipment leaks
  if (allData.equipLeaks) {
    allData.equipLeaks.forEach(record => {
      const emissions = parseFloat(record['Annual CO2 Emissions (t)'] || record.annual_co2 || 0);
      // Equipment leaks might not have month, distribute evenly or add to total
      Object.keys(monthlyData).forEach(month => {
        addToMonth(month, 'leaksEmissions', emissions / 12); // Distribute evenly
      });
    });
  }

  // Convert Set to count and clean up
  const result = Object.values(monthlyData).map(data => ({
    ...data,
    facilityCount: data.facilities.size,
    facilities: Array.from(data.facilities)
  }));

  // Sort by month
  result.sort((a, b) => a.month.localeCompare(b.month));

  return result;
}

/**
 * Get total emissions summary across all facilities
 * @param {Object} allData - Data from loadAllFacilityData()
 * @returns {Object} - Total emissions summary
 */
export function getTotalEmissionsSummary(allData) {
  const summary = {
    totalFacilities: 0,
    totalFlareEmissions: 0,
    totalTankEmissions: 0,
    totalBlowdownEmissions: 0,
    totalTransported: 0,
    totalInjected: 0,
    totalStored: 0,
    totalUtilized: 0,
    totalLeaks: 0,
    totalEmissions: 0,
    totalCaptured: 0
  };

  // Sum flare emissions
  if (allData.flareStacks) {
    allData.flareStacks.forEach(record => {
      summary.totalFlareEmissions += parseFloat(record['CO2 Emissions (t)'] || record.co2_emissions || 0);
    });
  }

  // Sum tank emissions
  if (allData.atmosphericTanks) {
    allData.atmosphericTanks.forEach(record => {
      summary.totalTankEmissions += parseFloat(record['Annual CO2 (t)'] || record.annual_co2 || 0);
    });
  }

  // Sum blowdown emissions
  if (allData.blowdowns) {
    allData.blowdowns.forEach(record => {
      summary.totalBlowdownEmissions += parseFloat(record['Annual CO2 (t)'] || record.annual_co2 || 0);
    });
  }

  // Sum transported
  if (allData.transport) {
    allData.transport.forEach(record => {
      summary.totalTransported += parseFloat(record['CO2 Transported (t)'] || record.co2_transported || 0);
    });
  }

  // Sum injected
  if (allData.injection) {
    allData.injection.forEach(record => {
      summary.totalInjected += parseFloat(record['Injected CO2 (t)'] || record.injected_co2 || 0);
    });
  }

  // Sum stored
  if (allData.storage) {
    allData.storage.forEach(record => {
      summary.totalStored += parseFloat(record['Inflow (t)'] || record.inflow || 0);
    });
  }

  // Sum utilized
  if (allData.utilization) {
    allData.utilization.forEach(record => {
      summary.totalUtilized += parseFloat(record['Quantity Sold (t)'] || record.quantity_sold || 0);
    });
  }

  // Sum leaks
  if (allData.equipLeaks) {
    allData.equipLeaks.forEach(record => {
      summary.totalLeaks += parseFloat(record['Annual CO2 Emissions (t)'] || record.annual_co2 || 0);
    });
  }

  summary.totalFacilities = getAllFacilityNames(allData).length;
  summary.totalEmissions = summary.totalFlareEmissions + summary.totalTankEmissions + 
                           summary.totalBlowdownEmissions + summary.totalLeaks;
  summary.totalCaptured = summary.totalInjected + summary.totalStored;

  return summary;
}

/**
 * Get facility rankings by total emissions
 * @param {Object} allData - Data from loadAllFacilityData()
 * @param {number} limit - Number of top facilities to return (default: 10)
 * @returns {Array} - Array of facilities sorted by emissions
 */
export function getFacilityRankings(allData, limit = 10) {
  const facilityNames = getAllFacilityNames(allData);
  const rankings = [];

  facilityNames.forEach(facilityName => {
    const facilityData = mergeByFacility(allData, facilityName);
    
    // Calculate total emissions for this facility
    let totalEmissions = 0;
    
    // Sum from all sources
    if (facilityData.flares) {
      facilityData.flares.forEach(record => {
        totalEmissions += parseFloat(record['CO2 Emissions (t)'] || record.co2_emissions || 0);
      });
    }
    
    if (facilityData.tanks) {
      facilityData.tanks.forEach(record => {
        totalEmissions += parseFloat(record['Annual CO2 (t)'] || record.annual_co2 || 0);
      });
    }
    
    if (facilityData.blowdowns) {
      facilityData.blowdowns.forEach(record => {
        totalEmissions += parseFloat(record['Annual CO2 (t)'] || record.annual_co2 || 0);
      });
    }
    
    if (facilityData.leaks) {
      facilityData.leaks.forEach(record => {
        totalEmissions += parseFloat(record['Annual CO2 Emissions (t)'] || record.annual_co2 || 0);
      });
    }

    rankings.push({
      facilityName,
      totalEmissions,
      info: facilityData.info,
      recordCounts: facilityData.summary
    });
  });

  // Sort by total emissions descending
  rankings.sort((a, b) => b.totalEmissions - a.totalEmissions);

  return rankings.slice(0, limit);
}

/**
 * Get emissions by source type
 * @param {Object} allData - Data from loadAllFacilityData()
 * @returns {Object} - Emissions breakdown by source
 */
export function getEmissionsBySource(allData) {
  const sources = {
    flareStacks: 0,
    atmosphericTanks: 0,
    blowdowns: 0,
    equipmentLeaks: 0,
    transport: 0,
    other: 0
  };

  if (allData.bySource) {
    allData.bySource.forEach(record => {
      sources.flareStacks += parseFloat(record['Flare Stacks (t)'] || record.flare_stacks || 0);
      sources.atmosphericTanks += parseFloat(record['Atmospheric Tanks (t)'] || record.atmospheric_tanks || 0);
      sources.blowdowns += parseFloat(record['Blowdowns (t)'] || record.blowdowns || 0);
      sources.equipmentLeaks += parseFloat(record['Equip Leaks (t)'] || record.equip_leaks || 0);
    });
  }

  const total = Object.values(sources).reduce((sum, val) => sum + val, 0);

  return {
    sources,
    total,
    percentages: {
      flareStacks: total > 0 ? ((sources.flareStacks / total) * 100).toFixed(2) : 0,
      atmosphericTanks: total > 0 ? ((sources.atmosphericTanks / total) * 100).toFixed(2) : 0,
      blowdowns: total > 0 ? ((sources.blowdowns / total) * 100).toFixed(2) : 0,
      equipmentLeaks: total > 0 ? ((sources.equipmentLeaks / total) * 100).toFixed(2) : 0,
      transport: total > 0 ? ((sources.transport / total) * 100).toFixed(2) : 0,
      other: total > 0 ? ((sources.other / total) * 100).toFixed(2) : 0
    }
  };
}

/**
 * Search facilities by name or other criteria
 * @param {Object} allData - Data from loadAllFacilityData()
 * @param {string} searchTerm - Search term
 * @returns {Array} - Array of matching facilities
 */
export function searchFacilities(allData, searchTerm) {
  if (!searchTerm || searchTerm.trim() === '') {
    return getAllFacilityNames(allData);
  }

  const term = searchTerm.toLowerCase();
  const facilityNames = getAllFacilityNames(allData);
  
  return facilityNames.filter(name => 
    name.toLowerCase().includes(term)
  );
}

/**
 * Export aggregated data as CSV format
 * @param {Array} data - Array of data objects
 * @param {Array} columns - Array of column names
 * @returns {string} - CSV formatted string
 */
export function exportToCSV(data, columns) {
  if (!data || data.length === 0) return '';
  
  const headers = columns || Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values with commas
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
}

// Default export
export default {
  loadAllFacilityData,
  getAllFacilityNames,
  mergeByFacility,
  aggregateByMonth,
  getTotalEmissionsSummary,
  getFacilityRankings,
  getEmissionsBySource,
  searchFacilities,
  exportToCSV
};

