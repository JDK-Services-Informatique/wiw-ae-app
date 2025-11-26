import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Charts, { BarChartComponent, LineChartComponent, PieChartComponent } from '../Charts';

// Mock Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />
}));

describe('Charts Components', () => {
  const mockData = [
    { label: 'Jan', value: 100 },
    { label: 'Fév', value: 200 },
    { label: 'Mar', value: 150 }
  ];

  describe('Charts (Wrapper)', () => {
    it('devrait rendre un graphique en barres par défaut', () => {
      render(<Charts data={mockData} title="Test Chart" />);
      expect(screen.getByText('Test Chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('devrait rendre un graphique en ligne avec type="line"', () => {
      render(<Charts data={mockData} type="line" title="Line Chart" />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('devrait rendre un graphique en camembert avec type="pie"', () => {
      render(<Charts data={mockData} type="pie" title="Pie Chart" />);
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('devrait rendre un graphique en aires avec type="area"', () => {
      render(<Charts data={mockData} type="area" title="Area Chart" />);
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('BarChartComponent', () => {
    it('devrait rendre un graphique en barres', () => {
      render(<BarChartComponent data={mockData} />);
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('LineChartComponent', () => {
    it('devrait rendre un graphique en ligne', () => {
      render(<LineChartComponent data={mockData} />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  describe('PieChartComponent', () => {
    it('devrait rendre un graphique en camembert', () => {
      render(<PieChartComponent data={mockData} />);
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });
});

