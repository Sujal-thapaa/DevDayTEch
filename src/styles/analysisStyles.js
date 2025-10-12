/**
 * Analysis Dashboard Styling Utilities
 * Professional styling constants and helper functions
 */

// ==================== COLOR SCHEME ====================

export const colors = {
  // Primary - Blue tones
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Success - Green tones
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Warning - Orange/Yellow tones
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error - Red tones
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Neutral - Gray tones
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Chart colors
  chart: [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Deep Orange
  ],
};

// ==================== TYPOGRAPHY ====================

export const typography = {
  pageTitle: 'text-3xl font-bold text-gray-900',
  pageSubtitle: 'text-gray-600 mt-2',
  sectionTitle: 'text-xl font-semibold text-gray-900',
  sectionSubtitle: 'text-sm text-gray-600',
  cardTitle: 'text-lg font-semibold text-gray-900',
  kpiValue: 'text-4xl font-bold',
  kpiLabel: 'text-sm text-gray-600',
  label: 'text-sm font-medium text-gray-700',
  helpText: 'text-xs text-gray-500',
};

// ==================== SPACING ====================

export const spacing = {
  sectionGap: 'gap-6',
  sectionMargin: 'mb-8',
  cardPadding: 'p-6',
  cardMargin: 'mb-6',
  gridGap: 'gap-6',
  stackGap: 'space-y-4',
};

// ==================== COMPONENTS ====================

export const components = {
  card: 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200',
  cardHeader: 'border-b border-gray-200 pb-4 mb-4',
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    outline: 'border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200',
  },
  badge: {
    success: 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold',
    warning: 'bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold',
    error: 'bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold',
    info: 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold',
  },
  table: {
    container: 'overflow-x-auto',
    table: 'min-w-full divide-y divide-gray-200',
    thead: 'bg-gray-50',
    th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    tbody: 'bg-white divide-y divide-gray-200',
    td: 'px-6 py-4 whitespace-nowrap text-sm',
  },
};

// ==================== ANIMATIONS ====================

export const animations = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get color based on risk level
 */
export function getRiskColor(score) {
  if (score >= 70) return colors.error[500];
  if (score >= 40) return colors.warning[500];
  return colors.success[500];
}

/**
 * Get background color based on risk level
 */
export function getRiskBgColor(score) {
  if (score >= 70) return colors.error[50];
  if (score >= 40) return colors.warning[50];
  return colors.success[50];
}

/**
 * Format large numbers
 */
export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined) return 'N/A';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format currency
 */
export function formatCurrency(value, decimals = 0) {
  if (value === null || value === undefined) return 'N/A';
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Get trend icon class
 */
export function getTrendClass(value, isPositiveGood = false) {
  if (value > 0) {
    return isPositiveGood ? 'text-green-600' : 'text-red-600';
  } else if (value < 0) {
    return isPositiveGood ? 'text-red-600' : 'text-green-600';
  }
  return 'text-gray-600';
}

/**
 * Skeleton loader component class
 */
export const skeletonLoader = {
  base: 'animate-pulse bg-gray-200 rounded',
  text: 'h-4 bg-gray-200 rounded',
  title: 'h-8 bg-gray-200 rounded w-1/3',
  card: 'h-64 bg-gray-200 rounded-lg',
  chart: 'h-80 bg-gray-200 rounded-lg',
};

/**
 * Empty state component class
 */
export const emptyState = {
  container: 'flex flex-col items-center justify-center py-12 text-center',
  icon: 'h-12 w-12 text-gray-400 mb-4',
  title: 'text-lg font-semibold text-gray-900 mb-2',
  description: 'text-sm text-gray-600 max-w-md',
};

/**
 * Responsive breakpoints
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Chart configuration defaults
 */
export const chartConfig = {
  margin: { top: 10, right: 30, left: 0, bottom: 0 },
  colors: colors.chart,
  height: 300,
  lineStrokeWidth: 2,
  barCategoryGap: '20%',
  animationDuration: 1000,
  tooltip: {
    contentStyle: {
      backgroundColor: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '12px',
    },
    cursor: { stroke: colors.gray[300], strokeWidth: 1 },
  },
};

/**
 * Loading spinner component
 */
export function LoadingSpinner({ size = 'md', color = 'blue' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    orange: 'border-orange-600',
    gray: 'border-gray-600',
  };

  return `animate-spin rounded-full ${sizes[size]} border-t-4 border-b-4 ${colorClasses[color]}`;
}

/**
 * Grid responsive classes
 */
export const gridClasses = {
  cols1: 'grid grid-cols-1',
  cols2: 'grid grid-cols-1 md:grid-cols-2',
  cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  cols6: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
};

export default {
  colors,
  typography,
  spacing,
  components,
  animations,
  getRiskColor,
  getRiskBgColor,
  formatNumber,
  formatCurrency,
  formatPercent,
  getTrendClass,
  skeletonLoader,
  emptyState,
  breakpoints,
  chartConfig,
  gridClasses,
};

