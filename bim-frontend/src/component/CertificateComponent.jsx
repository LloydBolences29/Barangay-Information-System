import { useState } from "react";
import "../styles/CertificateComponent.css";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import {
  FaFileAlt,
  FaHandHoldingHeart,
  FaPrint,
  FaBriefcase,
} from "react-icons/fa";

//MUI imports
import { Divider } from "@mui/material";
import { Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

import ClearanceCertificate from "../component/CertificatesComponent/ClearanceCertificate";
import IndigencyCertificate from "../component/CertificatesComponent/IndigencyCertificate";
import WorkingPermit from "../component/CertificatesComponent/WorkingPermit";
import { useSettings } from "../utils/SettingsContext";
const CertificateComponent = ({ selectedResident }) => {
  const { settings } = useSettings();
  console.log("Settings in CertificateComponent:", settings);
  const [showModal, setShowModal] = useState(false);
  const [certType, setCertType] = useState(""); // 'Indigency' or 'Clearance'

  const VITE_API_URL = import.meta.env.VITE_API_URL;
  // Form Data
  const [purpose, setPurpose] = useState("");
  const [orNumber, setOrNumber] = useState("");
  const [amount, setAmount] = useState("50.00");
  const [queueNumber, setQueueNumber] = useState("");
  const [queueModalShow, setQueueModalShow] = useState(false);
  const [payload, setPayload] = useState({
    resident_id: selectedResident.id,
    certificate_type: certType,
    queueNo: "",
    reqStatus: "Pending",
    updatedByUserId: 1, //this should be dynamic based on the logged in user
  });

  const handleOpen = (type) => {
    setCertType(type);
    setPurpose(""); // Reset fields
    setOrNumber("");
    setShowModal(true);
  };

  const renderDocument = (type) => {
    if (type === "Indigency") {
      return (
        <IndigencyCertificate resident={selectedResident} purpose={purpose} />
      );
    }
    if (type === "Clearance") {
      return (
        <ClearanceCertificate resident={selectedResident} purpose={purpose} />
      );
    }

    if (type === "WorkingPermit") {
      return <WorkingPermit resident={selectedResident} purpose={purpose} />;
    }
  };

  //generate the queue number here
  //if only the paymer_required settings is enabled
  // 1. GENERATOR FUNCTION
  const generateQueueNumber = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/api/audit-logs/today-count`
      );
      const data = await response.json();

      const currentCount = data.count || 0;
      const nextCount = currentCount + 1; // Fix: Assign the calculation

      const paddedNumber = String(nextCount).padStart(3, "0");
      const finalQueueNo = `${certType}-${paddedNumber}`;

      // Update state for the UI (The Modal)
      setQueueNumber(finalQueueNo);

      // RETURN it so we can use it immediately in the next function
      return finalQueueNo;
    } catch (error) {
      console.error("Error generating queue number:", error);
      return null;
    }
  };

  // 2. MAIN PROCESS FUNCTION (Triggered on Click)
  const handleDownloadAndQueue = async () => {
    // Only run if payment is required
    if (!settings.payment_required) return;

    // A. Generate the number
    const queueNo = await generateQueueNumber();
    if (!queueNo) return; // Stop if generation failed

    // B. Prepare the Payload
    const finalPayload = {
      resident_id: selectedResident.id,
      certificate_type: certType,
      queueNo: queueNo, // Use the variable, not state
      reqStatus: "Pending Payment",
      request_status: "Pending",
      purpose: purpose,
      updatedByUserId: 1, // Replace with actual user ID from context if available
    };

    try {
      // C. Save to Database (Audit Log / Transaction)
      const response = await fetch(`${VITE_API_URL}/api/audit-logs/submit-certificate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (response.ok) {
        // D. Update UI: Close Print Modal -> Open Queue Modal
        setShowModal(false);
        setQueueModalShow(true);
      } else {
        console.error("Failed to save request log");
      }
    } catch (error) {
      console.error("Error in handleDownloadAndQueue:", error);
    }
  };

  console.log("CertificateComponent selectedResident:", selectedResident);
  return (
    <>
      <div className="certificate-container">
        <div className="certificate-header">
          <h2 className="certificate-h2-header">
            Request for {selectedResident.firstname} {selectedResident.lastname}
          </h2>
        </div>

        <Divider
          sx={{ height: 20, borderColor: "black", borderBottomWidth: 2 }}
          orientation="horizontal"
        />
        <div className="p-3">
          <h5 className="mb-4">Select Document to Generate</h5>

          <Row className="g-4">
            {/* OPTION 1: CLEARANCE */}
            <Col md={6}>
              <Card
                className="text-center p-4 shadow-sm h-100"
                style={{ cursor: "pointer", border: "1px solid #0d6efd" }}
                onClick={() => handleOpen("Clearance")}
              >
                <Card.Body>
                  <FaFileAlt size={40} className="text-primary mb-3" />
                  <h4>Barangay Clearance</h4>
                  <p className="text-muted">
                    For employment, ID, or general requirements.
                  </p>
                  <Button variant="outline-primary">Select</Button>
                </Card.Body>
              </Card>
            </Col>

            {/* OPTION 2: INDIGENCY */}
            <Col md={6}>
              <Card
                className="text-center p-4 shadow-sm h-100"
                style={{ cursor: "pointer", border: "1px solid #02b027ff" }}
                onClick={() => handleOpen("Indigency")}
              >
                <Card.Body>
                  <FaHandHoldingHeart size={40} className="text-success mb-3" />
                  <h4>Certificate of Indigency</h4>
                  <p className="text-muted">
                    For financial assistance, scholarship, or medical help.
                  </p>
                  <Button variant="outline-success">Select</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card
                className="text-center p-4 shadow-sm h-100"
                style={{ cursor: "pointer", border: "1px solid #ecdd06ff" }}
                onClick={() => handleOpen("WorkingPermit")}
              >
                <Card.Body>
                  <FaBriefcase size={40} className="text-warning mb-3" />
                  <h4>Working Permit</h4>
                  <p className="text-muted">
                    For employment or business purposes.
                  </p>
                  <Button variant="outline-warning">Select</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* --- THE MINI MODAL (Just asks for Purpose) --- */}
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            centered
            size="xl"
          >
            <Modal.Header closeButton>
              <Modal.Title>Print {certType}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                {/* COLUMN 1: INPUT FORM */}
                <Col md={4} style={{ borderRight: "1px solid #ddd" }}>
                  <Form>
                    {/* ... Your Form Inputs ... */}
                    <Form.Group className="mb-3">
                      <Form.Label>Purpose</Form.Label>
                      <Form.Control
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        autoFocus
                      />
                    </Form.Group>
                    {/* ... Other Inputs ... */}
                  </Form>

                  <div className="d-grid gap-2 mt-4">
                    {purpose && (
                      <PDFDownloadLink
                        document={renderDocument(certType)}
                        fileName={`${certType}_${selectedResident.lastname}.pdf`}
                        style={{ textDecoration: "none" }}
                      >
                        {({ loading: pdfLoading }) => (
                          <Button
                            variant="primary"
                            disabled={pdfLoading}
                            className="w-100"
                            // --- THE FIX IS HERE ---
                            onClick={() => {
                              // This runs SIMULTANEOUSLY with the download
                              handleDownloadAndQueue();

                              // Optional: Log for free transactions
                              if (!settings.payment_required) {
                                console.log("Free transaction downloaded");
                              }
                            }}
                          >
                            {pdfLoading ? (
                              "Generating..."
                            ) : (
                              <>
                                <FaPrint className="me-2" />
                                {settings.payment_required
                                  ? "Download & Get Queue Number"
                                  : "Download PDF"}
                              </>
                            )}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    )}
                  </div>
                </Col>

                {/* COLUMN 2: LIVE PREVIEW */}
                <Col
                  style={{
                    width: "100%",
                    height: "600px",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {/* Note: Suspense removed as we are not using lazy anymore */}
                  <PDFViewer width="100%" height="100%" showToolbar={false}>
                    {/* FIX 1: Passed certType here */}
                    {renderDocument(certType)}
                  </PDFViewer>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>

          {/* Modal for showing the generated queue number */}
          {settings.payment_required && (
            <Modal
              show={queueModalShow}
              onHide={() => setQueueModalShow(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Queue Number Generated</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h4>Queue Number is:</h4>
                <h2 className="text-primary">{queueNumber}</h2>
              </Modal.Body>
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

export default CertificateComponent;
