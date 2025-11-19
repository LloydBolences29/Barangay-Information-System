import {useState, lazy} from "react";
import "../styles/CertificateComponent.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaFileAlt, FaHandHoldingHeart, FaPrint } from "react-icons/fa";

//MUI imports
import { Divider } from "@mui/material";
import { Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

const ClearanceCertificate = lazy(() =>
  import("../component/CertificatesComponent/ClearanceCertificate")
);
const IndigencyCertificate = lazy(() =>
  import("../component/CertificatesComponent/IndigencyCertificate")
);
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

          <Row>
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
                style={{ cursor: "pointer", border: "1px solid #198754" }}
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
          </Row>

          {/* --- THE MINI MODAL (Just asks for Purpose) --- */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Print {certType}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Purpose</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Employment, Medical Assistance"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    autoFocus
                  />
                </Form.Group>

                {/* Only show O.R. / Amount if it is a Clearance */}
                {certType === "Clearance" && (
                  <Row>
                    <Col>
                      <Form.Label>O.R. Number</Form.Label>
                      <Form.Control
                        value={orNumber}
                        onChange={(e) => setOrNumber(e.target.value)}
                      />
                    </Col>
                    <Col>
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </Col>
                  </Row>
                )}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {/* DYNAMIC DOWNLOAD BUTTON */}
              {purpose && (
                <PDFDownloadLink
                  document={
                    certType === "Indigency" ? (
                      <IndigencyCertificate
                        resident={selectedResident}
                        purpose={purpose}
                      />
                    ) : (
                      <ClearanceCertificate
                        resident={selectedResident}
                        purpose={purpose}
                        orNumber={orNumber}
                        amount={amount}
                      />
                    )
                  }
                  fileName={`${certType}_${selectedResident.lastname}.pdf`}
                  style={{ textDecoration: "none" }}
                >
                  {({ blob, url, loading, error }) => (
                    <Button variant="primary" disabled={loading}>
                      {loading ? (
                        "Generating..."
                      ) : (
                        <>
                          <FaPrint className="me-2" /> Download PDF
                        </>
                      )}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default CertificateComponent;
