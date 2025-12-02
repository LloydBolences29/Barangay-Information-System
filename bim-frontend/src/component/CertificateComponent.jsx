import { useState } from "react";
import "../styles/CertificateComponent.css";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { FaFileAlt, FaHandHoldingHeart, FaPrint, FaBriefcase } from "react-icons/fa";

//MUI imports
import { Divider } from "@mui/material";
import { Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

import ClearanceCertificate from "../component/CertificatesComponent/ClearanceCertificate";
import IndigencyCertificate from "../component/CertificatesComponent/IndigencyCertificate";
import WorkingPermit from "../component/CertificatesComponent/WorkingPermit";
const CertificateComponent = ({ selectedResident }) => {
  const [showModal, setShowModal] = useState(false);
  const [certType, setCertType] = useState(""); // 'Indigency' or 'Clearance'

  // Form Data
  const [purpose, setPurpose] = useState("");
  const [orNumber, setOrNumber] = useState("");
  const [amount, setAmount] = useState("50.00");

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
        <ClearanceCertificate
          resident={selectedResident}
          purpose={purpose}

        />
      );
    }

    if (type === "WorkingPermit") {
      return (
        <WorkingPermit
          resident={selectedResident}
          purpose={purpose}
 
        />
      );
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
                        {({ loading }) => (
                          <Button
                            variant="primary"
                            disabled={loading}
                            className="w-100"
                          >
                            {loading ? (
                              "Generating..."
                            ) : (
                              <>
                                <FaPrint /> Download PDF
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
                  md={8}
                  style={{ height: "600px", backgroundColor: "#f5f5f5" }}
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
        </div>
      </div>
    </>
  );
};

export default CertificateComponent;
