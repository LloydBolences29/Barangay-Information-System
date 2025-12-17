import React from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Container,
} from "react-bootstrap";

const TreasurerForm = () => {
  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <Card
            className="text-center p-4 shadow-sm h-100"
            style={{ cursor: "pointer", border: "1px solid #0d6efd" }}
            onClick={() => handleOpen("Clearance")}
          >
            <Card.Body>
              <FaFileAlt size={40} className="text-primary mb-3" />
              <h4>Punong Barangay's Certification</h4>
              <p className="text-muted">
                For employment, ID, or general requirements.
              </p>
              <Button variant="outline-primary">Select</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TreasurerForm;
