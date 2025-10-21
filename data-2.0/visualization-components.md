# Polaris Visualization Components

## Map Visualization Architecture

### Core Technologies
- **Deck.gl**: WebGL-powered visualization framework
- **React Map GL**: React wrapper for Mapbox GL JS
- **Mapbox**: Base map tiles and styling
- **Custom Particle System**: Animated flow visualization

### Map Components

#### 1. Main Visualization (`Viz.tsx`)
```typescript
// Key state management
const [period, setPeriod] = useState<Period>('2025-Q3');
const [companies, setCompanies] = useState<Company[]>([]);
const [facilities, setFacilities] = useState<Record<string, Facility>>({});
const [flows, setFlows] = useState<Flow[]>([]);
const [pathData, setPathData] = useState<PathData[]>([]);
const [particles, setParticles] = useState<Particle[]>([]);
```

#### 2. Facility Markers
- **Type**: Deck.gl ScatterplotLayer
- **Data**: Facilities with lat/lon coordinates
- **Styling**: Color-coded by facility type
- **Interaction**: Click to show company details

#### 3. Flow Visualization
- **Type**: Custom particle system
- **Implementation**: `particles.ts`
- **Animation**: Particles move along curved paths
- **Scaling**: Particle count and speed based on tonnage

### Flow Color Coding

```typescript
const FLOW_COLORS: Record<string, [number, number, number, number]> = {
  storage: [0, 122, 255, 200],     // Blue for storage flows
  utilization: [44, 234, 163, 200], // Green for utilization flows
  default: [154, 160, 166, 180],   // Gray for other flows
};
```

### Particle System Implementation

#### Particle Creation
```typescript
// Particles per flow based on tonnage
const tonnageRatio = path.tons / maxTons;
const particleCount = Math.round(
  MIN_PARTICLES + (MAX_PARTICLES - MIN_PARTICLES) * tonnageRatio
);

// Speed based on tonnage
const speed = BASE_SPEED * (0.5 + tonnageRatio * 1.5);
```

#### Animation Loop
```typescript
// Update particle positions
particle.progress += particle.speed;
if (particle.progress >= 1) {
  particle.progress = 0; // Loop back to start
}

// Calculate position along curved path
const position = getPositionOnPath(path.path, particle.progress);
```

### Curved Path Generation

#### Bézier Arc Implementation (`curves.ts`)
```typescript
export function makeArc(
  from: [number, number],
  to: [number, number],
  curviness = 0.2,
  segments = 32,
): [number, number][] {
  // Calculate midpoint
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  
  // Create perpendicular control point
  const dx = x1 - x0;
  const dy = y1 - y0;
  const nx = -dy;
  const ny = dx;
  
  // Generate quadratic Bézier curve points
  // B(t) = (1-t)²*P0 + 2(1-t)t*C + t²*P1
}
```

## Data Dashboard Components

### 1. Metrics Table (`Data.tsx`)
- **Purpose**: Tabular display of company performance
- **Features**: Sorting, filtering, export
- **Data**: Quarterly metrics snapshots

### 2. Charts and Visualizations
- **Time Series**: Historical trends over quarters
- **Sector Breakdown**: Pie charts by industry
- **Comparison Charts**: Company performance comparison
- **Utilization Rates**: Bar charts showing efficiency

### 3. Filters and Controls
```typescript
// Query state management
const { period, sector, companies, set } = useQueryFilters();

// Filter data based on selections
const filtered = useMemo(() => {
  if (!companies.length) return rows;
  const setIds = new Set(companies);
  return rows.filter((r) => setIds.has(r.companyId));
}, [rows, companies]);
```

## Company Panel Component

### Detailed Company View (`CompanyPanel.tsx`)
- **Purpose**: Detailed metrics for selected company
- **Features**: 
  - Trend charts over time
  - Facility breakdown
  - Performance metrics
  - Reporting status

