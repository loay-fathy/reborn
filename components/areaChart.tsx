"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  month?: string;
  day?: string;
  amount: number;
  [key: string]: any;
}

interface SpendingAreaChartProps {
  data: ChartDataPoint[];
  color?: string;
  xAxisKey?: string;
}

const formatCurrency = (value: number) => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value}`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 border border-gray-200 rounded shadow-sm">
        <p className="text-sm font-medium text-gray-600">
          {`Revenue: $${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
};

const SpendingAreaChart: React.FC<SpendingAreaChartProps> = ({
  data,
  color = "#92400e",
  xAxisKey = "month",
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#E5E7EB"
        />
        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          dy={10}
        />
        <YAxis
          tickFormatter={formatCurrency}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Area
          type="monotone"
          dataKey="amount"
          stroke={color}
          strokeWidth={3}
          fill={`url(#gradient-${color})`}
          dot={{
            fill: color,
            r: 4,
            stroke: "#fff",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 6,
            stroke: color,
            strokeWidth: 0,
            fill: color,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SpendingAreaChart;
