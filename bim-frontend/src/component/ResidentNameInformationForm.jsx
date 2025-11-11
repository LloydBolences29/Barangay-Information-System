import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
const ResidentNamaeInformationForm = ({ formData, handleChange }) => {
  return (
    <Grid container spacing={2}>
      {/* Row 1 */}
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          name="firstname"
          label="Firstname"
          value={formData.firstname}
          onChange={handleChange}
          helperText="* Required"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          name="middlename"
          label="Middlename"
          value={formData.middlename}
          onChange={handleChange}
          helperText="* Required"
        />
      </Grid>

      {/* Row 2 */}
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          name="lastname"
          label="Lastname"
          value={formData.lastname}
          onChange={handleChange}
          helperText="* Required"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel id="extname-label">Extension (Optional)</InputLabel>
          <Select
            labelId="extname-label"
            name="name_extension"
            value={formData.name_extension}
            label="Extension (Optional)"
            onChange={handleChange}
          >
            <MenuItem value="N/A">None</MenuItem>
            <MenuItem value="Jr.">Jr.</MenuItem>
            <MenuItem value="Sr.">Sr.</MenuItem>
            <MenuItem value="II">II</MenuItem>
            <MenuItem value="III">III</MenuItem>
            <MenuItem value="IV">IV</MenuItem>
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
          <InputLabel id="relationship_to_head-label">
            Relationship to Head
          </InputLabel>
          <Select
            fullWidth
            labelId="relationship_to_head-label"
            name="relationship_to_head"
            value={formData.relationship_to_head}
            label="Relationship to Head"
            onChange={handleChange}
          >
            <MenuItem value="Head">Head</MenuItem>
            <MenuItem value="Spouse">Spouse</MenuItem>
            <MenuItem value="Child">Child</MenuItem>
            <MenuItem value="Parent">Parent</MenuItem>
            <MenuItem value="Sibling">Sibling</MenuItem>
            <MenuItem value="Grandparent">Grandparent</MenuItem>
            <MenuItem value="Grandchild">Grandchild</MenuItem>
            <MenuItem value="Other Relative">Other Relative</MenuItem>
            <MenuItem value="Non-Relative">Non-Relative</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ResidentNamaeInformationForm;
