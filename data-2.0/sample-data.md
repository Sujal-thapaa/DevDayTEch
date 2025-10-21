# Polaris Sample Data and Examples

## Sample Companies

### Energy Sector
```json
{
  "id": "cmp_energis",
  "name": "Energis",
  "sector": "Energy",
  "hqParish": "East Baton Rouge",
  "logoUrl": "/logos/energis.svg"
}
```

### Cement Sector
```json
{
  "id": "cmp_gulfcem",
  "name": "GulfCem",
  "sector": "Cement",
  "hqParish": "Calcasieu",
  "logoUrl": "/logos/gulfcem.svg"
}
```

### Petrochemicals Sector
```json
{
  "id": "cmp_petrochem",
  "name": "PetroChem Industries",
  "sector": "Petrochemicals",
  "hqParish": "Iberia",
  "logoUrl": "/logos/petrochem.svg"
}
```

## Sample Facilities

### Capture Facilities
```json
{
  "id": "fac_en_cap_btr",
  "companyId": "cmp_energis",
  "type": "capture",
  "lat": 30.45,
  "lon": -91.19,
  "name": "Energis Baton Rouge Capture"
}
```

### Storage Facilities
```json
{
  "id": "fac_en_sto_lc",
  "companyId": "cmp_energis",
  "type": "storage",
  "lat": 30.23,
  "lon": -93.22,
  "name": "Energis Lake Charles Storage"
}
```

### Utilization Facilities
```json
{
  "id": "fac_en_utl_power",
  "companyId": "cmp_energis",
  "type": "utilization",
  "lat": 30.47,
  "lon": -91.15,
  "name": "Energis Power Utilization"
}
```

### Shared Storage Hubs
```json
{
  "id": "fac_hub_sto_brx",
  "companyId": "cmp_energis",
  "type": "storage",
  "lat": 29.9,
  "lon": -90.2,
  "name": "Bayou Ridge Storage Hub"
}
```

## Sample Pipelines

### Active Transport Pipelines
```json
{
  "id": "pipe_en_trans_001",
  "name": "Energis Baton Rouge to Lake Charles Pipeline",
  "operator": "Energis",
  "pipelineType": "CO2_TRANSPORT",
  "diameter": 24.0,
  "length": 125.5,
  "capacity": 500000,
  "startFacilityId": "fac_en_cap_btr",
  "endFacilityId": "fac_en_sto_lc",
  "status": "ACTIVE",
  "routeCoordinates": [
    [30.45, -91.19],
    [30.35, -91.8],
    [30.25, -92.4],
    [30.23, -93.22]
  ]
}
```

### Storage Injection Pipeline
```json
{
  "id": "pipe_en_inj_001",
  "name": "Energis Lake Charles Storage Injection",
  "operator": "Energis",
  "pipelineType": "CO2_INJECTION",
  "diameter": 16.0,
  "length": 2.5,
  "capacity": 200000,
  "startFacilityId": "fac_en_sto_lc",
  "endFacilityId": "fac_en_sto_lc",
  "status": "ACTIVE",
  "routeCoordinates": [
    [30.23, -93.22],
    [30.20, -93.25],
    [30.18, -93.28]
  ]
}
```

### Planned Utilization Pipeline
```json
{
  "id": "pipe_gc_util_001",
  "name": "GulfCem Lake Charles Utilization Pipeline",
  "operator": "GulfCem",
  "pipelineType": "CO2_UTILIZATION",
  "diameter": 12.0,
  "length": 8.2,
  "capacity": 150000,
  "startFacilityId": "fac_gc_cap_lc",
  "endFacilityId": "fac_gc_utl_concrete",
  "status": "PLANNED",
  "routeCoordinates": [
    [30.24, -93.22],
    [30.25, -93.20],
    [30.26, -93.20]
  ]
}
```

