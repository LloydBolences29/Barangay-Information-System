import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Box } from '@mui/material';

const GenderPieChart = ({ maleCount, femaleCount }) => {
  
  // 1. Prepare the Data
  const data = [
    { name: 'Male', value: maleCount },
    { name: 'Female', value: femaleCount },
  ];

  // 2. Define Colors
  const COLORS = ['#1976d2', '#e91e63']; 

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    // REMOVED <Card>: We use a Box that fills 100% of the parent CSS container
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
        Population by Sex
      </Typography>
      
      {/* ResponsiveContainer needs a parent with defined height to work. 
          Our CSS .pie-chart-container provides that height. */}
      <div style={{ width: '100%', flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80} // Reduced slightly to prevent clipping on small screens
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle"/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Box>
  );
};

export default GenderPieChart;