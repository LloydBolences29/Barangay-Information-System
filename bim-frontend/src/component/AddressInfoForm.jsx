import React from "react";
import { Grid, TextField } from "@mui/material";
const AddressInfoForm = ({ formData, handleChange }) => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="occupation"
            label="occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            name="house_no"
            label="House No. / Blk / Lot"
            value={formData.house_no}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            name="street"
            label="Street Name"
            value={formData.street}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="address"
            label="Full Address (e.g., Purok, Barangay, City)"
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default AddressInfoForm;