### Under Construction Storage Pipeline
```json
{
  "id": "pipe_bp_sto_001",
  "name": "BioPulp Alexandria Storage Pipeline",
  "operator": "BioPulp",
  "pipelineType": "CO2_STORAGE",
  "diameter": 20.0,
  "length": 15.8,
  "capacity": 300000,
  "startFacilityId": "fac_bp_cap_alex",
  "endFacilityId": "fac_bp_sto_cenla",
  "status": "UNDER_CONSTRUCTION",
  "routeCoordinates": [
    [31.31, -92.44],
    [31.30, -92.46],
    [31.29, -92.48]
  ]
}
```

## Sample Flows by Quarter

### 2024-Q1 Flows (Baseline)
```json
{
  "id": "flo_01",
  "fromFacilityId": "fac_en_cap_btr",
  "toFacilityId": "fac_en_sto_lc",
  "tons": 120000,
  "periodStart": "2024-01-01",
  "periodEnd": "2024-03-31",
  "period": "2024-Q1"
}
```

### 2025-Q3 Flows (Peak Activity)
```json
{
  "id": "flo_127",
  "fromFacilityId": "fac_en_cap_btr",
  "toFacilityId": "fac_en_sto_lc",
  "tons": 280000,
  "periodStart": "2025-07-01",
  "periodEnd": "2025-09-30",
  "period": "2025-Q3"
}
```

## Sample Metrics Snapshots

### High-Performing Company (Energis Q3 2025)
```json
{
  "companyId": "cmp_energis",
  "period": "2025-Q3",
  "capturedTons": 820000,
  "utilizedTons": 540000,
  "storedTons": 280000,
  "utilizationRate": 66,
  "yoyDeltaPct": 18,
  "onTimeReportingRate": 100,
  "accountabilityScore": 86.5,
  "integrityBadgeBool": true
}
```

### Underperforming Company (RiverRefinery Q3 2025)
```json
{
  "companyId": "cmp_riverref",
  "period": "2025-Q3",
  "capturedTons": 255000,
  "utilizedTons": 40000,
  "storedTons": 215000,
  "utilizationRate": 16,
  "yoyDeltaPct": -4,
  "onTimeReportingRate": 0,
  "accountabilityScore": 42.7,
  "integrityBadgeBool": false
}
```

## Geographic Distribution

### Louisiana Industrial Corridor Facilities

#### Baton Rouge Area
- **Energis Baton Rouge Capture**: 30.45°N, 91.19°W
- **Energis Power Utilization**: 30.47°N, 91.15°W
- **Sugar Co Iberville Capture**: 30.28°N, 91.32°W
- **Sugar Co Bioplastics**: 30.30°N, 91.30°W

#### Lake Charles Area
- **GulfCem Lake Charles Capture**: 30.24°N, 93.22°W
- **GulfCem Concrete Utilization**: 30.26°N, 93.20°W
- **Energis Lake Charles Storage**: 30.23°N, 93.22°W

#### Alexandria Area
- **BioPulp Alexandria Capture**: 31.31°N, 92.44°W
- **BioPulp Utilization Plant**: 31.33°N, 92.45°W
- **BioPulp CenLA Storage**: 31.29°N, 92.48°W

#### Lafayette Area
- **BayouBio Lafayette Capture**: 30.22°N, 92.02°W
- **BayouBio Ethanol Utilization**: 30.24°N, 92.00°W

#### Houma Area
- **Delta Gas Houma Capture**: 29.59°N, 90.72°W
- **Delta Methanol Utilization**: 29.61°N, 90.70°W
- **Delta Gulf Storage**: 29.57°N, 90.74°W

#### Norco Area
- **RiverRefinery Norco Capture**: 30.00°N, 90.41°W
- **RiverRef Fuel Utilization**: 30.02°N, 90.39°W
- **RiverRef Storage Plaquemines**: 29.73°N, 89.98°W

## Flow Patterns by Sector

### Energy Sector Flows
- **Primary**: Capture → Storage → Utilization
- **Volume**: 200K-800K tons per quarter
- **Utilization Rate**: 60-70%
- **Growth**: 15-20% YoY

