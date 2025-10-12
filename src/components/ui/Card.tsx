import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
};

interface KPICardProps {
  label: string;
  value: number;
  unit: string;
  change: number;
  period?: string;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  unit,
  change,
  period,
  onClick,
}) => {
  const isPositive = change >= 0;

  return (
    <Card className="kpi-card" onClick={onClick}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        {period && (
          <span className="text-xs text-gray-500 uppercase">{period}</span>
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold text-gray-900">
          {value.toLocaleString('en-US', { maximumFractionDigits: 1 })}
        </span>
        <span className="text-sm font-medium text-gray-600">{unit}</span>
      </div>
      <div className="flex items-center gap-1">
        <span
          className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
        <span className="text-xs text-gray-500">vs previous</span>
      </div>
    </Card>
  );
};
