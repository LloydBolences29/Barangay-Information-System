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
          name="place_of_birth"
          label="Place of Birth"
          value={formData.place_of_birth}
          onChange={handleChange}
        />
      </Grid>

      {/* --- Row 2 --- */}
      <Grid
        item
        xs={12}
        sm={12}
        lg={12}
        sx={{ display: "block", width: "100%" }}
      >
        <FormControl fullWidth sx={{ width: "20%" }}>
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
      <Grid
        item
        xs={12}
        sm={12}
        lg={12}
        sx={{ display: "block", width: "100%" }}
      >
        <FormControl fullWidth sx={{ width: "20%" }}>
          <InputLabel id="civil-status-label">Civil Status</InputLabel>
          <Select
            labelId="civil-status-label"
            name="civil_status"
            value={formData.civil_status}
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
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          name="citizenship"
          label="Citizenship"
          value={formData.citizenship}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

export default PersonalDetailForm;
