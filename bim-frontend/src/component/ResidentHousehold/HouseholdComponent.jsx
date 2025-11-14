import  { useState, useEffect } from "react";
import { Typography } from "@mui/material";

//bootstrap components
import { Container, Form, Row, Col, Table } from "react-bootstrap";

const HouseholdComponent = ({ selectedRes }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const [householdMembers, setHouseholdMembers] = useState([]);

  const fetchAllHouseholdMembers = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/api/residents/get-household-members/${selectedRes.id}`
      );
      const data = await response.json();
      if (response.ok) {
        setHouseholdMembers(data.members);
      }
    } catch (error) {
      console.log("Error fetching household members:", error);
    }
  };

  useEffect(() => {
    fetchAllHouseholdMembers();
  }, []);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Household Info for: {selectedRes.firstname} {selectedRes.lastname}
      </Typography>

      <Container>
        <Form>
          <Form.Group className="mb-3" controlId="formHouseholdInfo">
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label className="fw-bold">Household ID:</Form.Label>
                <div>{selectedRes.household_number}</div>
              </Col>
              <Col md={4}>
                <Form.Label className="fw-bold">Date Registered:</Form.Label>
                <div>{selectedRes.date_registered}</div>
              </Col>
            </Row>
          </Form.Group>
        </Form>

        <br />

        <Typography variant="h6" gutterBottom>
          Household Members: ({householdMembers.length})
        </Typography>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Relationship to Head</th>
              <th>Street</th>
              <th>House No</th>
            </tr>
          </thead>
          <tbody>
            {householdMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.firstname}</td>
                <td>{member.lastname}</td>
                <td>{member.relationship_to_head}</td>
                <td>{member.street}</td>
                <td>{member.house_no}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default HouseholdComponent;
