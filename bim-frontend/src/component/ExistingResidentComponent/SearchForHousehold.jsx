// SearchHouseholdForm.jsx

import React, { useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";

// This component receives one prop:
// 1. onHouseholdSelect: A function to call when a household is chosen
const SearchForHousehold = ({ onHouseholdSelect }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 1. Function to search the API
  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setResults([]);
    try {
      // Use the API endpoint and query we discussed
      const response = await fetch(`${VITE_API_URL}/api/residents/household-search/${searchTerm}`);
      const data = await response.json();
      console.log("Search results:", data);
      if (response.ok) {
        setResults(data.households);
      }
    } catch (err) {
      console.error("Failed to search households:", err);
    }
    setLoading(false);
  };

  // 2. Function to handle selection
  const handleSelect = (household) => {
    // Set the selected ID for styling
    setSelectedId(household.householdId);

    // Call the prop function from the parent (ResidentManagement)
    // This updates the formData in the parent component
    onHouseholdSelect(household.householdId);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Find an Existing Household
      </Typography>
      <Typography variant="body2" gutterBottom>
        Search by the Head of the Household's last name.
      </Typography>

      {/* --- Search Bar --- */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          label="Head's Last Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ ml: 1, p: "8px 16px" }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Search"}
        </Button>
      </Box>

      {/* --- Results List --- */}
      <List
        sx={{
          maxHeight: 300,
          overflow: "auto",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        {results.length === 0 && !loading && (
          <ListItem>
            <ListItemText primary="No households found. Please search." />
          </ListItem>
        )}

        {results.map((household) => (
          <ListItem key={household.householdId} disablePadding>
            <ListItemButton
              onClick={() => handleSelect(household)}
              // Add a "selected" style
              selected={selectedId === household.householdId}
            >
              <ListItemText
                primary={`${household.head_firstname} ${household.head_lastname} - ${household.household_number}`}
                secondary={`Address: ${household.house_no}, ${household.street}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {selectedId && (
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          Household {selectedId} selected. Click "Continue" below.
        </Typography>
      )}
    </Box>
  );
};

export default SearchForHousehold;