### Cement Sector Flows
- **Primary**: Capture → Utilization (direct)
- **Volume**: 250K-400K tons per quarter
- **Utilization Rate**: 70-75%
- **Growth**: 10-15% YoY

### Petrochemicals Sector Flows
- **Primary**: Capture → Storage + Utilization
- **Volume**: 300K-500K tons per quarter
- **Utilization Rate**: 70-75%
- **Growth**: 15-20% YoY

### Bioenergy Sector Flows
- **Primary**: Capture → Utilization (high efficiency)
- **Volume**: 200K-400K tons per quarter
- **Utilization Rate**: 75-80%
- **Growth**: 10-15% YoY

## Quarterly Trends

### 2024-Q1 (Baseline)
- **Total Captured**: 2.1M tons
- **Total Utilized**: 1.4M tons
- **Total Stored**: 0.7M tons
- **Average Utilization**: 67%

### 2024-Q2 (Growth Phase)
- **Total Captured**: 2.4M tons (+14%)
- **Total Utilized**: 1.6M tons (+14%)
- **Total Stored**: 0.8M tons (+14%)
- **Average Utilization**: 67%

### 2024-Q3 (Expansion)
- **Total Captured**: 2.7M tons (+13%)
- **Total Utilized**: 1.8M tons (+13%)
- **Total Stored**: 0.9M tons (+13%)
- **Average Utilization**: 67%

### 2024-Q4 (Year-End Push)
- **Total Captured**: 3.0M tons (+11%)
- **Total Utilized**: 2.0M tons (+11%)
- **Total Stored**: 1.0M tons (+11%)
- **Average Utilization**: 67%

### 2025-Q1 (New Year Baseline)
- **Total Captured**: 3.2M tons (+7%)
- **Total Utilized**: 2.2M tons (+10%)
- **Total Stored**: 1.0M tons (0%)
- **Average Utilization**: 69%

### 2025-Q2 (Acceleration)
- **Total Captured**: 3.6M tons (+13%)
- **Total Utilized**: 2.5M tons (+14%)
- **Total Stored**: 1.1M tons (+10%)
- **Average Utilization**: 69%

### 2025-Q3 (Peak Quarter)
- **Total Captured**: 4.1M tons (+14%)
- **Total Utilized**: 2.8M tons (+12%)
- **Total Stored**: 1.3M tons (+18%)
- **Average Utilization**: 68%

### 2025-Q4 (Projected Peak)
- **Total Captured**: 4.6M tons (+12%)
- **Total Utilized**: 3.2M tons (+14%)
- **Total Stored**: 1.4M tons (+8%)
- **Average Utilization**: 70%

## Performance Metrics Examples

### Accountability Score Calculation
```typescript
// Example for Energis Q3 2025
const normalizedCaptured = 100; // Max in period
const utilizationRate = 66;
const onTimeReporting = 100;
const integrityBadge = 100;
const yoyDelta = 18;

const score = 
  0.4 * normalizedCaptured +    // 40 points
  0.25 * utilizationRate +      // 16.5 points
  0.2 * onTimeReporting +       // 20 points
  0.1 * integrityBadge +        // 10 points
  0.05 * yoyDelta;              // 0.9 points
// Total: 86.5 points
```

### Utilization Rate Examples
- **High Efficiency**: BioPulp (77%), BayouBio (75%)
- **Medium Efficiency**: Energis (66%), GulfCem (71%)
- **Low Efficiency**: RiverRefinery (16%) - storage-focused

### Year-over-Year Growth
- **High Growth**: Energis (+18%), PetroChem (+17%)
- **Moderate Growth**: GulfCem (+11%), BayouBio (+13%)
- **Negative Growth**: RiverRefinery (-4%) - declining utilization

## Data Quality Examples

