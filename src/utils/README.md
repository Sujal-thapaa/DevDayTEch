# Data Loader Utility Documentation

## Overview

The Data Loader Utility provides a comprehensive set of functions to load, merge, aggregate, and analyze CO2 emissions data from multiple JSON files stored in `/data/Operator Side/`.

## Data Files

The utility handles the following 10 JSON files:

| File | Description | Key Fields |
|------|-------------|------------|
| `Facility2.json` | Main facility information | Facility Name, Identifier, Year, Address, Total CO2, NAICS Code, Basin |
| `FlareStacks.json` | Monthly flare emissions | Facility Name, Flare ID, Month, Volume, Efficiency, CO2 Emissions |
| `AtmospericTank.json` | Tank emissions data | Facility Name, Month, Temperature, Pressure, CO2 Mole Fraction, Annual CO2 |
| `BlowDowns.json` | Blowdown events | Facility Name, Month, Equipment Type, Number of Blowdowns, Annual CO2 |
| `C02_Transport.json` | Transportation data | Facility Name, Month, Shipment ID, Mode, Distance, CO2 Transported, Leakage Loss |
| `CO2_by_Source.json` | Source-level breakdown | Facility Name, Month, emissions by source (Flares, Tanks, Blowdowns, etc.) |
| `CO2_Injection.json` | Injection site data | Facility Name, Month, Injection Site ID, Well ID, Injection Rate, Injected Amount |
| `CO2_storage.json` | Storage facility data | Facility Name, Month, Storage Site ID, Storage Type, Inflow, Outflow, Inventory |
| `CO2_Utilization.json` | Utilization & sales | Facility Name, Month, Contract ID, Buyer Type, Quantity, Price, Revenue |
| `EquipLeaks.json` | Equipment leak data | Facility Name, Emission Source Type, Region, Count, CO2 Emissions |

## Installation

```javascript
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
} from './utils/dataLoader';
```

## Core Functions

### 1. `loadAllFacilityData()`

Loads all JSON files from `/data/Operator Side/` directory.

**Returns:** Promise<Object>

```javascript
const allData = await loadAllFacilityData();
console.log(allData.metadata); // { totalRecords, loadedAt }
console.log(allData.facilities); // Array of facility records
console.log(allData.flareStacks); // Array of flare records
// ... etc for all 10 datasets
```

**Response Structure:**
```javascript
{
  facilities: [...],
  flareStacks: [...],
  atmosphericTanks: [...],
  blowdowns: [...],
  transport: [...],
  bySource: [...],
  injection: [...],
  storage: [...],
  utilization: [...],
  equipLeaks: [...],
  metadata: {
    totalRecords: 1234,
    loadedAt: "2025-10-12T16:30:00.000Z"
  }
}
```

---

### 2. `getAllFacilityNames(allData)`

Extracts unique facility names across all datasets.

**Parameters:**
- `allData` - Data object from `loadAllFacilityData()`

**Returns:** Array<string>

```javascript
const facilityNames = getAllFacilityNames(allData);
// ['Facility A', 'Facility B', 'Facility C', ...]
```

---

### 3. `mergeByFacility(allData, facilityName)`

Merges all data for a specific facility across all datasets.

**Parameters:**
- `allData` - Data object from `loadAllFacilityData()`
- `facilityName` - Name of the facility to merge

**Returns:** Object

```javascript
const facilityData = mergeByFacility(allData, 'Port Allen Ethanol');

console.log(facilityData.info); // Main facility info
console.log(facilityData.flares); // All flare records
console.log(facilityData.injection); // All injection records
console.log(facilityData.summary); // Record counts
```

**Response Structure:**
```javascript
{
  facilityName: "Port Allen Ethanol",
  info: { /* facility details */ },
  flares: [...],
  tanks: [...],
  blowdowns: [...],
  transport: [...],
  sources: [...],
  injection: [...],
  storage: [...],
  utilization: [...],
  leaks: [...],
  summary: {
    totalFlareRecords: 12,
    totalTankRecords: 8,
    totalInjectionRecords: 24,
    // ... etc
  }
}
```

---

### 4. `aggregateByMonth(allData)`

Aggregates emissions data by month across all facilities.

**Parameters:**
- `allData` - Data object from `loadAllFacilityData()`

**Returns:** Array<Object>

```javascript
const monthlyData = aggregateByMonth(allData);

monthlyData.forEach(month => {
  console.log(`${month.month}: ${month.totalEmissions} t CO2`);
});
```

