import React from "react";
import { Grid, TextField } from "@mui/material";
const AddressInfoForm = ({ formData, handleChange }) => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="profession"
            label="Profession"
            value={formData.profession}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            name="houseNumber"
            label="House No. / Blk / Lot"
            value={formData.houseNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            name="streetName"
            label="Street Name"
            value={formData.streetName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="fullAddress"
            label="Full Address (e.g., Purok, Barangay, City)"
            value={formData.fullAddress}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default AddressInfoForm;
