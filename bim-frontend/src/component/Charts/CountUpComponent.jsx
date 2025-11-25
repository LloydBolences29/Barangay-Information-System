import React from 'react'
import CountUp from "react-countup";
import { Card, Typography, Box, Avatar } from "@mui/material";

const CountUpComponent = ({ title, count = 0, icon, color }) => {
  return (
    <Card
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: 3,
        borderRadius: 2,
        height: '100%', // Ensure consistent height in Grid
      }}
    >
      {/* Left Side: Text and Number */}
      <Box>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          sx={{ fontWeight: "bold", textTransform: 'uppercase', fontSize: '0.75rem' }}
        >
          {title}
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mt: 1 }}>
          {/* This component handles the animation */}
          <CountUp
            start={0}
            end={count}
            duration={2.5}
            separator=","
          />
        </Typography>
      </Box>

      {/* Right Side: The Icon with a background color */}
      {icon && (
        <Avatar
          sx={{
            bgcolor: color,
            width: 56,
            height: 56,
            boxShadow: 2
          }}
        >
          {icon}
        </Avatar>
      )}
    </Card>
  )
}

export default CountUpComponent;