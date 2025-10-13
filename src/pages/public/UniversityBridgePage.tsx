import React, { useState } from 'react';
import { ExternalLink, Search, Calendar, Award, Newspaper } from 'lucide-react';

interface NewsItem {
  id: number;
  university: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  impact: string;
  link: string;
  badge: string;
}

const universityNews: NewsItem[] = [
  {
    id: 1,
    university: "Louisiana State University (LSU)",
    title: "CO2 Research Well for Carbon Storage Testing",
    date: "September 2024 - Early 2025",
    category: "Carbon Storage Research",
    summary: "LSU drilling third research well at PERTT Lab in collaboration with Halliburton, ExxonMobil, Shell, Chevron, and H&P to study CO2 storage in geological formations",
    impact: "Industry-backed testbed for CO2 injection",
    link: "https://www.lsu.edu/eng/news/2024/09/lsu-pertt-new-co2-research-well.php",
    badge: "industry-backed"
  },
  {
    id: 2,
    university: "Harvard University",
    title: "Solar-Activated Molecules for CO2 Capture",
    date: "September 2025",
    category: "Direct Air Capture",
    summary: "Chemist Richard Liu designs molecules that use sunlight to change their chemical state and rapidly trap CO2, pointing to scalable solar-powered solution",
    impact: "Solar-powered carbon capture pathway",
    link: "https://news.harvard.edu/gazette/story/2025/09/seeking-a-carbon-capture-breakthrough/",
    badge: "breakthrough"
  },
  {
    id: 3,
    university: "Massachusetts Institute of Technology (MIT)",
    title: "6x More Efficient Electrochemical CO2 Capture",
    date: "May 2025",
    category: "Carbon Capture",
    summary: "Nanoscale filtering membranes improve electrochemical carbon-dioxide capture and release efficiency by 6x while cutting costs by at least 20%",
    impact: "Major efficiency and cost improvement",
    link: "https://news.mit.edu/2025/solving-bottleneck-co2-capture-and-conversion-0520",
    badge: "recent"
  },
  {
    id: 4,
    university: "University of Houston",
    title: "Breakthrough in Carbon Capture Cost Reduction",
    date: "August 2025",
    category: "Carbon Capture",
    summary: "Two significant breakthroughs that could reduce the cost of capturing harmful emissions from power plants",
    impact: "Cost reduction for industrial capture",
    link: "https://www.uh.edu/news-events/stories/2025/august/08212025-carbon-capture.php",
    badge: "recent"
  },
  {
    id: 5,
    university: "Stanford University",
    title: "Low-Cost Carbon Trapping Using Common Rocks",
    date: "February 2025",
    category: "Carbon Storage",
    summary: "New process uses heat to transform common minerals into materials that permanently sequester atmospheric CO₂",
    impact: "Major cost reduction in carbon capture",
    link: "https://news.stanford.edu/stories/2025/02/new-process-gets-common-rocks-to-trap-carbon-rapidly-cheaply",
    badge: "breakthrough"
  },
  {
    id: 6,
    university: "Princeton University",
    title: "Shared CO2 Pipeline Infrastructure Study",
    date: "March 2025",
    category: "Infrastructure",
    summary: "Research reveals that shared CO2 pipelines, rather than dedicated facilities, can reduce average transport costs by two-thirds",
    impact: "67% cost reduction in CO2 transport",
    link: "https://engineering.princeton.edu/news/2018/03/16/new-material-could-lower-cost-carbon-capture",
    badge: "infrastructure"
  },
  {
    id: 7,
    university: "Heriot-Watt University",
    title: "AI Accelerates Carbon Storage 100x Faster",
    date: "May 2024",
    category: "AI & Storage",
    summary: "AI reduces carbon storage modeling from 100 days to just 24 hours",
    impact: "Massive efficiency gain via AI",
    link: "https://www.hw.ac.uk/news/2024/ai-breakthrough-accelerates-carbon-capture-and-storage-from-100-days-to-just-24-hours",
    badge: "ai-powered"
  },
  {
    id: 8,
    university: "Temple University",
    title: "Sustainable Concrete with 80-100% Better Performance",
    date: "March 2025",
    category: "Utilization",
    summary: "Internal-external CO₂ curing method creates stronger, more durable concrete while capturing carbon",
    impact: "Building materials sequester CO₂",
    link: "https://news.temple.edu/news/2025-03-24/engineering-professor-s-breakthrough-may-lead-more-sustainable-concrete",
    badge: "recent"
  },
  {
    id: 9,
    university: "Massachusetts Institute of Technology (MIT)",
    title: "Ocean Carbon Capture Solution",
    date: "January 2024",
    category: "Ocean Carbon Removal",
    summary: "Novel carbon capture solution focuses on removing CO2 directly from the world's oceans using electrochemical processes",
    impact: "Opens new frontier for carbon removal",
    link: "https://carbonherald.com/mit-researchers-present-novel-solution-to-capture-carbon-from-oceans/",
    badge: "ocean-based"
  },
  {
    id: 10,
    university: "Cornell University",
    title: "New Catalysts for CO₂ Conversion",
    date: "January 2025",
    category: "Utilization",
    summary: "Designing new materials to capture CO₂ and convert it into useful chemicals and products",
    impact: "CO₂-to-chemicals pathway",
    link: "https://news.cornell.edu/stories/2025/01/what-you-need-know-about-carbon-capture-utilization-and-storage",
    badge: "recent"
  }
];

