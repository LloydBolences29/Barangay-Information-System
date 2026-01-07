import React from "react";
import { Row, Col, Card, Button, Container } from "react-bootstrap";
import { FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TreasurerForm.css"; // Import the new CSS file

const TreasurerForm = () => {
  const navigate = useNavigate();

  const treasurerForms = [
    {
      id: "punong-barangay-certification",
      title: "Punong Barangay's Certification",
      description: "For employment, ID, or general requirements.",
      icon: <FaFileAlt size={40} className="service-icon" />,
      onClick: () => navigate("/treasurer/punong-barangay-certification"),
    },
    // You can easily add more forms here later
  ];

  return (
    <div id="treasurer-dashboard-bg">
      <Container>
        {/* Header Section */}
        <div className="treasurer-header">
          <h1>Treasurer Services</h1>
          <p>Select a form to process</p>
        </div>

        <Row className="justify-content-center mt-4">
          {treasurerForms.map((form) => (
            <Col md={6} lg={4} className="mb-4" key={form.id}>
              <Card
                className="service-card h-100"
                onClick={form.onClick}
              >
                <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                  <div className="icon-wrapper">
                    {form.icon}
                  </div>
                  <h4 className="service-title">{form.title}</h4>
                  <p className="service-desc">
                    {form.description}
                  </p>
                  <Button 
                    variant="primary" 
                    className="mt-auto service-btn"
                  >
                    Select Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default TreasurerForm;