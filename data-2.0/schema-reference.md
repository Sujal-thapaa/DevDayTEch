# Polaris Data Schema Reference

## Database Schema (Prisma)

```prisma
model Company {
  id               String            @id @default(cuid())
  name             String
  sector           String
  createdAt        DateTime          @default(now())
  hqParish         String?
  logoUrl          String?
  updatedAt        DateTime          @updatedAt
  auditLogs        AuditLog[]
  facilities       Facility[]
  metricsSnapshots MetricsSnapshot[]
  reportingEvents  ReportingEvent[]

  @@index([sector])
}

model Facility {
  id        String       @id @default(cuid())
  companyId String
  type      FacilityType
  name      String?
  lat       Float
  lon       Float
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  company   Company      @relation(fields: [companyId], references: [id], onDelete: Cascade)
  flowsFrom Flow[]       @relation("FlowFrom")
  flowsTo   Flow[]       @relation("FlowTo")
  pipelinesFrom Pipeline[] @relation("PipelineStart")
  pipelinesTo   Pipeline[] @relation("PipelineEnd")

  @@index([companyId])
}

model Flow {
  id             String   @id @default(cuid())
  fromFacilityId String
  toFacilityId   String
  tons           Decimal  @db.Decimal(20, 3)
  periodStart    DateTime
  periodEnd      DateTime
  createdAt      DateTime @default(now())
  from           Facility @relation("FlowFrom", fields: [fromFacilityId], references: [id], onDelete: Cascade)
  to             Facility @relation("FlowTo", fields: [toFacilityId], references: [id], onDelete: Cascade)

  @@index([fromFacilityId, toFacilityId])
  @@index([periodStart, periodEnd])
}

model Pipeline {
  id              String   @id @default(cuid())
  name            String
  operator        String
  pipelineType    PipelineType
  diameter        Float    // inches
  length          Float    // miles
  capacity        Float    // tons per year
  startFacilityId String
  endFacilityId   String
  status          PipelineStatus
  routeCoordinates Json   // Array of [lat, lng] for pipeline route
  
  startFacility   Facility @relation("PipelineStart", fields: [startFacilityId], references: [id])
  endFacility     Facility @relation("PipelineEnd", fields: [endFacilityId], references: [id])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([startFacilityId, endFacilityId])
  @@index([status])
  @@index([pipelineType])
}

model MetricsSnapshot {
  id                  String   @id @default(cuid())
  companyId           String
  period              String
  capturedTons        Decimal  @db.Decimal(20, 3)
  utilizedTons        Decimal  @db.Decimal(20, 3)
  storedTons          Decimal  @db.Decimal(20, 3)
  utilizationRate     Float
  yoyDeltaPct         Float
  onTimeReportingRate Float
  integrityBadgeBool  Boolean  @default(false)
  accountabilityScore Float
  createdAt           DateTime @default(now())
  company             Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@unique([companyId, period])
  @@index([period])
}

model ReportingEvent {
  id           String          @id @default(cuid())
  companyId    String
  period       String
  dueAt        DateTime
  submittedAt  DateTime?
  fileSha256   String?
  integrityRef String?
  status       ReportingStatus
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
  filePath     String?
  company      Company         @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@unique([companyId, period])
  @@index([status])
}

model AuditLog {
  id           String   @id @default(cuid())
  companyId    String
  action       String
  fileSha256   String?
  integrityRef String?
  timestamp    DateTime @default(now())
  company      Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([companyId, timestamp])
}

enum FacilityType {
  capture
  transport
  storage
  utilization
}

enum PipelineType {
  CO2_TRANSPORT
  CO2_INJECTION
  CO2_STORAGE
  CO2_UTILIZATION
}

enum PipelineStatus {
  ACTIVE
  PLANNED
  UNDER_CONSTRUCTION
  INACTIVE
}

enum ReportingStatus {
  on_time
  late
  missing
}
```

## TypeScript Interfaces

### Frontend Data Types

```typescript
interface Company {
  id: string;
  name: string;
  sector: string;
  hqParish?: string;
  logoUrl?: string | null;
}

interface Facility {
  id: string;
  companyId: string;
  type: 'capture' | 'storage' | 'utilization' | 'transport';
  lat: number;
  lon: number;
  name?: string;
}

interface Pipeline {
  id: string;
  name: string;
  operator: string;
  pipelineType: 'CO2_TRANSPORT' | 'CO2_INJECTION' | 'CO2_STORAGE' | 'CO2_UTILIZATION';
  diameter: number;
  length: number;
  capacity: number;
  startFacilityId: string;
  endFacilityId: string;
  status: 'ACTIVE' | 'PLANNED' | 'UNDER_CONSTRUCTION' | 'INACTIVE';
  routeCoordinates: [number, number][];
  startFacility?: Facility;
  endFacility?: Facility;
}

interface Flow {
  id: string;
  fromFacilityId: string;
  toFacilityId: string;
  tons: string | number;
  periodStart: string;
  periodEnd: string;
  period: string;
}

interface MetricsRow {
  companyId: string;
  period: string;
  capturedTons: string;
  utilizedTons: string;
  storedTons: string;
  utilizationRate: number;
  yoyDeltaPct: number;
  onTimeReportingRate: number;
  accountabilityScore: number;
  integrityBadgeBool: boolean;
}

interface PathData {
  id: string;
  path: [number, number][];
  tons: number;
  toType: string;
  fromCompanyId: string;
  toCompanyId: string;
  fromCompanyName: string;
  toCompanyName: string;
}

interface FlowPath {
  id: string;
  path: [number, number][];
  color: [number, number, number, number];
  tons: number;
}

interface Particle {
  id: string;
  position: [number, number, number];
  pathId: string;
  progress: number;
  speed: number;
  color: [number, number, number, number];
}
```

