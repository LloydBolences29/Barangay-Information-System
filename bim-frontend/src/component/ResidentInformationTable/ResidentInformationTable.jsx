import { Suspense, useState, lazy } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Typography } from "@mui/material";

// Import your two components
const BasicInformationComponent = lazy(() =>
  import("../ResidentInformationTable/BasicInformationComponent")
);
const SearchListComponent = lazy(() => import("../SearchListComponent"));
const HouseholdComponent = lazy(() =>
  import("../ResidentHousehold/HouseholdComponent")
);

// Import the context (but you don't need to use it here if SearchList gets it)
// We'll let SearchListComponent get its own data.

const ResidentInformationTable = () => {
  const [tabValue, setTabValue] = useState("1");
  const [selectedResident, setSelectedResident] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectResident = (resident) => {
    setSelectedResident(resident);
  };

  const handleBackClick = () => {
    setSelectedResident(null);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
            <Tab label="Basic Information" value="1" />
            <Tab label="Household Information" value="2" />
            <Tab label="Requests" value="3" />
          </TabList>
        </Box>

        <TabPanel value="1">
          {selectedResident ? (
            <Suspense fallback={<div>Loading...</div>}>
              <BasicInformationComponent
                selectedResident={selectedResident}
                onBackClick={handleBackClick}
              />
            </Suspense>
          ) : (
            // Pass the "onSelectResident" function as a prop
            <Suspense fallback={<div>Loading...</div>}>
              <SearchListComponent onSelectResident={handleSelectResident} />
            </Suspense>
          )}
        </TabPanel>

        <TabPanel value="2">
          {selectedResident ? (
            <Suspense fallback={<div>Loading...</div>}>
              <HouseholdComponent selectedRes={selectedResident} />
            </Suspense>
          ) : (
            <Typography>Please search and select a resident first.</Typography>
          )}
        </TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </Box>
  );
};

export default ResidentInformationTable;
