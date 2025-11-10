import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
const PersonalDetailForm = ({ formData, handleChange }) => {
  return (
    <Grid container spacing={2}>
      {/* --- Row 1 --- */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          name="dob"
          label="Date of Birth"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }} // Added this to prevent label overlap on 'date'
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          name="placeOfBirth"
          label="Place of Birth"
          value={formData.placeOfBirth}
          onChange={handleChange}
        />
      </Grid>

      {/* --- Row 2 --- */}
      <Grid item xs={12} sm={6}>
        {" "}
        {/* <-- This is the fix */}
        <FormControl fullWidth>
          <InputLabel id="sex-label">Sex</InputLabel>
          <Select
            labelId="sex-label"
            name="sex"
            value={formData.sex}
            label="Sex"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel id="civil-status-label">Civil Status</InputLabel>
          <Select
            labelId="civil-status-label"
            name="civilStatus"
            value={formData.civilStatus}
            label="Civil Status"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Married">Married</MenuItem>
            <MenuItem value="Widowed">Widowed</MenuItem>
            <MenuItem value="Separated">Separated</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default PersonalDetailForm;
