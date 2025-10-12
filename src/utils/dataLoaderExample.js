/**
 * Example Usage of Data Loader Utility
 * 
 * This file demonstrates how to use the dataLoader functions
 */

import {
  loadAllFacilityData,
  getAllFacilityNames,
  mergeByFacility,
  aggregateByMonth,
  getTotalEmissionsSummary,
  getFacilityRankings,
  getEmissionsBySource,
  searchFacilities,
  exportToCSV
} from './dataLoader';

/**
 * Example 1: Load all data
 */
export async function example1_LoadAllData() {
  console.log('=== Example 1: Load All Data ===');
  const allData = await loadAllFacilityData();
  console.log('Metadata:', allData.metadata);
  console.log('Total facilities:', allData.facilities.length);
  console.log('Total flare records:', allData.flareStacks.length);
  return allData;
}

/**
 * Example 2: Get all facility names
 */
export async function example2_GetFacilityNames() {
  console.log('=== Example 2: Get All Facility Names ===');
  const allData = await loadAllFacilityData();
  const facilityNames = getAllFacilityNames(allData);
  console.log(`Found ${facilityNames.length} unique facilities:`);
  console.log(facilityNames.slice(0, 5)); // Show first 5
  return facilityNames;
}

/**
 * Example 3: Merge data for a specific facility
 */
export async function example3_MergeFacilityData(facilityName) {
  console.log('=== Example 3: Merge Facility Data ===');
  const allData = await loadAllFacilityData();
  
  // If no facility name provided, use the first one
  if (!facilityName) {
    const names = getAllFacilityNames(allData);
    facilityName = names[0];
  }
  
  const facilityData = mergeByFacility(allData, facilityName);
  console.log(`Data for ${facilityName}:`);
  console.log('Summary:', facilityData.summary);
  console.log('Flare records:', facilityData.flares.length);
  console.log('Injection records:', facilityData.injection.length);
  return facilityData;
}

/**
 * Example 4: Aggregate data by month
 */
export async function example4_AggregateByMonth() {
  console.log('=== Example 4: Aggregate By Month ===');
  const allData = await loadAllFacilityData();
  const monthlyData = aggregateByMonth(allData);
  console.log(`Monthly data for ${monthlyData.length} months:`);
  console.log('First 3 months:', monthlyData.slice(0, 3));
  return monthlyData;
}

/**
 * Example 5: Get total emissions summary
 */
export async function example5_GetTotalSummary() {
  console.log('=== Example 5: Get Total Emissions Summary ===');
  const allData = await loadAllFacilityData();
  const summary = getTotalEmissionsSummary(allData);
  console.log('Total Emissions Summary:');
  console.log(`  Total Facilities: ${summary.totalFacilities}`);
  console.log(`  Total Emissions: ${summary.totalEmissions.toFixed(2)} t CO2`);
  console.log(`  Total Captured: ${summary.totalCaptured.toFixed(2)} t CO2`);
  console.log(`  Total Injected: ${summary.totalInjected.toFixed(2)} t CO2`);
  console.log(`  Total Stored: ${summary.totalStored.toFixed(2)} t CO2`);
  console.log(`  Total Utilized: ${summary.totalUtilized.toFixed(2)} t CO2`);
  return summary;
}

/**
 * Example 6: Get facility rankings (top 10)
 */
export async function example6_GetFacilityRankings() {
  console.log('=== Example 6: Get Facility Rankings ===');
  const allData = await loadAllFacilityData();
  const rankings = getFacilityRankings(allData, 10);
  console.log('Top 10 Facilities by Emissions:');
  rankings.forEach((facility, index) => {
    console.log(`  ${index + 1}. ${facility.facilityName}: ${facility.totalEmissions.toFixed(2)} t CO2`);
  });
  return rankings;
}

/**
 * Example 7: Get emissions by source
 */
export async function example7_GetEmissionsBySource() {
  console.log('=== Example 7: Get Emissions By Source ===');
  const allData = await loadAllFacilityData();
  const bySource = getEmissionsBySource(allData);
  console.log('Emissions by Source:');
  console.log(`  Flare Stacks: ${bySource.sources.flareStacks.toFixed(2)} t (${bySource.percentages.flareStacks}%)`);
  console.log(`  Atmospheric Tanks: ${bySource.sources.atmosphericTanks.toFixed(2)} t (${bySource.percentages.atmosphericTanks}%)`);
  console.log(`  Blowdowns: ${bySource.sources.blowdowns.toFixed(2)} t (${bySource.percentages.blowdowns}%)`);
  console.log(`  Equipment Leaks: ${bySource.sources.equipmentLeaks.toFixed(2)} t (${bySource.percentages.equipmentLeaks}%)`);
  console.log(`  Total: ${bySource.total.toFixed(2)} t CO2`);
  return bySource;
}

/**
 * Example 8: Search facilities
 */
export async function example8_SearchFacilities(searchTerm) {
  console.log('=== Example 8: Search Facilities ===');
  const allData = await loadAllFacilityData();
  const results = searchFacilities(allData, searchTerm || 'port');
  console.log(`Search results for "${searchTerm || 'port'}":`, results);
  return results;
}

/**
 * Example 9: Export monthly data to CSV
 */
export async function example9_ExportToCSV() {
  console.log('=== Example 9: Export to CSV ===');
  const allData = await loadAllFacilityData();
  const monthlyData = aggregateByMonth(allData);
  const csv = exportToCSV(monthlyData, [
    'month',
    'totalEmissions',
    'flareEmissions',
    'tankEmissions',
    'injectedCO2',
    'storedCO2',
    'facilityCount'
  ]);
  console.log('CSV Data (first 500 chars):');
  console.log(csv.substring(0, 500));
  return csv;
}

/**
 * Example 10: Complete dashboard data preparation
 */
export async function example10_PrepareDashboardData() {
  console.log('=== Example 10: Prepare Complete Dashboard Data ===');
  const allData = await loadAllFacilityData();
  
  const dashboardData = {
    summary: getTotalEmissionsSummary(allData),
    monthlyTrends: aggregateByMonth(allData),
    topFacilities: getFacilityRankings(allData, 10),
    emissionsBySource: getEmissionsBySource(allData),
    facilityCount: getAllFacilityNames(allData).length
  };
  
  console.log('Dashboard Data Prepared:');
  console.log(`  Total Facilities: ${dashboardData.facilityCount}`);
  console.log(`  Monthly Data Points: ${dashboardData.monthlyTrends.length}`);
  console.log(`  Top Facilities: ${dashboardData.topFacilities.length}`);
  
  return dashboardData;
}

// Run all examples (for testing)
export async function runAllExamples() {
  await example1_LoadAllData();
  await example2_GetFacilityNames();
  await example3_MergeFacilityData();
  await example4_AggregateByMonth();
  await example5_GetTotalSummary();
  await example6_GetFacilityRankings();
  await example7_GetEmissionsBySource();
  await example8_SearchFacilities();
  await example9_ExportToCSV();
  await example10_PrepareDashboardData();
  console.log('✅ All examples completed!');
}

