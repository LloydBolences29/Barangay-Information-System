import { useState, Suspense, lazy } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";


const BasicInformationComponent = lazy(() =>
  import("../ResidentInformationTable/BasicInformationComponent")
);
const ResidentInformationTable = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Basic Information" value="1" />
              <Tab label="Household Information" value="2" />
              <Tab label="Requests" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1"><Suspense fallback={<div>Loading...</div>}><BasicInformationComponent /></Suspense></TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default ResidentInformationTable;
