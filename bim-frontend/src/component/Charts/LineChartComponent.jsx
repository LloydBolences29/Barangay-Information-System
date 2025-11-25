import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer, // Import this for responsive sizing
} from "recharts";

// Accept 'data' as a prop
const LineChartComponent = ({ data }) => {
  return (
    <div style={{ width: '100%', height: '400px' }}> {/* Set a fixed height container */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          
          {/* 1. Map X-Axis to your date field ("label") */}
          <XAxis dataKey="label" />
          
          {/* 2. Configure Y-Axis (allowDecimals=false prevents 1.5 people) */}
          <YAxis allowDecimals={false} />
          
          <Tooltip />
          <Legend />
          
          {/* 3. Map the Line to your number field ("count") */}
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#1976d2" 
            name="Residents Added" // This shows in the Legend
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;