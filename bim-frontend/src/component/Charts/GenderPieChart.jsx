import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography, Box } from '@mui/material';

const GenderPieChart = ({ maleCount, femaleCount }) => {
  
  // 1. Prepare the Data
  const data = [
    { name: 'Male', value: maleCount },
    { name: 'Female', value: femaleCount },
  ];

  // 2. Define Colors (Blue for Male, Pink/Red for Female)
  const COLORS = ['#1976d2', '#e91e63']; 

  // Custom Tooltip to make it look nice
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p style={{ margin: 0 }}>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Population by Sex
      </Typography>
      
      <Box sx={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%" // Center X
              cy="50%" // Center Y
              innerRadius={60} // Makes it a Donut (Hollow center)
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2} // Slight gap between slices
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default GenderPieChart;