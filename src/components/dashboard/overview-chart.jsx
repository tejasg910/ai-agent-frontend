"use client";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export default function OverviewChart({ labels = [], data = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  // Convert labels and data arrays into the format Recharts expects
  const chartData = labels.map((month, index) => ({
    name: month,
    value: data[index] || 0,
  }));

  // Generate some sample data for demonstration if all values are zero
  const allZeros = data.every((value) => value === 0);
  const sampleData = labels.map((month, index) => ({
    name: month,
    value: allZeros ? Math.floor(Math.random() * 100) + 20 : data[index] || 0,
  }));

  const finalData = allZeros ? sampleData : chartData;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-orange-600 font-bold">Value: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = () => {
    return (
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
          <span className="text-sm text-gray-600">Monthly Data</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-80 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Monthly Overview</h3>
        {renderLegend()}
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart
          data={finalData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onMouseMove={(e) => {
            if (e && e.activeTooltipIndex !== undefined) {
              setActiveIndex(e.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#f97316"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
            activeDot={{
              r: 8,
              stroke: "#fff",
              strokeWidth: 2,
              fill: "#f97316",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {allZeros && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Sample data shown (all values are zero in original data)
        </div>
      )}
    </div>
  );
}