## API Response Formats

### Companies Endpoint
```json
[
  {
    "id": "cmp_energis",
    "name": "Energis",
    "sector": "Energy",
    "hqParish": "East Baton Rouge",
    "logoUrl": "/logos/energis.svg"
  }
]
```

### Facilities Endpoint
```json
[
  {
    "id": "fac_en_cap_btr",
    "companyId": "cmp_energis",
    "type": "capture",
    "lat": 30.45,
    "lon": -91.19,
    "name": "Energis Baton Rouge Capture"
  }
]
```

### Pipelines Endpoint
```json
[
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
      [30.23, -93.22]
    ]
  }
]
```

### Flows Endpoint
```json
[
  {
    "id": "flo_127",
    "fromFacilityId": "fac_en_cap_btr",
    "toFacilityId": "fac_en_sto_lc",
    "tons": "280000",
    "periodStart": "2025-07-01T00:00:00.000Z",
    "periodEnd": "2025-09-30T23:59:59.999Z"
  }
]
```

### Metrics Endpoint
```json
[
  {
    "companyId": "cmp_energis",
    "period": "2025-Q3",
    "capturedTons": "820000",
    "utilizedTons": "540000",
    "storedTons": "280000",
    "utilizationRate": 66,
    "yoyDeltaPct": 18,
    "onTimeReportingRate": 100,
    "accountabilityScore": 86.5,
    "integrityBadgeBool": true
  }
]
```

## Data Relationships

### Entity Relationship Diagram
```
Company (1) ──→ (N) Facility
Company (1) ──→ (N) MetricsSnapshot
Company (1) ──→ (N) ReportingEvent
Company (1) ──→ (N) AuditLog

Facility (1) ──→ (N) Flow [fromFacilityId]
Facility (1) ──→ (N) Flow [toFacilityId]
Facility (1) ──→ (N) Pipeline [startFacilityId]
Facility (1) ──→ (N) Pipeline [endFacilityId]
```

### Key Relationships
- **Company → Facilities**: One-to-many (company owns multiple facilities)
- **Facility → Flows**: One-to-many (facility can be source/destination of multiple flows)
- **Facility → Pipelines**: One-to-many (facility can be start/end point of multiple pipelines)
- **Company → Metrics**: One-to-many (company has metrics for each quarter)
- **Company → Reporting Events**: One-to-many (company submits reports per quarter)

## Data Validation Rules

### Facility Types
- `capture`: CO2 capture facilities
- `storage`: Underground storage sites
- `utilization`: CO2 utilization facilities
- `transport`: Transportation hubs

### Pipeline Types
- `CO2_TRANSPORT`: Transportation pipelines between facilities
- `CO2_INJECTION`: Injection pipelines for storage
- `CO2_STORAGE`: Storage-related pipelines
- `CO2_UTILIZATION`: Utilization pipelines

### Pipeline Status
- `ACTIVE`: Currently operational
- `PLANNED`: Planned for future construction
- `UNDER_CONSTRUCTION`: Currently being built
- `INACTIVE`: Temporarily or permanently inactive

### Period Format
- Format: `YYYY-QN` (e.g., "2025-Q3")
- Valid quarters: Q1, Q2, Q3, Q4
- Year range: 2024-2025 (extensible)

### Tonnage Precision
- Database: `Decimal(20, 3)` - up to 20 digits, 3 decimal places
- Frontend: String representation for precision
- Range: 0 to 999,999,999,999,999.999 tons

### Geographic Coordinates
- Latitude: -90 to +90 degrees
- Longitude: -180 to +180 degrees
- Louisiana range: ~29°N to 33°N, ~89°W to 94°W

## Indexes and Performance

### Database Indexes
```sql
-- Company indexes
CREATE INDEX idx_company_sector ON Company(sector);

-- Facility indexes  
CREATE INDEX idx_facility_company ON Facility(companyId);

-- Pipeline indexes
CREATE INDEX idx_pipeline_start_end ON Pipeline(startFacilityId, endFacilityId);
CREATE INDEX idx_pipeline_status ON Pipeline(status);
CREATE INDEX idx_pipeline_type ON Pipeline(pipelineType);

-- Flow indexes
CREATE INDEX idx_flow_from_to ON Flow(fromFacilityId, toFacilityId);
CREATE INDEX idx_flow_period ON Flow(periodStart, periodEnd);

-- Metrics indexes
CREATE UNIQUE INDEX idx_metrics_company_period ON MetricsSnapshot(companyId, period);
CREATE INDEX idx_metrics_period ON MetricsSnapshot(period);

-- Reporting indexes
CREATE UNIQUE INDEX idx_reporting_company_period ON ReportingEvent(companyId, period);
CREATE INDEX idx_reporting_status ON ReportingEvent(status);

-- Audit indexes
CREATE INDEX idx_audit_company_timestamp ON AuditLog(companyId, timestamp);
```

### Query Optimization
- Use compound indexes for multi-column queries
- Partition large tables by period if needed
- Cache frequently accessed metrics
- Use database views for complex aggregations