### Trend Data Processing
```typescript
const trendData = useMemo(() => {
  const companyMetrics = metrics.filter(
    (m: MetricsRow) => m.companyId === companyId
  );
  const periods = [...new Set(companyMetrics.map((m) => m.period))].sort();
  
  return periods.map((p) => {
    const m = companyMetrics.find((metric) => metric.period === p);
    return {
      period: p,
      Captured: m ? Number(m.capturedTons || 0) / 1000 : 0,
      Utilized: m ? Number(m.utilizedTons || 0) / 1000 : 0,
      Stored: m ? Number(m.storedTons || 0) / 1000 : 0,
    };
  });
}, [metrics, companyId]);
```

## Leaderboard Modal

### Performance Rankings (`LeaderboardModal.tsx`)
- **Purpose**: Company performance comparison
- **Tabs**: 
  - Capture Leaders (by tonnage)
  - Utilization Leaders (by efficiency)
  - Accountability Leaders (by score)
  - Storage Leaders (by capacity)

### Ranking Logic
```typescript
// Sort by different metrics
const captureLeaders = companies.sort((a, b) => 
  Number(b.capturedTons) - Number(a.capturedTons)
);

const utilizationLeaders = companies.sort((a, b) => 
  b.utilizationRate - a.utilizationRate
);

const accountabilityLeaders = companies.sort((a, b) => 
  b.accountabilityScore - a.accountabilityScore
);
```

## Interactive Features

### 1. Map Interactions
- **Zoom Controls**: Pan and zoom map
- **Facility Selection**: Click markers for details
- **Company Filtering**: Show/hide company facilities
- **Period Selection**: Switch between quarters

### 2. Data Interactions
- **Sorting**: Click column headers to sort
- **Filtering**: Dropdown filters for sector/period
- **Search**: Text search for companies
- **Export**: Download filtered data as CSV

### 3. Animation Controls
- **Play/Pause**: Control particle animation
- **Speed**: Adjust animation speed
- **Opacity**: Control flow visibility
- **Highlight**: Emphasize specific flows

## Performance Optimizations

### 1. Rendering Optimizations
- **WebGL**: Hardware-accelerated rendering
- **Level of Detail**: Reduce particles at high zoom
- **Culling**: Only render visible elements
- **Batching**: Group similar draw calls

### 2. Data Optimizations
- **Memoization**: Cache expensive calculations
- **Virtualization**: Only render visible table rows
- **Debouncing**: Limit filter update frequency
- **Lazy Loading**: Load data on demand

### 3. Memory Management
- **Object Pooling**: Reuse particle objects
- **Cleanup**: Dispose unused resources
- **Garbage Collection**: Minimize allocations
- **State Management**: Efficient state updates

## Responsive Design

### 1. Mobile Adaptations
- **Touch Controls**: Swipe and pinch gestures
- **Simplified UI**: Reduced complexity on small screens
- **Performance**: Lower particle counts on mobile
- **Navigation**: Collapsible sidebar

### 2. Desktop Features
- **Keyboard Shortcuts**: Power user features
- **Multi-selection**: Select multiple companies
- **Advanced Filters**: Complex query building
- **Full-screen Mode**: Immersive visualization

## Accessibility Features

### 1. Visual Accessibility
- **Color Contrast**: High contrast color schemes
- **Color Blind Support**: Alternative visual indicators
- **Text Scaling**: Responsive font sizes
- **Focus Indicators**: Clear focus states

### 2. Interaction Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **Alternative Text**: Descriptive alt text
- **Error Handling**: Clear error messages

## Customization Options

### 1. Theme Support
- **Dark/Light Mode**: Toggle between themes
- **Color Schemes**: Customizable color palettes
- **Font Options**: Multiple font families
- **Layout Options**: Flexible layout configurations

### 2. Data Visualization Options
- **Chart Types**: Multiple chart options
- **Animation Styles**: Different animation effects
- **Map Styles**: Various map tile options
- **Particle Effects**: Customizable particle appearance
