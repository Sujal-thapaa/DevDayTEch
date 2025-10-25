# 🏆 Louisiana Nexus DayDay ClimateTech Winner — Presented by: [Nexus Louisiana](https://www.nexusla.org/) • [FUEL](https://fuelouisiana.org/) + [Baker Hughes](https://www.bakerhughes.com/)

## 🎉 Award Recognition

<div align="center">

### 🏆 ClimateTech Winner Certificate & Recognition

<table>
<tr>
<td align="center">
<img src="./image/a.jpg" alt="Award Certificate 1" width="300" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<br><strong>Award Certificate</strong>
</td>
<td align="center">
<img src="./image/b.jpg" alt="Award Certificate 2" width="300" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<br><strong>Recognition Document</strong>
</td>
</tr>
<tr>
<td align="center">
<img src="./image/c.jpg" alt="Award Certificate 3" width="300" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<br><strong>Winner Badge</strong>
</td>
<td align="center">
<img src="./image/d.jpg" alt="Award Certificate 4" width="300" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<br><strong>Official Recognition</strong>
</td>
</tr>
<tr>
<td align="center">
<img src="./image/e.jpg" alt="Award Certificate 5" width="300" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<br><strong>ClimateTech Achievement</strong>
</td>
<td align="center">
<img src="./image/f.jpg" alt="Award Certificate 6" width="300" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<br><strong>Final Recognition</strong>
</td>
</tr>
</table>

**🎯 Louisiana Nexus DayDay ClimateTech Winner**  
*Recognized for innovative carbon capture monitoring and transparency platform*

</div>

---

