# Polaris API Reference

## Base Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/polaris

# Authentication
JWT_SECRET=devsecret
AUTH_USERNAME=polaris-admin
AUTH_PASSWORD=changeme
TOKEN_TTL_HOURS=8

# Server
PORT=4000
MAX_UPLOAD_MB=10
```

### Base URL
- **Development**: `http://localhost:4000`
- **Production**: `https://your-api-domain.com`

## Authentication

### Login Endpoint
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "polaris-admin",
  "password": "changeme"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-01-10T20:00:00Z"
}
```

### Token Usage
```http
Authorization: Bearer <token>
```

## Data Endpoints

### Companies

#### Get All Companies
```http
GET /api/companies
```

**Response:**
```json
[
  {
    "id": "cmp_energis",
    "name": "Energis",
    "sector": "Energy",
    "hqParish": "East Baton Rouge",
    "logoUrl": "/logos/energis.svg",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2025-01-10T12:00:00Z"
  }
]
```

#### Get Company by ID
```http
GET /api/companies/{id}
```

**Response:**
```json
{
  "id": "cmp_energis",
  "name": "Energis",
  "sector": "Energy",
  "hqParish": "East Baton Rouge",
  "logoUrl": "/logos/energis.svg",
  "facilities": [
    {
      "id": "fac_en_cap_btr",
      "type": "capture",
      "lat": 30.45,
      "lon": -91.19,
      "name": "Energis Baton Rouge Capture"
    }
  ],
  "metricsSnapshots": [
    {
      "period": "2025-Q3",
      "capturedTons": "820000",
      "utilizedTons": "540000",
      "storedTons": "280000",
      "utilizationRate": 66,
      "accountabilityScore": 86.5
    }
  ]
}
```

### Facilities

#### Get All Facilities
```http
GET /api/facilities
```

**Response:**
```json
[
  {
    "id": "fac_en_cap_btr",
    "companyId": "cmp_energis",
    "type": "capture",
    "lat": 30.45,
    "lon": -91.19,
    "name": "Energis Baton Rouge Capture",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2025-01-10T12:00:00Z"
  }
]
```

#### Get Facilities by Company
```http
GET /api/facilities?companyId={companyId}
```

### Flows

#### Get Flows by Period
```http
GET /api/flows?period={period}
```

**Parameters:**
- `period`: Quarter format (e.g., "2025-Q3")

**Response:**
```json
[
  {
    "id": "flo_127",
    "fromFacilityId": "fac_en_cap_btr",
    "toFacilityId": "fac_en_sto_lc",
    "tons": "280000",
    "periodStart": "2025-07-01T00:00:00Z",
    "periodEnd": "2025-09-30T23:59:59Z",
    "createdAt": "2025-01-10T12:00:00Z"
  }
]
```

#### Get Flows by Company
```http
GET /api/flows?companyId={companyId}&period={period}
```

### Metrics

#### Get Metrics by Period
```http
GET /api/metrics?period={period}
```

**Response:**
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
    "integrityBadgeBool": true,
    "accountabilityScore": 86.5,
    "createdAt": "2025-01-10T12:00:00Z"
  }
]
```

#### Get Metrics by Company
```http
GET /api/metrics?companyId={companyId}
```

#### Get Historical Metrics
```http
GET /api/metrics?companyId={companyId}&startPeriod={start}&endPeriod={end}
```

## Reporting Endpoints

### Upload Report
```http
POST /api/reports/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <CSV/PDF file>
companyId: cmp_energis
period: 2025-Q3
```

**Response:**
```json
{
  "id": "rep_en_q3",
  "companyId": "cmp_energis",
  "period": "2025-Q3",
  "status": "on_time",
  "filePath": "/uploads/cmp_energis_2025-Q3_1760140875850.csv",
  "fileSha256": "a1b2c3d4e5f6...",
  "submittedAt": "2025-01-10T12:00:00Z"
}
```

### Get Reporting Events
```http
GET /api/reports?period={period}
```

**Response:**
```json
[
  {
    "id": "rep_en_q3",
    "companyId": "cmp_energis",
    "period": "2025-Q3",
    "dueAt": "2025-10-05T23:59:59Z",
    "submittedAt": "2025-10-03T14:30:00Z",
    "status": "on_time",
    "fileSha256": "a1b2c3d4e5f6...",
    "integrityRef": null
  }
]
```

## Health and Status

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-10T12:00:00Z",
  "version": "1.0.0",
  "database": "connected",
  "uptime": "2d 14h 32m"
}
```

### API Documentation
```http
GET /api/docs
```
Returns Swagger UI interface for interactive API documentation.

## Error Responses

### Validation Error
```json
{
  "error": "ValidationError",
  "message": "Invalid period format",
  "code": "INVALID_PERIOD",
  "details": {
    "field": "period",
    "provided": "2025-Q13",
    "expected": "YYYY-QN format"
  }
}
```

### Authentication Error
```json
{
  "error": "AuthenticationError",
  "message": "Invalid credentials",
  "code": "INVALID_CREDENTIALS"
}
```

### Not Found Error
```json
{
  "error": "NotFoundError",
  "message": "Company not found",
  "code": "COMPANY_NOT_FOUND",
  "details": {
    "id": "cmp_nonexistent"
  }
}
```

### Server Error
```json
{
  "error": "InternalServerError",
  "message": "Database connection failed",
  "code": "DATABASE_ERROR"
}
```

## Query Parameters

### Pagination
```http
GET /api/companies?page=1&limit=10
```

### Sorting
```http
GET /api/metrics?sortBy=accountabilityScore&sortOrder=desc
```

### Filtering
```http
GET /api/companies?sector=Energy
GET /api/facilities?type=capture
GET /api/metrics?period=2025-Q3&minScore=80
```

## Rate Limiting

### Limits
- **Unauthenticated**: 100 requests/hour
- **Authenticated**: 1000 requests/hour
- **Upload**: 10 requests/hour

### Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641234567
```

## WebSocket Events

### Real-time Updates
```javascript
const ws = new WebSocket('ws://localhost:4000/ws');

// Listen for flow updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'flow_update') {
    // Update flow visualization
  }
};
```

### Event Types
- `flow_update`: New flow data available
- `metrics_update`: Metrics snapshot updated
- `report_submitted`: New report uploaded
- `system_status`: Health status change

## Data Export

### CSV Export
```http
GET /api/export/metrics?period=2025-Q3&format=csv
```

**Response Headers:**
```http
Content-Type: text/csv
Content-Disposition: attachment; filename="metrics_2025-Q3.csv"
```

### JSON Export
```http
GET /api/export/flows?period=2025-Q3&format=json
```

## Batch Operations

### Bulk Upload
```http
POST /api/batch/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: <multiple CSV files>
```

### Bulk Metrics Calculation
```http
POST /api/batch/metrics
Authorization: Bearer <token>
Content-Type: application/json

{
  "period": "2025-Q3",
  "companyIds": ["cmp_energis", "cmp_gulfcem"]
}
```

## Webhook Integration

### Configure Webhook
```http
POST /api/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["flow_update", "metrics_update"],
  "secret": "webhook-secret"
}
```

### Webhook Payload
```json
{
  "event": "flow_update",
  "timestamp": "2025-01-10T12:00:00Z",
  "data": {
    "flowId": "flo_127",
    "companyId": "cmp_energis",
    "period": "2025-Q3",
    "tons": "280000"
  },
  "signature": "sha256=abc123..."
}
```
