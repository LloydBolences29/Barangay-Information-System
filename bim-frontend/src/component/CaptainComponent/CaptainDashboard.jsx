import { useState, useEffect } from "react";
import "./CaptainDashboard.css";

//imports of charts
import LineChartComponent from "../Charts/LineChartComponent";
import GenderPieChart from "../Charts/GenderPieChart";
import CountUpComponent from "../Charts/CountUpComponent";

//UI library imports
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const CaptainDashboard = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [numbersofResidentsAdded, setNumbersofResidentsAdded] = useState([]);
  const [allStats, setAllStats] = useState([]);
  const [period, setPeriod] = useState("7days");
  const fetchNumbersOfResidentsAdded = async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/api/stats/number-of-added-residents?period=${period}`
      );

      const data = await res.json();
      if (res.ok) {
        // Optional: Format the labels nicely based on the view
        const formattedData = data.map((item) => {
          let formattedLabel = item.label;

          if (period === "7days") {
            // "Nov 25"
            formattedLabel = new Date(item.label).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          } else if (period === "monthly") {
            // "Nov 2025"
            const [year, month] = item.label.split("-");
            const date = new Date(year, month - 1);
            formattedLabel = date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
          }
          // 'weekly' usually comes back as "Week 42 2025", which is fine as is.

          return { label: formattedLabel, count: item.count };
        });

        setNumbersofResidentsAdded(formattedData);
      }
    } catch (error) {
      console.log("Error fetching numbers of residents added:", error);
    }
  };

  const fetchAllStats = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/stats/all-stats`);
      const data = await res.json();

      console.log("Data: ", data);
      if (res.ok) {
        setAllStats(data);
      }
    } catch (error) {
      console.log("Error fetching all stats:", error);
    }
  };

  const handleChange = (event) => {
    setPeriod(event.target.value);
  };

  useEffect(() => {
    fetchNumbersOfResidentsAdded();
  }, [period]);

  useEffect(() => {
    fetchAllStats();
  }, []);
  console.log("All Stats", allStats);
  return (
    <>
      <div id="main-secretary-dashboard">
        <div id="welcome-banner">
          <h1>Welcome to your dashboard</h1>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-wrapper">
            <div id="counter-wrapper">
              <div className="chart-header">
                <div className="counter-name">
                  <h3>Number of Residents added during: </h3>
                </div>
                <div className="counter-period-options">
                  {/* dropdown Options to select period could go here */}
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Period
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={period}
                      label="Period"
                      onChange={handleChange}
                    >
                      <MenuItem value={"7days"}>Last 7 Days</MenuItem>
                      <MenuItem value={"weekly"}>Weekly</MenuItem>
                      <MenuItem value={"monthly"}>Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div id="line-chart-component">
                <LineChartComponent data={numbersofResidentsAdded} />
              </div>
            </div>

            <div className="pie-and-count-up-chart-wrapper">
              <div className="pie-chart-container">
                <GenderPieChart
                  maleCount={allStats.total_male_residents}
                  femaleCount={allStats.total_female_residents}
                />
              </div>
              <div className="count-up-container">
                <div className="total-household-count-up">
                  <CountUpComponent
                    title={"Total Number of Households"}
                    count={allStats.total_households}
                  />
                </div>
                <div className="total-resident-count-up">
                  <CountUpComponent
                    title={"Total Number of Active Residents"}
                    count={allStats.total_active_residents}
                  />
                </div>
              </div>
            </div>
            <div className="other-count-up-container">
              <div className="total-resident-count-up">
                <CountUpComponent
                  title={"Total Number of Senior Citizens"}
                  count={allStats.total_senior_citizens}
                />
              </div>
              <div className="total-resident-count-up">
                <CountUpComponent
                  title={"Total Number of SK Eligible"}
                  count={allStats.total_sk_eligible}
                />
              </div>
              <div className="total-resident-count-up">
                <CountUpComponent
                  title={"Total Number of Minors"}
                  count={allStats.total_minors}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaptainDashboard;
