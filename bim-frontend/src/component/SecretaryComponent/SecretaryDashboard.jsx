import { useState, useEffect, useCallback } from "react";
import "./SecretaryDashboard.css";
import { useSettings } from "../../utils/SettingsContext";
import socket from "../../utils/socketService";

//imports of charts
import LineChartComponent from "../Charts/LineChartComponent";
import GenderPieChart from "../Charts/GenderPieChart";
import CountUpComponent from "../Charts/CountUpComponent";

//UI library imports
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button, Row, Table } from "react-bootstrap";

const SecretaryDashboard = () => {
  const { settings } = useSettings();
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [numbersofResidentsAdded, setNumbersofResidentsAdded] = useState([]);
  const [pendingQueues, setPendingQueues] = useState([]);
  const [captainQueues, setCaptainQueues] = useState([]);
  const [dispatchQueues, setDispatchQueues] = useState([]);
  const [allStats, setAllStats] = useState([]);
  const [period, setPeriod] = useState("7days");
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [dispatchShowModal, setDispatchShowModal] = useState(false);
  const [cancelDispatchShowModal, setCancelDispatchShowModal] = useState(false);
  const [pageStatus, setPageStatus] = useState("idle");
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");


  const handleOpenDispatchModal = (queue) => {
    setSelectedQueue(queue);
    setDispatchShowModal(true);
  };

  const handleOpenCancelDispatchModel = (queue) => {
    setSelectedQueue(queue);
    setCancelDispatchShowModal(true);
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

  useEffect(() => {
    fetchNumbersOfResidentsAdded();
  }, [period]);

  useEffect(() => {
    fetchAllStats();
  }, []);
  console.log("All Stats", allStats);

  const fetchAllPendingQueues = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/api/queues/pending-payment-queues`
      );
      const data = await response.json();
      if (response.ok) {
        setPendingQueues(data);
      }
    } catch (error) {
      console.log("Error fetching pending queues:", error);
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

  const fetchDispatchQueues = useCallback(async () => {
    try {
      const res = await fetch(
        `${VITE_API_URL}/api/queues/ready-dispatch-queues`
      );
      if (res.ok) setDispatchQueues(await res.json());
    } catch (err) {
      console.error(err);
    }
  }, [VITE_API_URL]);

  // --- 3. MASTER REFRESH FUNCTION ---
  // When this runs, it updates ALL tables at once
  const refreshAllQueues = useCallback(() => {
    console.log("Refreshing all tables...");
    fetchAllPendingQueues();
    fetchCaptainQueues();
    fetchDispatchQueues();
  }, [fetchAllPendingQueues, fetchCaptainQueues, fetchDispatchQueues]);

  // --- 4. SOCKET LISTENER ---
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


  //for dispatching
  const handleDispatch = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/api/queues/dispatch-queue/${selectedQueue.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if(response.ok){
        setPageStatus("success");
        setNotificationMessage("Queue dispatched successfully.");
        setSuccessSnackBarStatus(true);
        setDispatchShowModal(false);
        refreshAllQueues();
      }else{
        setPageStatus("error");
        setNotificationMessage(data.message);
        setFailedSnackBarStatus(true);
      }
    } catch (error) {
      console.log("Error dispatching queue:", error);
      setPageStatus("error");
      setNotificationMessage(error.message);
      setFailedSnackBarStatus(true);
      
    }
  }

  //for cancelling the dispatch
  const handleCancelDispatch = async() => {
    try {
      const response = await fetch(`${VITE_API_URL}/api/queues/cancel-dispatch/${selectedQueue.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if(response.ok){
        setPageStatus("success");
        setNotificationMessage("Dispatch cancelled successfully.");
        setSuccessSnackBarStatus(true);
        setCancelDispatchShowModal(false);
        refreshAllQueues();
      } else {
        setPageStatus("error");
        setNotificationMessage(data.message);
        setFailedSnackBarStatus(true);
      }
    } catch (error) {
      console.log("Error cancelling dispatch:", error);
      setPageStatus("error");
      setNotificationMessage(error.message);
      setFailedSnackBarStatus(true);
    }
  }
  return (
    <>
      <div id="main-secretary-dashboard">
        <div id="welcome-banner">
          <h1>Welcome to your Dashboard</h1>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-wrapper">
            {/* Queuing Request */}
            {settings.payment_required && (
              <div className="queue-request-dashboard-container">
                <div className="queue-request-header mb-3">
                  <h2 className="text-center ">Queuing Request Status</h2>
                </div>

                <div className="queue-request-body">
                  <div className="pending-requests">
                    <h3>Pending Approval from Treasurer</h3>
                    <Table>
                      <thead>
                        <tr>
                          <th>Certificate Type</th>
                          <th>Name</th>
                          <th>Queue Number</th>
                        </tr>
                      </thead>

                      <tbody>
                        {pendingQueues.map((queue) => (
                          <tr key={queue.id}>
                            <td>{queue.certType}</td>
                            <td>{`${queue.resident_firstname} ${queue.resident_lastname}`}</td>
                            <td>{queue.queueNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div className="completed-requests">
                    <h3>For Captain's Approval</h3>
                    <Table>
                      <thead>
                        <tr>
                          <th>Certificate Type</th>
                          <th>Name</th>
                          <th>Queue Number</th>
                        </tr>
                      </thead>

                      <tbody>
                        {captainQueues.map((queue) => (
                          <tr key={queue.id}>
                            <td>{queue.certType}</td>
                            <td>{`${queue.resident_firstname} ${queue.resident_lastname}`}</td>
                            <td>{queue.queueNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div className="completed-requests">
                    <h3>Ready for dispatching</h3>
                    <Table>
                      <thead>
                        <tr>
                          <th>Certificate Type</th>
                          <th>Name</th>
                          <th>Queue Number</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {dispatchQueues.map((queue) => (
                          <tr key={queue.id}>
                            <td>{queue.certType}</td>
                            <td>{`${queue.resident_firstname} ${queue.resident_lastname}`}</td>
                            <td>{queue.queueNo}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-success"
                                  onClick={() => handleOpenDispatchModal(queue)}
                                >
                                  {" "}
                                  Dispatch{" "}
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleOpenCancelDispatchModel(queue)
                                  }
                                >
                                  {" "}
                                  Cancel{" "}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
            {/* Number of New residents Added */}
            <div id="counter-wrapper">
              <div className="chart-header">
                <div className="counter-name">
                  <h3>Number of New Residents added during: </h3>
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

            {/* Gender Pie Chart and Count Up Components */}
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
          </div>


          {dispatchShowModal && (
            <Modal
              show={dispatchShowModal}
              onHide={() => setDispatchShowModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Dispatch Confirmation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to dispatch Queue Number:{" "}
                {selectedQueue.queueNo}?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setDispatchShowModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="outline-success" onClick={() => handleDispatch()}> Dispatch </Button>
              </Modal.Footer>
            </Modal>
          )}

          {cancelDispatchShowModal && (
            <Modal
              show={cancelDispatchShowModal}
              onHide={() => setCancelDispatchShowModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Cancel Dispatch Confirmation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to cancel dispatch for Queue Number:{" "}
                {selectedQueue.queueNo}?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setCancelDispatchShowModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="outline-danger" onClick={() => handleCancelDispatch()}> Cancel Dispatch </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

export default SecretaryDashboard;
