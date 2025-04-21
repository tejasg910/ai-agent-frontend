'use client';

import { useEffect, useRef } from 'react';

export default function OverviewChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.5)');
    gradient.addColorStop(1, 'rgba(249, 115, 22, 0.0)');

    // Mock data
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [30, 40, 35, 50, 49, 60, 70, 91, 125, 160, 150, 180];

    // Draw chart
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    
    // Draw gradient area
    ctx.beginPath();
    ctx.moveTo(0, 200 - data[0]);
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(i * (chartRef.current.width / (data.length - 1)), 200 - data[i]);
    }
    ctx.lineTo(chartRef.current.width, 200);
    ctx.lineTo(0, 200);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(0, 200 - data[0]);
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(i * (chartRef.current.width / (data.length - 1)), 200 - data[i]);
    }
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw points
    for (let i = 0; i < data.length; i++) {
      ctx.beginPath();
      ctx.arc(i * (chartRef.current.width / (data.length - 1)), 200 - data[i], 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#f97316';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw x-axis labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      ctx.fillText(labels[i], i * (chartRef.current.width / (labels.length - 1)), 220);
    }
  }, []);

  return (
    <div className="w-full h-64">
      <canvas ref={chartRef} width="800" height="250" className="w-full h-full"></canvas>
    </div>
  );
}