# Facilities Data System - Documentation

## ✅ What Was Implemented

### 1. **Centralized Data File** (`src/data/facilities.json`)
- **22 total facilities** including:
  - 3 Active carbon capture facilities (green markers)
  - 19 Monitored emission sources (orange markers)
- Each facility includes:
  - `id`: Unique identifier
  - `name`: Facility name
  - `lat`, `lng`: GPS coordinates
  - `type`: Facility type (Power plant, Refinery, Shipping, etc.)
  - `emissions`: CO₂ emissions amount
  - `unit`: Measurement unit
  - `year`: Data year (2024)
  - `status`: "active" or "monitored"

### 2. **Enhanced Map Component** (`src/components/maps/FacilityMap.tsx`)
- **Custom Factory Icon**: Uses `/image/factory.png` for all markers
- **Rich Info Windows**: Click any marker to see:
  - Facility name (styled header)
  - Facility type badge (color-coded: green for active, orange for monitored)
  - Emissions data with formatted numbers
  - GPS coordinates
- **Loading State**: Waits for Google Maps to fully load before rendering markers

### 3. **Updated Public Home Page**
- Imports data from JSON file
- Shows all 22 facilities on the map
- Legend showing Active Capture (green) vs Monitored (orange)
- Dynamic count in description

---

## 📊 Facility Categories

### **Active Carbon Capture (3 facilities)**
These are actively capturing and sequestering CO₂:
1. Port Allen Ethanol
2. Geismar Ammonia  
3. St. James Industrial

### **Monitored Facilities (19 locations)**
These are emission sources being tracked:
- **Power Plants** (7): Ouachita, Brame Energy, Dow St Charles, Acadia Energy, Coughlin, RS Cogen, Perryville
- **Refineries** (2): Calumet Shreveport, Citgo Lake Charles
- **Shipping** (4): Port Sulphur, New Orleans, Cameron LNG, Venture Global LNG
- **Waste Sites** (2): White Oaks Landfill, Sabine Parish Landfill
- **Industrial** (4): ADA Carbon Solutions, Almatis Burnside, Linde Inc, Fieldwood

---

## 🎨 Visual Design

### **Map Markers**
- All markers use the custom factory icon (`/image/factory.png`)
- Icon size: 32x32 pixels
- Anchor point: Bottom center (so icon sits on correct location)

### **Info Windows**
- **Header**: Blue (#174B7A) with teal underline (#1AAE9F)
- **Type Badge**: 
  - Green (#1AAE9F) for active capture facilities
  - Orange (#E9A23B) for monitored facilities
- **Emissions**: 
  - Green text (#10B981) for active facilities
  - Red text (#D64545) for monitored facilities
- **Coordinates**: Gray text at bottom with 📍 icon

### **Legend**
- Two-color legend shown above map:
  - 🟢 Green dot = Active Capture
  - 🟠 Orange dot = Monitored

---

## 🔧 How to Modify the Data

### **Adding a New Facility**
Edit `src/data/facilities.json` and add a new entry:

```json
{
  "id": "unique-facility-id",
  "name": "Facility Name",
  "lat": 30.1234,
  "lng": -91.5678,
  "type": "Power plant",
  "emissions": 500000,
  "unit": "tCO₂e 100yr",
  "year": 2024,
  "status": "monitored"
}
```

### **Updating Existing Data**
Simply edit the values in `facilities.json` - changes will automatically reflect on the map.

### **Changing the Marker Icon**
1. Replace `/public/image/factory.png` with your custom icon
2. Or update the icon path in `FacilityMap.tsx` line 132:
   ```tsx
   icon={{
     url: '/image/your-custom-icon.png',
     scaledSize: new window.google.maps.Size(32, 32),
     anchor: new window.google.maps.Point(16, 32),
   }}
   ```

---

## 🎯 Benefits of This Approach

### **✅ Separation of Concerns**
- Data is separate from code
- Easy to update without touching components
- Can be managed by non-developers

### **✅ Scalability**
- Add unlimited facilities without code changes
- JSON can be replaced with API calls later
- Easy to export/import data

### **✅ Type Safety**
- TypeScript interface ensures data consistency
- Auto-complete in IDE for facility properties

### **✅ Maintainability**
- Single source of truth for facility data
- Changes automatically propagate to all views
- Easy to version control

---

## 🚀 Future Enhancements

### **Potential Improvements:**

1. **Filtering**
   - Filter by facility type
   - Show/hide active vs monitored
   - Search by name

2. **Data Source**
   - Replace JSON with API endpoint
   - Real-time data updates
   - Historical data tracking

3. **Clustering**
   - Group nearby markers at low zoom
   - Show cluster count
   - Expand on click

4. **Advanced Info Windows**
   - Charts showing trends
   - Links to facility details page
   - Download facility report

5. **Multiple Icon Types**
   - Different icons per facility type
   - Size based on emissions
   - Color gradient by severity

---

## 📝 Data Structure Reference

```typescript
interface Facility {
  id: string;              // Unique identifier (kebab-case)
  name: string;            // Display name
  lat: number;             // Latitude (decimal degrees)
  lng: number;             // Longitude (decimal degrees)
  type: string;            // Facility category
  emissions: number;       // CO₂ amount (numeric)
  unit: string;            // Measurement unit
  year: number;            // Data year
  status: 'active' | 'monitored';  // Facility status
}
```

---

## 🎨 Customization Quick Reference

### **Change Active Facility Color**
File: `src/components/maps/FacilityMap.tsx`
Line: 159
```tsx
backgroundColor: selectedFacility.status === 'active' ? '#YOUR_COLOR' : '#E9A23B'
```

### **Change Monitored Facility Color**  
File: `src/components/maps/FacilityMap.tsx`
Line: 159
```tsx
backgroundColor: selectedFacility.status === 'active' ? '#1AAE9F' : '#YOUR_COLOR'
```

### **Adjust Map Zoom Level**
File: `src/components/maps/FacilityMap.tsx`
Line: 97
```tsx
zoom={9}  // Change to 7 for wider view, 11 for closer view
```

### **Change Map Center**
File: `src/components/maps/FacilityMap.tsx`
Lines: 23-26
```tsx
const center = {
  lat: 30.2672,  // Louisiana center
  lng: -91.0,
};
```

---

## ✨ Summary

You now have a fully functional, data-driven facility map system with:
- ✅ 22 facilities with detailed information
- ✅ Custom factory icons
- ✅ Rich, styled info windows
- ✅ Easy-to-maintain JSON data file
- ✅ Type-safe TypeScript implementation
- ✅ Professional visual design
- ✅ Scalable architecture

**The map will automatically update when you modify `facilities.json`!** 🎉

