import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { formatCurrency } from '../utils/formatNumber';

/**
 * Composant Charts - Visualisations réutilisables
 * Collection de graphiques prêts à l'emploi pour Dashboard et Pipeline
 */

const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

/**
 * Graphique en barres
 */
export function BarChartComponent({ data, dataKey = 'value', xKey = 'label', height = 300, showLegend = true, colors = COLORS }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey={xKey} 
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#64748b"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
            return value.toString();
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
          formatter={(value) => {
            if (typeof value === 'number' && value > 1000) {
              return formatCurrency(value, 0);
            }
            return value;
          }}
        />
        {showLegend && <Legend />}
        <Bar dataKey={dataKey} fill={colors[0]} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Graphique en ligne
 */
export function LineChartComponent({ data, dataKey = 'value', xKey = 'label', height = 300, showLegend = true, strokeColor = '#7c3aed' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey={xKey} 
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#64748b"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
            return value.toString();
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
          formatter={(value) => {
            if (typeof value === 'number' && value > 1000) {
              return formatCurrency(value, 0);
            }
            return value;
          }}
        />
        {showLegend && <Legend />}
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={strokeColor} 
          strokeWidth={2}
          dot={{ fill: strokeColor, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * Graphique en camembert
 */
export function PieChartComponent({ data, dataKey = 'value', nameKey = 'name', height = 300, colors = COLORS }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ [nameKey]: name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => {
            if (typeof value === 'number' && value > 1000) {
              return formatCurrency(value, 0);
            }
            return value;
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

/**
 * Graphique en aires
 */
export function AreaChartComponent({ data, dataKey = 'value', xKey = 'label', height = 300, showLegend = true, colors = COLORS }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={colors[0]} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey={xKey} 
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#64748b"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
            return value.toString();
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
          formatter={(value) => {
            if (typeof value === 'number' && value > 1000) {
              return formatCurrency(value, 0);
            }
            return value;
          }}
        />
        {showLegend && <Legend />}
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={colors[0]} 
          fillOpacity={1} 
          fill="url(#colorValue)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/**
 * Graphique combiné (barres + lignes)
 */
export function ComboChartComponent({ data, barDataKey, lineDataKey, xKey = 'label', height = 300, showLegend = true, colors = COLORS }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey={xKey} 
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          yAxisId="left"
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        {showLegend && <Legend />}
        <Bar yAxisId="left" dataKey={barDataKey} fill={colors[0]} radius={[8, 8, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey={lineDataKey} stroke={colors[1]} strokeWidth={2} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Composant wrapper pour les graphiques avec titre et options
 */
export default function Charts({ 
  title, 
  type = 'bar', 
  data, 
  dataKey = 'value',
  xKey = 'label',
  height = 300,
  className = '',
  ...props 
}) {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <BarChartComponent data={data} dataKey={dataKey} xKey={xKey} height={height} {...props} />;
      case 'line':
        return <LineChartComponent data={data} dataKey={dataKey} xKey={xKey} height={height} {...props} />;
      case 'pie':
        return <PieChartComponent data={data} dataKey={dataKey} nameKey={xKey} height={height} {...props} />;
      case 'area':
        return <AreaChartComponent data={data} dataKey={dataKey} xKey={xKey} height={height} {...props} />;
      default:
        return <BarChartComponent data={data} dataKey={dataKey} xKey={xKey} height={height} {...props} />;
    }
  };

  return (
    <div className={`bg-white dark:bg-dark-panel p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm ${className}`}>
      {title && (
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">{title}</h3>
      )}
      {renderChart()}
    </div>
  );
}