// University images map
const universityImages: Record<string, string> = {
  "Louisiana State University (LSU)": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop",
  "Harvard University": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop",
  "Massachusetts Institute of Technology (MIT)": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=400&fit=crop",
  "University of Houston": "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&h=400&fit=crop",
  "Stanford University": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&h=400&fit=crop",
  "Princeton University": "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=800&h=400&fit=crop",
  "Heriot-Watt University": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
  "Temple University": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop",
  "Cornell University": "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=400&fit=crop"
};

const getBadgeStyle = (badge: string) => {
  const styles: Record<string, string> = {
    'industry-backed': 'bg-purple-100 text-purple-800 border-purple-300',
    'breakthrough': 'bg-green-100 text-green-800 border-green-300',
    'recent': 'bg-blue-100 text-blue-800 border-blue-300',
    'infrastructure': 'bg-orange-100 text-orange-800 border-orange-300',
    'ai-powered': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'ocean-based': 'bg-cyan-100 text-cyan-800 border-cyan-300'
  };
  return styles[badge] || 'bg-gray-100 text-gray-800 border-gray-300';
};

const getBadgeLabel = (badge: string) => {
  const labels: Record<string, string> = {
    'industry-backed': 'Industry Backed',
    'breakthrough': 'Breakthrough',
    'recent': 'Recent',
    'infrastructure': 'Infrastructure',
    'ai-powered': 'AI Powered',
    'ocean-based': 'Ocean Based'
  };
  return labels[badge] || badge;
};

export const UniversityBridgePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(universityNews.map(news => news.category)))];

  const filteredNews = universityNews.filter(news => {
    const matchesSearch = 
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || news.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">University Bridge</h1>
        </div>
        <p className="text-lg text-gray-600 mb-6">
          Latest breakthroughs in carbon capture, storage, and utilization from leading research institutions
        </p>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by university, title, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <Newspaper className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-blue-900">Total Research</p>
          </div>
          <p className="text-3xl font-bold text-blue-900">{universityNews.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-900">Universities</p>
          </div>
          <p className="text-3xl font-bold text-green-900">{new Set(universityNews.map(n => n.university)).size}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-purple-600" />
            <p className="text-sm font-medium text-purple-900">Latest Update</p>
          </div>
          <p className="text-sm font-bold text-purple-900">September 2025</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink className="w-5 h-5 text-orange-600" />
            <p className="text-sm font-medium text-orange-900">Categories</p>
          </div>
          <p className="text-3xl font-bold text-orange-900">{categories.length - 1}</p>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredNews.length}</span> of {universityNews.length} research articles
        </p>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((news) => (
          <a
            key={news.id}
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
              <img
                src={universityImages[news.university] || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop'}
                alt={news.university}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-semibold text-sm">{news.university}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Badge and Date */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(news.badge)}`}>
                  {getBadgeLabel(news.badge)}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{news.date}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {news.title}
              </h3>

              {/* Category */}
              <p className="text-sm font-medium text-blue-600 mb-2">{news.category}</p>

              {/* Summary */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {news.summary}
              </p>

              {/* Impact */}
              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200 mb-3">
                <Award className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-green-900 mb-1">Impact</p>
                  <p className="text-xs text-green-800">{news.impact}</p>
                </div>
              </div>

              {/* Read More */}
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                <span>Read Full Article</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <div className="text-center py-16">
          <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

