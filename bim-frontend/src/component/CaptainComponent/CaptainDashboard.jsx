import { useState, useEffect } from "react";
import "./CaptainDashboard.css";
import { useSettings } from "../../utils/SettingsContext";
import { Button, Table, Modal } from "react-bootstrap";
import socket from "../../utils/socketService";
import SnackbarComponent from "../SnackbarComponent";
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
  const { settings } = useSettings();
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [numbersofResidentsAdded, setNumbersofResidentsAdded] = useState([]);
  const [allStats, setAllStats] = useState([]);
  const [acceptShowModal, setAcceptShowModal] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [period, setPeriod] = useState("7days");
  const [captainQueues, setCaptainQueues] = useState([]); 
  const [pageStatus, setPageStatus] = useState("idle"); 
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [queueMessage, setQueueMessage] = useState("No pending queues.");

  const handleSnackBarClose = (event, reason) => {
    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };

    const handleOpenAcceptModal = (queue) => {
    setSelectedQueue(queue);
    setAcceptShowModal(true);
  };
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

  const handleApprove = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/api/queues/captain-approve/${selectedQueue.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPageStatus("success");
        setNotificationMessage(data.message);
        setSuccessSnackBarStatus(true);
        setAcceptShowModal(false);
        refreshAllQueues();
      } else {
        setPageStatus("error");
        setNotificationMessage(data.message);
        setFailedSnackBarStatus(true);
      }
    } catch (error) {
      console.log("Error approving:", error);
      setPageStatus("error");
      setNotificationMessage("Failed to approve.");
      setFailedSnackBarStatus(true);
    }
  };

  const fetchCaptainQueues = useCallback(async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/api/queues/captain-approval-queues`
      );
      if (res.ok) setCaptainQueues(await res.json());
    } catch (err) {
      console.error(err);
    }
  }, [VITE_API_URL]);

  const refreshAllQueues = useCallback(() => {
    console.log("Refreshing all tables...");
    fetchCaptainQueues();
  }, [fetchCaptainQueues]);

  useEffect(() => {
    fetchNumbersOfResidentsAdded();
  }, [period]);

  useEffect(() => {
    fetchAllStats();
  }, []);

  useEffect(() => {
    // Initial Load
    refreshAllQueues();

    // Listen for the signal
    const handleQueueUpdate = (data) => {
      console.log("Socket Update Received:", data);
      refreshAllQueues(); // <--- This updates the screen instantly!
    };

    socket.on("refresh_queue", handleQueueUpdate);

    // Cleanup
    return () => {
      socket.off("refresh_queue", handleQueueUpdate);
    };
  }, [refreshAllQueues]);

  console.log("All Stats", allStats);

  return (
    <>
      <div id="main-secretary-dashboard">
        <div id="welcome-banner">
          <h1>Welcome to your dashboard</h1>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-wrapper">
            {settings.payment_required && (
              <div className="queueing-dashboard">
                <h2>Queueing Dashboard</h2>
                <div className="queueing-stats">
                  <div className="pending-card">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Certificate Type</th>
                          <th>Resident name</th>
                          <th>Queue Number</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {captainQueues.length > 0 ? (
                        <tbody>
                          {captainQueues.map((queue) => (
                            <tr key={queue.id}>
                              <td>{queue.certType}</td>
                              <td>{`${queue.resident_firstname} ${queue.resident_lastname}`}</td>
                              <td>{queue.queueNo}</td>
                              <td>
                                <div className="d-flex g-2">
                                  <Button
                                    variant="outline-success"
                                    onClick={() => handleOpenAcceptModal(queue)}
                                  >
                                    Approve
                                  </Button>
                                  <Button variant="outline-danger">
                                    Decline
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td colSpan="4">{queueMessage}</td>
                          </tr>
                        </tbody>
                      )}
                    </Table>
                  </div>
                </div>
              </div>
            )}
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

            {acceptShowModal && (
              <Modal
                show={acceptShowModal}
                onHide={() => setAcceptShowModal(false)}
                centered
                size="md"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Accept Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    Are you sure you want to approve Queue Number:{" "}
                    {selectedQueue.queueNo}?
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setAcceptShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="outline-success" onClick={handleApprove}>
                   Approve
                  </Button>
                </Modal.Footer>
              </Modal>
            )}

            <SnackbarComponent
              pageState={pageStatus}
              notification={notificationMessage}
              successSnackBarState={successSnackBarStatus}
              failedSnackBarState={failedSnackBarStatus}
              handleClose={handleSnackBarClose}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CaptainDashboard;
