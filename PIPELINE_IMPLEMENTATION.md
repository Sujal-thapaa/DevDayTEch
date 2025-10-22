# Pipeline Infrastructure Implementation

## Overview

This implementation adds a comprehensive Pipeline Infrastructure section to the Operator side of the Data 2.0 system. The pipeline system tracks CO₂ pipeline infrastructure across Louisiana industrial facilities, providing both map visualization and data management capabilities.

## Features Implemented

### 1. Data Model & Schema
- **Pipeline Prisma Model**: Complete database schema with relationships to facilities
- **TypeScript Interfaces**: Type-safe interfaces for frontend development
- **Sample Data**: 15 realistic pipeline records with proper geographic coordinates

### 2. Google Maps Integration
- **PipelineMap Component**: Interactive map showing pipeline routes as polylines
- **Facility Markers**: Existing facility locations displayed as markers
- **Louisiana Boundary**: State boundary overlay for geographic context
- **Color-coded Pipelines**: Different colors for pipeline types (Transport, Storage, Utilization, Injection)
- **Interactive Info Windows**: Click on pipelines to view detailed information

### 3. User Interface Components
- **MapControls**: Layer toggles and filtering controls
- **PipelineTable**: Sortable table view of all pipelines
- **PipelinePage**: Main dashboard page with statistics and controls
- **Navigation Integration**: Added to operator navigation menu

### 4. API Layer
- **Mock Pipeline API**: Complete CRUD operations for development
- **Utility Functions**: Color coding, formatting, and data manipulation helpers
- **Type Safety**: Full TypeScript support throughout

## File Structure

```
src/
├── components/
│   ├── maps/
│   │   ├── PipelineMap.tsx          # Main map component
│   │   ├── MapControls.tsx          # Layer toggles and filters
│   │   └── PipelineTable.tsx        # Table view component
│   └── layout/
│       └── OperatorNav.tsx          # Updated with Pipeline section
├── pages/
│   └── operator/
│       └── PipelinePage.tsx         # Main pipeline dashboard
├── types/
│   └── index.ts                     # Updated with Pipeline types
├── utils/
│   └── pipelineAPI.ts              # API layer and utilities
└── App.tsx                         # Updated routing

public/
└── data/
    └── pipelines.json              # Sample pipeline data

data-2.0/
├── schema-reference.md             # Updated with Pipeline schema
└── sample-data.md                  # Updated with pipeline examples
```

## Pipeline Data Model

### Database Schema (Prisma)
```prisma
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
```

### TypeScript Interface
```typescript
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
```

## Map Features

