import { useState } from "react";
import { Form, Row, Col, Button, Container, Modal } from "react-bootstrap";

const UserManagement = () => {
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    username: "",
    user_password: "",
    user_role: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const API_URL = import.meta.env.REACT_PUBLIC_API_URL;
  //check the password and the confirm password fields match
  const isPasswordValid = () => {
    if (payload.user_password !== confirmPassword) {

      return false;
    }
    return true;
  };

  //validate form inputs and handle form submission here
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid()) {
      setOpenModal(true);
      return;
    }
    // Handle user registration logic here
    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json"  },
        body: JSON.stringify(payload)
    });
      if (res.ok) {
        const data = await res.json();
        console.log("User registered successfully:", data);
      } else {
        console.error("Failed to register user:", res.statusText);
      }
    } catch (error) {
      console.error("Error during user registration:", error);
    }
  };
  return (
    <div>
      <Container id="register-main-container">
        <div id="welcome-header-text">
          <h1>Welcome to Barangay Information Management System</h1>
        </div>

        <div id="register-container">
          <div>
            <h2>Register</h2>
          </div>

          <div>
            <Form onSubmit={handleSubmit}>
              <Row sm={1} md={2} lg={2}>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicFirstname">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      value={payload.firstName}
                      onChange={(e) => {
                        setPayload({ ...payload, firstName: e.target.value });
                      }}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicLastname">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Last name"
                      value={payload.lastName}
                      onChange={(e) => {
                        setPayload({ ...payload, lastName: e.target.value });
                      }}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Username"
                      value={payload.username}
                      onChange={(e) => {
                        setPayload({ ...payload, username: e.target.value });
                      }}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      value={payload.user_role}
                      onChange={(e) => {
                        setPayload({ ...payload, user_role: e.target.value });
                      }}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="captain">Barangay Captain</option>
                      <option value="secretary">Barangay Secretary</option>
                      <option value="clerk">Barangay Clerk</option>
                      <option value="tanod">Barangay Tanod</option>
                      <option value="treasurer">Barangay Treasurer</option>
                      <option value="health_worker">
                        Barangay Health Worker
                      </option>
                      <option value="sk_chairman">Barangay SK Chairman</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter Password"
                      value={payload.user_password}
                      onChange={(e) => {
                        setPayload({
                          ...payload,
                          user_password: e.target.value,
                        });
                      }}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicConfirmPassword"
                  >
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="outline-primary" type="submit">
                Add User
              </Button>
            </Form>
          </div>
        </div>
      </Container>

      {openModal && (

      <Modal
      show={openModal}
      onHide={() => setOpenModal(false)}  
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <h4>Password do not Match</h4>
        <p>
          The password and confirm password fields do not match. Please try
          again.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() =>setOpenModal(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
      )}

    </div>
  );
};

export default UserManagement;