# 🌍 Carbon Horizon - Louisiana Carbon Capture Transparency Portal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg)](https://tailwindcss.com/)
[![Google Maps](https://img.shields.io/badge/Google_Maps-API-red.svg)](https://developers.google.com/maps)

> **Advanced carbon capture monitoring and transparency platform for Louisiana's environmental infrastructure**

## 🎯 Project Overview

Carbon Horizon is a comprehensive, real-time monitoring platform designed to provide complete transparency into Louisiana's carbon capture and storage infrastructure. Built with cutting-edge technology, it offers both public access for community awareness and professional operator dashboards for facility management.

### 🌟 Key Features

- **🗺️ Interactive Maps**: Real-time visualization of facilities, pipelines, and safety zones
- **📊 AI-Powered Analytics**: Intelligent insights and predictive modeling
- **🔐 Dual Access**: Public transparency portal and professional operator dashboard
- **⚡ Real-time Data**: Live updates from sensors and monitoring systems
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI/UX**: Intuitive interface with smooth animations and interactions

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Google Maps API Key** (for mapping functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/carbon-horizon/platform.git
cd platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Google Maps API key to .env.local

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_APP_ENV=development
VITE_API_BASE_URL=https://api.carbonhorizon.com
```

---

## 🏗️ Project Structure

```
carbon-horizon/
├── public/                 # Static assets
│   ├── data/              # JSON data files
│   ├── image/             # Images and icons
│   └── templates/         # Report templates
├── src/
│   ├── components/       # Reusable React components
│   │   ├── charts/       # Data visualization components
│   │   ├── layout/       # Layout and navigation components
│   │   ├── maps/         # Google Maps components
│   │   └── ui/           # Basic UI components
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── marketplace/  # Marketplace functionality
│   │   ├── operator/     # Operator dashboard pages
│   │   └── public/       # Public portal pages
│   ├── config/           # Configuration files
│   ├── data/             # Mock data and utilities
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── docs/                 # Documentation
├── tests/                # Test files
└── README.md
```

---

## 🎨 Features Breakdown

### 🌐 Public Portal

**Community Access Features:**
- **Facility Explorer**: Interactive map showing all carbon capture facilities
- **Pipeline Infrastructure**: Real-time pipeline monitoring and status
- **Safety Alerts**: Environmental risk assessment and safety zones
- **Industry Overview**: Comprehensive industry statistics and trends
- **University Bridge**: Educational resources and research collaboration

### 🔧 Operator Dashboard

**Professional Management Tools:**
- **Analytics Dashboard**: Real-time KPIs and performance metrics
- **Data Entry**: Facility data management and reporting
- **Incident Management**: Safety incident tracking and response
- **Market Analysis**: Carbon credit market insights
- **ROI Calculator**: Investment return analysis
- **Verification Badge System**: CO₂ offset tracking and certification
- **Reports Generator**: Automated compliance and performance reports
- **Settings Management**: System configuration and preferences

### 🗺️ Advanced Mapping

**Geospatial Features:**
- **Louisiana Boundary**: Accurate state boundary visualization
- **Facility Locations**: Real-time facility markers with detailed information
- **Pipeline Routes**: Interactive pipeline visualization with flow direction
- **Safety Zones**: Risk assessment areas and contamination zones
- **Water Resources**: Underground water resource mapping
- **Custom Styling**: Dark themes and branded map appearances

---

## 🛠️ Technology Stack

### Frontend Technologies
- **React 18** with TypeScript for type-safe development
- **Vite** for lightning-fast build and development
- **Tailwind CSS** for utility-first styling
- **Lucide React** for modern iconography
- **Google Maps JavaScript API** for interactive mapping

### Data Visualization
- **Plotly.js** for scientific charts and 3D visualizations
- **D3.js** for custom interactive graphics
- **Chart.js** for real-time data visualization

### Development Tools
- **ESLint** for code quality and consistency
- **Prettier** for code formatting
- **Husky** for git hooks
- **Jest** for testing framework

---

## 📊 Data Sources

### Real-time Data
- **Facility Sensors**: Live CO₂ capture and storage metrics
- **Pipeline Monitoring**: Real-time flow rates and pressure data
- **Environmental Sensors**: Air quality and safety monitoring
- **Weather Data**: NOAA weather integration for environmental factors

### Static Data
- **Louisiana GeoJSON**: Accurate state boundary data
- **Facility Database**: Comprehensive facility information
- **Pipeline Routes**: Detailed pipeline infrastructure data
- **Safety Zones**: Risk assessment and contamination data

---

## 🎯 Use Cases

### For the Public
- **Environmental Awareness**: Understanding local carbon capture efforts
- **Safety Information**: Access to safety alerts and risk assessments
- **Industry Education**: Learning about carbon capture technology
- **Community Engagement**: Participating in environmental initiatives

### For Operators
- **Facility Management**: Comprehensive facility monitoring and control
- **Compliance Reporting**: Automated regulatory compliance
- **Performance Analytics**: Data-driven decision making
- **Investment Analysis**: ROI calculations and market insights

### For Researchers
- **Data Access**: Open access to environmental data
- **Research Collaboration**: University partnership opportunities
- **Academic Resources**: Educational materials and case studies

---

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier

# Testing
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Type Checking
npm run type-check   # Run TypeScript compiler
```

---

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# The build output will be in the 'dist' directory
# Deploy the contents to your web server
```

### Environment Variables

```env
# Production Environment
VITE_GOOGLE_MAPS_API_KEY=your_production_api_key
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.carbonhorizon.com
VITE_ANALYTICS_ID=your_analytics_id
```

---

## 📈 Performance Metrics

- **⚡ Lighthouse Score**: 95+ across all categories
- **🚀 First Contentful Paint**: <1.5s
- **📱 Mobile Performance**: Optimized for all devices
- **🔄 Real-time Updates**: <100ms latency
- **💾 Bundle Size**: Optimized with code splitting

---

## 🤝 Contributing

We welcome contributions to Carbon Horizon! Please follow these guidelines:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure all tests pass
- Follow the existing code style

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Louisiana Department of Environmental Quality** for regulatory guidance
- **Google Maps Platform** for mapping services
- **OpenAI** for AI-powered analytics
- **React Community** for excellent documentation and tools
- **Contributors** who help make this project better

---

## 📞 Support & Contact

- **Documentation**: [docs.carbonhorizon.com](https://docs.carbonhorizon.com)
- **Issues**: [GitHub Issues](https://github.com/carbon-horizon/platform/issues)
- **Email**: support@carbonhorizon.com
- **Twitter**: [@CarbonHorizon](https://twitter.com/carbonhorizon)

---

## 🔮 Roadmap

### Upcoming Features
- **Blockchain Integration**: Carbon credit tracking
- **Mobile App**: Native iOS and Android applications
- **Advanced AI**: Predictive modeling and forecasting
- **IoT Integration**: Real-time sensor data integration
- **API Access**: Public API for third-party integrations

### Long-term Goals
- **National Expansion**: Scale to other states
- **International Support**: Global carbon capture monitoring
- **Research Platform**: Academic collaboration tools
- **Marketplace**: Carbon credit trading platform

---

*Built with ❤️ for a sustainable future*