### Pipeline Visualization
- **Polylines**: Pipeline routes displayed as colored lines
- **Color Coding**:
  - Blue (#3B82F6): Transport pipelines
  - Green (#10B981): Storage pipelines
  - Orange (#F59E0B): Utilization pipelines
  - Purple (#8B5CF6): Injection pipelines
- **Opacity**: Active pipelines are more opaque than planned/inactive ones
- **Thickness**: Active pipelines are thicker (4px) than others (3px)

### Interactive Features
- **Click to View Details**: Click on any pipeline to see info window
- **Layer Toggles**: Show/hide facilities and pipelines
- **Filtering**: Filter by pipeline type and status
- **Responsive Design**: Works on desktop and mobile devices

### Info Window Content
- Pipeline name and operator
- Type and status badges
- Capacity, length, and diameter
- Route point count

## Controls & Filtering

### Map Controls Panel
- **Layer Toggles**: Facilities and pipelines visibility
- **Pipeline Type Filter**: Filter by Transport, Storage, Utilization, or Injection
- **Status Filter**: Filter by Active, Planned, Under Construction, or Inactive
- **Legend**: Visual guide for colors and symbols
- **Clear Filters**: Reset all filters

### Table View
- **Sortable Columns**: Sort by name, operator, type, capacity, length, diameter, or status
- **Click to Select**: Click on any row to view details on map
- **Responsive Design**: Horizontal scroll on smaller screens

## Sample Data

The implementation includes 15 realistic pipeline records covering:

### Pipeline Types Distribution
- **Transport Pipelines**: 8 pipelines (650+ miles, 2.1M tons/year capacity)
- **Storage Pipelines**: 3 pipelines (45+ miles, 800K tons/year capacity)
- **Utilization Pipelines**: 3 pipelines (25+ miles, 400K tons/year capacity)
- **Injection Pipelines**: 1 pipeline (2.5 miles, 200K tons/year capacity)

### Status Distribution
- **Active**: 10 pipelines
- **Planned**: 3 pipelines
- **Under Construction**: 2 pipelines

### Geographic Coverage
- **Baton Rouge to Lake Charles**: Major transport corridor
- **Lafayette Regional Network**: BayouBio operations
- **Alexandria Storage Hub**: BioPulp infrastructure
- **Houma Delta Network**: Delta Gas operations

## API Endpoints

The mock API provides these endpoints:

```typescript
// GET /api/pipelines - Get all pipelines
getAllPipelines(): Promise<Pipeline[]>

// GET /api/pipelines/:id - Get specific pipeline
getPipelineById(id: string): Promise<Pipeline | null>

// POST /api/pipelines - Create new pipeline
createPipeline(pipeline: Omit<Pipeline, 'id'>): Promise<Pipeline>

// PUT /api/pipelines/:id - Update pipeline
updatePipeline(id: string, pipeline: Partial<Pipeline>): Promise<Pipeline>

// DELETE /api/pipelines/:id - Delete pipeline
deletePipeline(id: string): Promise<void>

// GET /api/pipelines/by-status/:status - Get pipelines by status
getPipelinesByStatus(status: Pipeline['status']): Promise<Pipeline[]>

// GET /api/pipelines/by-type/:type - Get pipelines by type
getPipelinesByType(type: Pipeline['pipelineType']): Promise<Pipeline[]>

// GET /api/pipelines/by-operator/:operator - Get pipelines by operator
getPipelinesByOperator(operator: string): Promise<Pipeline[]>
```

## Usage

### Accessing the Pipeline Section
1. Navigate to the Operator portal
2. Click on "Pipeline Infrastructure" in the navigation menu
3. The pipeline dashboard will load with map and controls

### Using the Map
1. **View Pipelines**: Pipelines are shown as colored lines on the map
2. **Filter by Type**: Use the controls panel to filter by pipeline type
3. **Filter by Status**: Filter to show only active, planned, or under construction pipelines
4. **View Details**: Click on any pipeline to see detailed information
5. **Toggle Layers**: Show/hide facilities and pipelines as needed

### Using the Table View
1. Switch to "List View" using the view toggle buttons
2. Sort columns by clicking on headers
3. Click on any row to view that pipeline on the map
4. Use filters to narrow down results

## Technical Implementation

### Google Maps Integration
- Uses `@react-google-maps/api` library
- Loads Louisiana GeoJSON boundary data
- Implements polylines for pipeline routes
- Provides interactive info windows

### State Management
- React hooks for local state management
- API calls for data loading
- Filter state management
- View mode switching

### Styling
- Tailwind CSS for consistent styling
- Custom color scheme matching Data 2.0 design
- Responsive design for mobile compatibility
- Loading states and error handling

## Future Enhancements

### Planned Features
1. **Pipeline Form**: Add/edit pipeline functionality
2. **Real-time Updates**: Live pipeline status updates
3. **Performance Metrics**: Pipeline utilization and efficiency
4. **Incident Tracking**: Pipeline-related incidents and maintenance
5. **Export Functionality**: Export pipeline data to various formats

### Integration Opportunities
1. **Flow Data**: Connect pipeline data with existing flow tracking
2. **Facility Integration**: Enhanced facility-pipeline relationships
3. **Reporting**: Pipeline-specific compliance reports
4. **Analytics**: Pipeline performance analytics and predictions

## Dependencies

### Required Packages
- `@react-google-maps/api`: Google Maps integration
- `lucide-react`: Icons
- `recharts`: Charts (if analytics are added)

### Environment Variables
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key

## Configuration

### Google Maps Setup
1. Get API key from Google Cloud Console
2. Enable Maps JavaScript API
3. Add key to environment variables or `src/config/maps.ts`
4. Configure API restrictions as needed

### Data Loading
- Pipeline data is loaded from `/public/data/pipelines.json`
- Facility data is currently mocked in the component
- In production, this would connect to a real API

## Testing

### Manual Testing Checklist
- [ ] Pipeline map loads correctly
- [ ] All pipelines display with correct colors
- [ ] Info windows show correct data
- [ ] Filters work properly
- [ ] Table view displays correctly
- [ ] Sorting works in table
- [ ] Navigation integration works
- [ ] Responsive design on mobile

### Data Validation
- [ ] All pipeline coordinates are within Louisiana bounds
- [ ] Pipeline types match defined enum values
- [ ] Status values are valid
- [ ] Capacity and length values are realistic
- [ ] Route coordinates form valid paths

## Troubleshooting

### Common Issues
1. **Map not loading**: Check Google Maps API key
2. **Pipelines not showing**: Verify pipeline data is loaded
3. **Filters not working**: Check filter state management
4. **Performance issues**: Consider implementing virtualization for large datasets

### Debug Information
- Console logs are included for debugging
- Error boundaries handle component failures
- Loading states provide user feedback
- Fallback UI for API failures

## Conclusion

The Pipeline Infrastructure implementation provides a comprehensive solution for tracking and visualizing CO₂ pipeline infrastructure in Louisiana. It integrates seamlessly with the existing Data 2.0 system while providing powerful new capabilities for operators to monitor and manage pipeline assets.

The implementation follows Data 2.0 design patterns and maintains consistency with the existing codebase. It's built with scalability in mind and provides a solid foundation for future enhancements and integrations.

