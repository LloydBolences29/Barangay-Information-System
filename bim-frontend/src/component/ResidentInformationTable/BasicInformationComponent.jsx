import { BsSearch } from "react-icons/bs";
import { useResident } from "../../utils/ResidentContext";
import { Container, Form, Row, Col, Spinner } from "react-bootstrap";
import { Button } from "@mui/material"; // For the "Back" button
const BasicInformationComponent = ({ selectedResident, onBackClick }) => {
  const { residents, loading } = useResident();

  const resident = selectedResident;

  return (
    <div id="basic-info-container">
      <div id="basic-info-wrapper">
        <Container>
          <Button onClick={onBackClick} sx={{ mb: 2 }}>
            &larr; Back to Search Results
          </Button>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicInfo">
              {residents.map((resident) => (
                <div key={resident._id || resident.firstname}>
                  <Row className="mb-3">
                    <Col md={3}>
                      <Form.Label className="fw-bold">Last Name:</Form.Label>
                      <div>{resident.lastname}</div>
                    </Col>
                    <Col md={3}>
                      <Form.Label className="fw-bold">First Name:</Form.Label>
                      <div>{resident.firstname}</div>
                    </Col>
                    <Col md={3}>
                      <Form.Label className="fw-bold">Middle Name:</Form.Label>
                      <div>{resident.middlename}</div>
                    </Col>
                    <Col md={3}>
                      <Form.Label className="fw-bold">
                        Name Extension:
                      </Form.Label>
                      <div>{resident.name_extension}</div>
                    </Col>
                  </Row>
                  <br />

                  <Row>
                    <Col md={3}>
                      <Form.Label className="fw-bold">
                        Date of Birth:
                      </Form.Label>
                      <div>{resident.dob}</div>
                    </Col>
                    <Col md={3}>
                      <Form.Label className="fw-bold">
                        Place of Birth:
                      </Form.Label>
                      <div>{resident.place_of_birth}</div>
                    </Col>
                    <Col md={3}>
                      <Form.Label className="fw-bold">Sex:</Form.Label>
                      <div>{resident.sex}</div>
                    </Col>
                    <Col md={3}>
                      <Form.Label className="fw-bold">Civil Status:</Form.Label>
                      <div>{resident.civil_status}</div>
                    </Col>
                  </Row>

                  <br />
                  <Row>
                    <Col md={6}>
                      <Form.Label className="fw-bold">Citizenship:</Form.Label>
                      <div>{resident.citizenship}</div>
                    </Col>
                    <Col md={6}>
                      <Form.Label className="fw-bold">
                        Profession/Occupation:
                      </Form.Label>
                      <div>{resident.occupation}</div>
                    </Col>
                  </Row>
                </div>
              ))}
            </Form.Group>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default BasicInformationComponent;