**Response Structure:**
```javascript
[
  {
    month: "2024-01",
    flareEmissions: 1234.5,
    tankEmissions: 567.8,
    blowdownEmissions: 234.1,
    transportEmissions: 890.2,
    injectedCO2: 4567.3,
    storedCO2: 3456.7,
    utilizedCO2: 1234.5,
    leaksEmissions: 123.4,
    totalEmissions: 2159.8,
    facilityCount: 15,
    facilities: ['Facility A', 'Facility B', ...]
  },
  // ... more months
]
```

---

### 5. `getTotalEmissionsSummary(allData)`

Calculates total emissions summary across all facilities and all time periods.

**Parameters:**
- `allData` - Data object from `loadAllFacilityData()`

**Returns:** Object

```javascript
const summary = getTotalEmissionsSummary(allData);

console.log(`Total Facilities: ${summary.totalFacilities}`);
console.log(`Total Emissions: ${summary.totalEmissions} t CO2`);
console.log(`Total Captured: ${summary.totalCaptured} t CO2`);
```

**Response Structure:**
```javascript
{
  totalFacilities: 20,
  totalFlareEmissions: 12345.67,
  totalTankEmissions: 5678.90,
  totalBlowdownEmissions: 2345.67,
  totalTransported: 45678.90,
  totalInjected: 34567.89,
  totalStored: 23456.78,
  totalUtilized: 12345.67,
  totalLeaks: 1234.56,
  totalEmissions: 21604.80,
  totalCaptured: 58024.67
}
```

---

### 6. `getFacilityRankings(allData, limit = 10)`

Returns facilities ranked by total emissions (descending).

**Parameters:**
- `allData` - Data object from `loadAllFacilityData()`
- `limit` - Number of top facilities to return (default: 10)

**Returns:** Array<Object>

```javascript
const topFacilities = getFacilityRankings(allData, 5);

topFacilities.forEach((facility, index) => {
  console.log(`${index + 1}. ${facility.facilityName}: ${facility.totalEmissions} t CO2`);
});
```

**Response Structure:**
```javascript
[
  {
    facilityName: "Facility A",
    totalEmissions: 12345.67,
    info: { /* facility details */ },
    recordCounts: {
      totalFlareRecords: 12,
      totalTankRecords: 8,
      // ... etc
    }
  },
  // ... more facilities
]
```

---

### 7. `getEmissionsBySource(allData)`

Breaks down emissions by source type with percentages.

**Parameters:**
- `allData` - Data object from `loadAllFacilityData()`

**Returns:** Object

```javascript
const bySource = getEmissionsBySource(allData);

console.log(`Flare Stacks: ${bySource.sources.flareStacks} t (${bySource.percentages.flareStacks}%)`);
```

**Response Structure:**
```javascript
{
  sources: {
    flareStacks: 12345.67,
    atmosphericTanks: 5678.90,
    blowdowns: 2345.67,
    equipmentLeaks: 1234.56,
    transport: 890.23,
    other: 456.78
  },
  total: 22951.81,
  percentages: {
    flareStacks: "53.78",
    atmosphericTanks: "24.74",
    blowdowns: "10.22",
    equipmentLeaks: "5.38",
    transport: "3.88",
    other: "1.99"
  }
}
```

---

### 8. `searchFacilities(allData, searchTerm)`

Searches for facilities by name (case-insensitive).

**Parameters:**
- `allData` - Data object from `loadAllFacilityData()`
- `searchTerm` - Search string

**Returns:** Array<string>

```javascript
const results = searchFacilities(allData, 'port');
// ['Port Allen Ethanol', 'Port of Louisiana CCS', ...]
```

---

### 9. `exportToCSV(data, columns)`

Converts data array to CSV format.

**Parameters:**
- `data` - Array of data objects
- `columns` - (Optional) Array of column names to include

**Returns:** string (CSV formatted)

```javascript
const monthlyData = aggregateByMonth(allData);
const csv = exportToCSV(monthlyData, ['month', 'totalEmissions', 'facilityCount']);

// Download as file
const blob = new Blob([csv], { type: 'text/csv' });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'monthly_emissions.csv';
a.click();
```

---

## Usage Examples

### Example 1: Dashboard Summary

