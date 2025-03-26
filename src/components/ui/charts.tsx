
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export interface ChartProps {
  data: any;
  height?: number | string;
}

export const BarChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data.labels.map((label: string, index: number) => {
          const dataPoint: Record<string, any> = { name: label };
          data.datasets.forEach((dataset: any) => {
            dataPoint[dataset.label] = dataset.data[index];
          });
          return dataPoint;
        })}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset: any, index: number) => (
          <Bar
            key={dataset.label}
            dataKey={dataset.label}
            fill={dataset.backgroundColor || `#${Math.floor(Math.random()*16777215).toString(16)}`}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export const LineChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data.labels.map((label: string, index: number) => {
          const dataPoint: Record<string, any> = { name: label };
          data.datasets.forEach((dataset: any) => {
            dataPoint[dataset.label] = dataset.data[index];
          });
          return dataPoint;
        })}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset: any) => (
          <Line
            key={dataset.label}
            type={dataset.tension ? "monotone" : "linear"}
            dataKey={dataset.label}
            stroke={dataset.borderColor || `#${Math.floor(Math.random()*16777215).toString(16)}`}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export const PieChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data.labels.map((label: string, index: number) => ({
            name: label,
            value: data.datasets[0].data[index],
          }))}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          dataKey="value"
        >
          {data.labels.map((_: any, index: number) => (
            <Cell key={`cell-${index}`} fill={data.datasets[0].backgroundColor[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
