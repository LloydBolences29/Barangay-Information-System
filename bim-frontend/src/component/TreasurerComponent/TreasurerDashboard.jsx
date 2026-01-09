import { useState, useCallback, useEffect } from "react";
import "./TreasurerDashboard.css";
import { useSettings } from "../../utils/SettingsContext";
import { Button, Table, Modal } from "react-bootstrap";
import socket from "../../utils/socketService";
import SnackbarComponent from "../SnackbarComponent";

const TreasurerDashboard = () => {
  const { settings } = useSettings();
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const [pageStatus, setPageStatus] = useState("idle");
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [pendingQueues, setPendingQueues] = useState([]);
  const [queueMessage, setQueueMessage] = useState("No pending queues.");
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [acceptShowModal, setAcceptShowModal] = useState(false);

  
  const handleSnackBarClose = (event, reason) => {
    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };

  const handleOpenAcceptModal = (queue) => {
    setSelectedQueue(queue);
    setAcceptShowModal(true);
  };

  const fetchPendingQueues = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/api/queues/pending-payment-queues`
      );
      const data = await response.json();
      setPendingQueues(data);
    } catch (error) {
      console.log("Error fetching pending queues:", error);
    }
  };

  const refreshPendingQueues = useCallback(() => {
    fetchPendingQueues();
  }, [fetchPendingQueues]);

  useEffect(() => {
    refreshPendingQueues();

    const handleQueueUpdate = (data) => {
      console.log("Received queue update via socket:", data);
      refreshPendingQueues();
    };

    socket.on("receive_queue_update", handleQueueUpdate);

    return () => {
      socket.off("receive_queue_update", handleQueueUpdate);
    };
  });

  const handleAcceptPayment = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/api/queues/accept-payment/${selectedQueue.id}`,
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
        setNotificationMessage("Payment accepted successfully.");
        setSuccessSnackBarStatus(true);
        setAcceptShowModal(false);
        refreshPendingQueues();
      } else {
        setPageStatus("error");
        setNotificationMessage(data.message);
        setFailedSnackBarStatus(true);
      }
    } catch (error) {
      console.log("Error accepting payment:", error);
      setPageStatus("error");
      setNotificationMessage("Failed to accept payment.");
      setFailedSnackBarStatus(true);
    }
  };
  return (
    <>
      <div id="main-treasurer-dashboard">
        <div id="welcome-banner">
          <h1>Welcome to your Dashboard</h1>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-wrapper">
            {/* Queueing dashboard */}
            {settings.payment_required && (
              <div className="queueing-dashboard">
                <h2>Queueing Dashboard</h2>
                <div className="queueing-stats">
                  <div className="pending-card">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Certificate Type</th>
                          <th>Resident ID</th>
                          <th>Queue Number</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {pendingQueues.length > 0 ? (
                        <tbody>
                          {pendingQueues.map((queue) => (
                            <tr key={queue.id}>
                              <td>{queue.certType}</td>
                              <td>{queue.residentId}</td>
                              <td>{queue.queueNo}</td>
                              <td>
                                <div className="d-flex g-2">
                                  <Button
                                    variant="outline-success"
                                    onClick={() => handleOpenAcceptModal(queue)}
                                  >
                                    Accept Payment
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
          </div>
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
              Are you sure you want to accept payment for Queue Number:{" "}
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
            <Button variant="outline-success" onClick={handleAcceptPayment}>
              Accept Payment
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
    </>
  );
};

export default TreasurerDashboard;