```javascript
import { loadAllFacilityData, getTotalEmissionsSummary, getFacilityRankings } from './utils/dataLoader';

async function loadDashboard() {
  const allData = await loadAllFacilityData();
  const summary = getTotalEmissionsSummary(allData);
  const topFacilities = getFacilityRankings(allData, 10);
  
  return {
    kpis: {
      totalFacilities: summary.totalFacilities,
      totalEmissions: summary.totalEmissions,
      totalCaptured: summary.totalCaptured,
      captureRate: ((summary.totalCaptured / summary.totalEmissions) * 100).toFixed(2)
    },
    topFacilities
  };
}
```

### Example 2: Facility Detail Page

```javascript
import { loadAllFacilityData, mergeByFacility } from './utils/dataLoader';

async function loadFacilityDetail(facilityName) {
  const allData = await loadAllFacilityData();
  const facilityData = mergeByFacility(allData, facilityName);
  
  return {
    info: facilityData.info,
    charts: {
      flareEmissions: facilityData.flares,
      injectionData: facilityData.injection,
      storageData: facilityData.storage,
      utilizationData: facilityData.utilization
    },
    stats: facilityData.summary
  };
}
```

### Example 3: Monthly Trend Chart

```javascript
import { loadAllFacilityData, aggregateByMonth } from './utils/dataLoader';

async function loadMonthlyTrends() {
  const allData = await loadAllFacilityData();
  const monthlyData = aggregateByMonth(allData);
  
  // Format for recharts
  return monthlyData.map(month => ({
    name: month.month,
    emissions: month.totalEmissions,
    captured: month.injectedCO2 + month.storedCO2,
    facilities: month.facilityCount
  }));
}
```

### Example 4: Emissions Pie Chart

```javascript
import { loadAllFacilityData, getEmissionsBySource } from './utils/dataLoader';

async function loadEmissionsPieChart() {
  const allData = await loadAllFacilityData();
  const bySource = getEmissionsBySource(allData);
  
  // Format for recharts
  return Object.entries(bySource.sources).map(([name, value]) => ({
    name: name.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to Title Case
    value: parseFloat(value.toFixed(2))
  }));
}
```

### Example 5: Export Data

```javascript
import { loadAllFacilityData, aggregateByMonth, exportToCSV } from './utils/dataLoader';

async function downloadMonthlyReport() {
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
  
  // Trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `monthly_emissions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

---

## Error Handling

All functions include built-in error handling:

- **Missing files:** Returns empty array `[]` with console warning
- **Invalid JSON:** Returns empty array `[]` with console error
- **Missing fields:** Gracefully handles with fallback values (0, empty string, etc.)
- **Network errors:** Catches and logs errors, returns empty data

```javascript
// Files that fail to load will not break the application
const allData = await loadAllFacilityData();
// Even if some files fail, other data is still available
```

---

## Performance Considerations

- **Caching:** Consider caching `loadAllFacilityData()` result in React state/context
- **Lazy loading:** Load data only when needed for specific pages
- **Pagination:** Use `limit` parameter in `getFacilityRankings()` for large datasets
- **Filtering:** Filter data client-side after loading for better UX

```javascript
// React example with caching
const [allData, setAllData] = useState(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  async function loadData() {
    const data = await loadAllFacilityData();
    setAllData(data);
    setIsLoading(false);
  }
  loadData();
}, []); // Only load once on mount
```

---

## Testing

See `dataLoaderExample.js` for complete working examples:

```javascript
import { runAllExamples } from './utils/dataLoaderExample';

// Run all examples in browser console
runAllExamples();
```

---

## Troubleshooting

### Issue: "Failed to fetch" errors

**Solution:** Ensure files exist in `/public/data/Operator Side/` directory and dev server is running.

### Issue: No data returned

**Solution:** Check console for warnings about missing files or parsing errors.

### Issue: Incorrect aggregations

**Solution:** Verify field names match between JSON files (case-sensitive).

---

## API Reference Summary

| Function | Purpose | Returns |
|----------|---------|---------|
| `loadAllFacilityData()` | Load all JSON files | Object with all datasets |
| `getAllFacilityNames()` | Get unique facility list | Array of strings |
| `mergeByFacility()` | Get all data for one facility | Object with merged data |
| `aggregateByMonth()` | Monthly aggregation | Array of monthly totals |
| `getTotalEmissionsSummary()` | Overall totals | Object with totals |
| `getFacilityRankings()` | Top emitters | Array of facilities |
| `getEmissionsBySource()` | Source breakdown | Object with percentages |
| `searchFacilities()` | Search by name | Array of matching names |
| `exportToCSV()` | Convert to CSV | String (CSV format) |

---

## License

Internal use only - CarbonHorizon CO₂Track LA Platform

