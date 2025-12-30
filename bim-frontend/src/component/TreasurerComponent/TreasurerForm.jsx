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
import { FaFileAlt, FaHandHoldingHeart, FaPrint, FaBriefcase } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const TreasurerForm = () => {

  const navigate = useNavigate();

  const treasurerForms = [{
    id: "punong-barangay-certification",
    title: "Punong Barangay's Certification",
    description: "For employment, ID, or general requirements.",
    icon: <FaFileAlt size={40} className="text-primary mb-3" />,
    onClick: () => navigate("/treasurer/punong-barangay-certification"),
  }]
  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        {treasurerForms.map((form) => (
          <Col md={6} className="mb-4" key={form.id}>
          <Card
            className="text-center p-4 shadow-sm h-100"
            style={{ cursor: "pointer", border: "1px solid #0d6efd" }}
            onClick={form.onClick}
          >
            <Card.Body>
              {form.icon}
              <h4>{form.title}</h4>
              <p className="text-muted">
                {form.description}
              </p>
              <Button variant="outline-primary">Select</Button>
            </Card.Body>
          </Card>
        </Col>
        ))}
        
      </Row>
    </Container>
  );
};

export default TreasurerForm;
