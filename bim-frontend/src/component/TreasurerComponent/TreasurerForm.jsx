import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Container,
} from "react-bootstrap";
import { FaFileAlt } from "react-icons/fa";



const TreasurerForm = () => {
  const navigate = useNavigate();

  const treasurerForms = [
  {
    id: "punong-barangay-certification",
    title: "Punong Barangay's Certification",
    description: "For reporting of Finances in the banks.",
    buttonAction: ()=>navigate("/treasurer/punong-barangay-certification")
  },
];
  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        {treasurerForms.map((form) => (
        <Col md={6} key={form.id} className="mb-4">
          <Card
            className="text-center p-4 shadow-sm h-100"
            style={{ cursor: "pointer", border: "1px solid #0d6efd" }}
            onClick={form.buttonAction}
          >
            <Card.Body>
              <FaFileAlt size={40} className="text-primary mb-3" />
              <h4>{form.title}</h4>
              <p className="text-muted">
                {form.description}
              </p>
              <Button variant="outline-primary" onClick={form.buttonAction}>Select</Button>
            </Card.Body>
          </Card>
        </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TreasurerForm;