### Complete Data Record
```json
{
  "company": "Energis",
  "facilities": 3,
  "flows": 6,
  "metrics": 8,
  "reporting": "Complete",
  "integrity": "Verified"
}
```

### Incomplete Data Record
```json
{
  "company": "RiverRefinery",
  "facilities": 3,
  "flows": 4,
  "metrics": 6,
  "reporting": "Missing Q2, Q3",
  "integrity": "Unverified"
}
```

## API Response Examples

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2025-01-10T12:00:00Z",
  "version": "1.0.0",
  "database": "connected",
  "uptime": "2d 14h 32m"
}
```

### Error Response
```json
{
  "error": "ValidationError",
  "message": "Invalid period format. Expected YYYY-QN",
  "code": "INVALID_PERIOD",
  "details": {
    "provided": "2025-Q13",
    "expected": "2025-Q1, 2025-Q2, 2025-Q3, or 2025-Q4"
  }
}
```

## Mock Data Statistics

### Dataset Overview
- **Companies**: 10 industrial entities
- **Facilities**: 30+ physical locations
- **Flows**: 170+ quarterly records
- **Metrics**: 80+ quarterly snapshots
- **Time Span**: 8 quarters (2 years)
- **Total CO2**: 15+ million tons tracked

### Geographic Coverage
- **Parishes**: 8 Louisiana parishes
- **Latitude Range**: 29.57°N to 32.53°N
- **Longitude Range**: 89.98°W to 93.75°W
- **Area Coverage**: ~50,000 sq miles

### Sector Distribution
- **Energy**: 1 company (Energis)
- **Cement**: 1 company (GulfCem)
- **Petrochemicals**: 1 company (PetroChem)
- **Bioenergy**: 1 company (BayouBio)
- **Natural Gas**: 1 company (Delta Gas)
- **Refining**: 1 company (RiverRefinery)
- **Pulp & Paper**: 1 company (BioPulp)
- **Agriculture**: 1 company (Sugar Co)
- **Manufacturing**: 1 company (Bayou Steel)
- **Chemicals**: 1 company (Gulf Coast Chemicals)

## Pipeline Infrastructure Overview

### Pipeline Network Statistics
- **Total Pipelines**: 15 active and planned pipelines
- **Total Length**: 1,200+ miles of pipeline infrastructure
- **Total Capacity**: 3.5M+ tons CO₂ per year
- **Pipeline Types**: Transport (8), Storage (3), Utilization (3), Injection (1)
- **Status Distribution**: Active (10), Planned (3), Under Construction (2)

### Major Pipeline Corridors

#### Baton Rouge to Lake Charles Corridor
- **Primary Route**: Energis Baton Rouge → Lake Charles Storage
- **Length**: 125.5 miles
- **Capacity**: 500,000 tons/year
- **Status**: Active
- **Diameter**: 24 inches

#### Lafayette Regional Network
- **Routes**: BayouBio Lafayette → Ethanol Utilization
- **Length**: 45.2 miles
- **Capacity**: 200,000 tons/year
- **Status**: Active
- **Diameter**: 16 inches

#### Alexandria Storage Hub
- **Routes**: BioPulp Alexandria → CenLA Storage
- **Length**: 15.8 miles
- **Capacity**: 300,000 tons/year
- **Status**: Under Construction
- **Diameter**: 20 inches

#### Houma Delta Network
- **Routes**: Delta Gas Houma → Gulf Storage
- **Length**: 28.7 miles
- **Capacity**: 180,000 tons/year
- **Status**: Active
- **Diameter**: 14 inches

### Pipeline Type Distribution

#### CO2 Transport Pipelines (8 pipelines)
- **Purpose**: Inter-facility CO₂ transportation
- **Total Length**: 650+ miles
- **Total Capacity**: 2.1M tons/year
- **Average Diameter**: 18 inches
- **Key Operators**: Energis, GulfCem, PetroChem

#### CO2 Storage Pipelines (3 pipelines)
- **Purpose**: Underground storage injection
- **Total Length**: 45+ miles
- **Total Capacity**: 800K tons/year
- **Average Diameter**: 16 inches
- **Key Operators**: Energis, BioPulp, Delta Gas

#### CO2 Utilization Pipelines (3 pipelines)
- **Purpose**: Direct utilization applications
- **Total Length**: 25+ miles
- **Total Capacity**: 400K tons/year
- **Average Diameter**: 12 inches
- **Key Operators**: GulfCem, BayouBio, Sugar Co

#### CO2 Injection Pipelines (1 pipeline)
- **Purpose**: Storage site injection
- **Total Length**: 2.5 miles
- **Total Capacity**: 200K tons/year
- **Average Diameter**: 16 inches
- **Key Operator**: Energis

### Pipeline Status Overview

#### Active Pipelines (10)
- **Energis Baton Rouge → Lake Charles**: 500K tons/year
- **GulfCem Lake Charles → Concrete**: 150K tons/year
- **BayouBio Lafayette → Ethanol**: 200K tons/year
- **Delta Gas Houma → Gulf Storage**: 180K tons/year
- **PetroChem Iberia → Storage Hub**: 300K tons/year
- **Sugar Co Iberville → Bioplastics**: 120K tons/year
- **RiverRefinery Norco → Storage**: 250K tons/year
- **BioPulp Alexandria → Utilization**: 100K tons/year
- **Bayou Steel Lafayette → Storage**: 80K tons/year
- **Gulf Coast Chemicals → Utilization**: 90K tons/year

#### Planned Pipelines (3)
- **GulfCem Lake Charles Utilization**: 150K tons/year (Q2 2025)
- **PetroChem Iberia Expansion**: 200K tons/year (Q3 2025)
- **Sugar Co Bioplastics Extension**: 100K tons/year (Q4 2025)

#### Under Construction (2)
- **BioPulp Alexandria Storage**: 300K tons/year (Q1 2025)
- **Energis Lake Charles Injection**: 200K tons/year (Q2 2025)

### Geographic Pipeline Density

#### High-Density Areas
- **Lake Charles Region**: 4 pipelines, 200+ miles
- **Baton Rouge Region**: 3 pipelines, 150+ miles
- **Lafayette Region**: 2 pipelines, 70+ miles

#### Medium-Density Areas
- **Alexandria Region**: 2 pipelines, 50+ miles
- **Houma Region**: 2 pipelines, 40+ miles
- **Iberia Region**: 2 pipelines, 35+ miles

#### Low-Density Areas
- **Norco Region**: 1 pipeline, 25+ miles
- **Iberville Region**: 1 pipeline, 15+ miles

### Pipeline Capacity Analysis

#### Capacity by Pipeline Type
- **Transport**: 2.1M tons/year (60% of total)
- **Storage**: 800K tons/year (23% of total)
- **Utilization**: 400K tons/year (11% of total)
- **Injection**: 200K tons/year (6% of total)

#### Capacity by Status
- **Active**: 2.0M tons/year (57% of total)
- **Under Construction**: 500K tons/year (14% of total)
- **Planned**: 450K tons/year (13% of total)
- **Inactive**: 550K tons/year (16% of total)

### Pipeline Infrastructure Investment

#### Total Investment Value
- **Active Pipelines**: $2.8B
- **Under Construction**: $450M
- **Planned Pipelines**: $380M
- **Total Network Value**: $3.6B

#### Investment by Pipeline Type
- **Transport Pipelines**: $2.2B (61%)
- **Storage Pipelines**: $800M (22%)
- **Utilization Pipelines**: $400M (11%)
- **Injection Pipelines**: $200M (6%)

#### Investment by Operator
- **Energis**: $1.2B (33%)
- **GulfCem**: $600M (17%)
- **PetroChem**: $500M (14%)
- **BioPulp**: $400M (11%)
- **Delta Gas**: $300M (8%)
- **Others**: $600M (17%)
