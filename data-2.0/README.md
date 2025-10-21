# Polaris Data 2.0 - Storage and Utilization Maps Documentation

## Overview

Polaris visualizes carbon capture, storage, and utilization flows across Louisiana's industrial facilities using interactive maps with animated particle flows. The system tracks CO2 movement from capture facilities to storage and utilization sites over quarterly periods.

## Data Architecture

### Core Data Models

#### 1. Companies
- **Purpose**: Industrial entities participating in carbon management
- **Key Fields**:
  - `id`: Unique identifier (e.g., `cmp_energis`)
  - `name`: Company name (e.g., "Energis")
  - `sector`: Industry sector (Energy, Cement, Petrochemicals, etc.)
  - `hqParish`: Louisiana parish headquarters
  - `logoUrl`: Company logo path

#### 2. Facilities
- **Purpose**: Physical locations for carbon operations
- **Key Fields**:
  - `id`: Unique identifier (e.g., `fac_en_cap_btr`)
  - `companyId`: Links to company
  - `type`: Facility type (`capture`, `storage`, `utilization`, `transport`)
  - `lat`/`lon`: Geographic coordinates
  - `name`: Facility name

#### 3. Flows
- **Purpose**: CO2 movement between facilities over time
- **Key Fields**:
  - `id`: Unique identifier (e.g., `flo_01`)
  - `fromFacilityId`: Source facility
  - `toFacilityId`: Destination facility
  - `tons`: CO2 tonnage (Decimal with 3 decimal places)
  - `periodStart`/`periodEnd`: Time period (quarterly)
  - `period`: Quarter identifier (e.g., "2025-Q3")

#### 4. Metrics Snapshots
- **Purpose**: Aggregated performance data per company per quarter
- **Key Fields**:
  - `capturedTons`: Total CO2 captured
  - `utilizedTons`: CO2 used for products/processes
  - `storedTons`: CO2 stored underground
  - `utilizationRate`: Percentage utilized vs captured
  - `yoyDeltaPct`: Year-over-year change
  - `onTimeReportingRate`: Compliance percentage
  - `accountabilityScore`: Composite performance score

## Visualization Components

### 1. Map Visualization (`/viz`)
- **Technology**: Deck.gl with React Map GL
- **Base Map**: Mapbox (requires `VITE_MAPBOX_TOKEN`)
- **Features**:
  - Interactive facility markers
  - Animated particle flows between facilities
  - Color-coded flows by destination type
  - Zoom and pan controls

### 2. Flow Visualization
- **Particle System**: Custom implementation in `particles.ts`
- **Flow Colors**:
  - Storage flows: Blue `[0, 122, 255, 200]`
  - Utilization flows: Green `[44, 234, 163, 200]`
  - Default: Gray `[154, 160, 166, 180]`
- **Animation**: Particles move along curved Bézier paths
- **Scaling**: Particle count and speed based on tonnage

### 3. Data Dashboard (`/data`)
- **Metrics Display**: Tabular view of company performance
- **Charts**: Time series, sector breakdown, comparison charts
- **Filters**: By period, sector, company
- **Export**: CSV download functionality

## Data Sources

### 1. Database (PostgreSQL)
- **Location**: `apps/polaris-api/prisma/schema.prisma`
- **Connection**: `DATABASE_URL` environment variable
- **Migration**: Prisma migrations for schema changes
- **Seed Data**: Comprehensive quarterly data 2024-Q1 through 2025-Q4

### 2. Mock Data (Development)
- **Location**: `apps/polaris-web/src/viz/mockData.ts`
- **Purpose**: Offline development and testing
- **Content**: 10 companies, 30+ facilities, 170+ flows across 8 quarters

### 3. API Endpoints
- **Base URL**: `VITE_API_BASE_URL` (default: `http://localhost:4000`)
- **Health Check**: `/api/health`
- **Documentation**: `/api/docs` (Swagger UI)
- **Data Routes**: `/api/metrics`, `/api/companies`, `/api/flows`

## Geographic Coverage

### Louisiana Industrial Corridor
- **Baton Rouge**: Energy sector (Energis)
- **Lake Charles**: Cement and petrochemicals (GulfCem, PetroChem)
- **Alexandria**: Pulp & paper (BioPulp)
- **Lafayette**: Bioenergy (BayouBiofuel)
- **Houma**: Natural gas (Delta Gas)
- **Norco**: Refining (RiverRefinery)

### Facility Types by Location
- **Capture Facilities**: 10 locations across Louisiana
- **Storage Facilities**: 13 locations (including 3 shared hubs)
- **Utilization Facilities**: 10 locations for various products
- **Shared Hubs**: Bayou Ridge, Shreveport, Southwest LA

## Data Processing

### 1. Flow Aggregation (`aggregateMetrics.ts`)
- **Purpose**: Calculate quarterly metrics from flow data
- **Process**:
  - Sum flows by facility type and company
  - Calculate utilization rates
  - Track reporting compliance
  - Generate accountability scores

### 2. Flow Overlap Calculation
- **Method**: Time-based overlap for quarterly periods
- **Formula**: `overlapTons(flowTons, flowStart, flowEnd, quarterStart, quarterEnd)`
- **Purpose**: Handle flows that span multiple quarters

### 3. Accountability Scoring
- **Formula**: 
  ```
  score = 0.4 * normalizedCaptured + 
          0.25 * utilizationRate + 
          0.2 * onTimeReporting + 
          0.1 * integrityBadge + 
          0.05 * yoyDelta
  ```

## Sample Data Structure

### Company Example
```json
{
  "id": "cmp_energis",
  "name": "Energis",
  "sector": "Energy",
  "hqParish": "East Baton Rouge",
  "logoUrl": "/logos/energis.svg"
}
```

### Facility Example
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

### Flow Example
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

### Metrics Example
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

## Technical Implementation

### Frontend Stack
- **Framework**: React 18 + TypeScript
- **Maps**: Deck.gl + React Map GL + Mapbox
- **State**: Zustand for global state
- **Styling**: Tailwind CSS
- **Build**: Vite

### Backend Stack
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT tokens
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer for CSV/PDF reports

### Data Flow
1. **Database** → **API** → **Frontend**
2. **Mock Data** → **Frontend** (development mode)
3. **User Uploads** → **API** → **Database** → **Aggregation Jobs**

## Environment Configuration

### Required Environment Variables
```bash
# API
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/polaris
JWT_SECRET=devsecret
AUTH_USERNAME=polaris-admin
AUTH_PASSWORD=changeme

# Frontend
VITE_API_BASE_URL=http://localhost:4000
VITE_MAPBOX_TOKEN=pk.your_mapbox_token
```

## Data Volume and Scale

### Current Dataset
- **Companies**: 10 industrial entities
- **Facilities**: 30+ physical locations
- **Flows**: 170+ quarterly flow records
- **Time Period**: 8 quarters (2024-Q1 to 2025-Q4)
- **Total CO2**: 15+ million tons tracked

### Performance Considerations
- **Particle Animation**: 10-40 particles per flow path
- **Map Rendering**: Deck.gl optimized for large datasets
- **Database**: Indexed on company, period, facility relationships
- **Caching**: Frontend state management for real-time updates

## Future Enhancements

### Data Expansion
- Additional companies and facilities
- Real-time flow monitoring
- Historical data back to 2020
- International facility support

### Visualization Improvements
- 3D facility visualization
- Heat maps for CO2 density
- Predictive flow modeling
- Mobile-optimized interface

### Analytics Features
- Machine learning predictions
- Carbon credit calculations
- Regulatory compliance tracking
- Supply chain optimization
