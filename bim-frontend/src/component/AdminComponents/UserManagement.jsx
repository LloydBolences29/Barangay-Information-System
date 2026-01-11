import { useState } from "react";
import { Form, Row, Col, Button, Container, Modal, Card, FloatingLabel } from "react-bootstrap";
import { AiOutlineUserAdd, AiOutlineWarning } from "react-icons/ai";
import SnackbarComponent from "../SnackbarComponent"; // Adjust path if needed
import "./UserManagement.css"; // Create this CSS file

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
  const [pageStatus, setPageStatus] = useState("idle");
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSnackBarClose = (event, reason) => {
    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const isPasswordValid = () => {
    return payload.user_password === confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid()) {
      setOpenModal(true);
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setPageStatus("success");
        setSuccessSnackBarStatus(true);
        setNotificationMessage(data.message);
        setPayload({
          firstName: "",
          lastName: "",
          username: "",
          user_password: "",
          user_role: "",
        });
        setConfirmPassword("");
      } else {
        setPageStatus("failed");
        setFailedSnackBarStatus(true);
        setNotificationMessage(data.message);
      }
    } catch (error) {
      console.error("Error during user registration:", error);
      setPageStatus("failed");
      setFailedSnackBarStatus(true);
      setNotificationMessage("An error occurred during registration");
    }
  };

  return (
    <div id="register-body">
      <Container className="d-flex flex-column align-items-center">
        
        {/* Header Section */}
        <div className="register-header text-center mb-4">
          <h1>System Access Management</h1>
          <p className="text-muted">Create new accounts for administrators and staff members</p>
        </div>

        {/* Main Form Card */}
        <Card className="register-card shadow-lg">
          <Card.Body className="p-5">
            <div className="form-title mb-4">
                <AiOutlineUserAdd size={28} className="me-2 text-primary-custom" />
                <h3 className="m-0">Register New User</h3>
            </div>
            
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <FloatingLabel controlId="floatingFirst" label="First Name" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      value={payload.firstName}
                      onChange={(e) => setPayload({ ...payload, firstName: e.target.value })}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel controlId="floatingLast" label="Last Name" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      value={payload.lastName}
                      onChange={(e) => setPayload({ ...payload, lastName: e.target.value })}
                      required
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FloatingLabel controlId="floatingUsername" label="Username" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      value={payload.username}
                      onChange={(e) => setPayload({ ...payload, username: e.target.value })}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel controlId="floatingRole" label="Assign Role" className="mb-3">
                    <Form.Select
                      value={payload.user_role}
                      onChange={(e) => setPayload({ ...payload, user_role: e.target.value })}
                      required
                    >
                      <option value="">Select Role...</option>
                      <option value="admin">Administrator</option>
                      <option value="captain">Barangay Captain</option>
                      <option value="secretary">Barangay Secretary</option>
                      <option value="treasurer">Barangay Treasurer</option>
                      <option value="clerk">Barangay Clerk</option>
                      <option value="tanod">Barangay Tanod</option>
                      <option value="health_worker">Health Worker</option>
                      <option value="sk_chairman">SK Chairman</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>

              <hr className="my-4" />

              <Row>
                <Col md={6}>
                  <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={payload.user_password}
                      onChange={(e) => setPayload({ ...payload, user_password: e.target.value })}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel controlId="floatingConfirm" label="Confirm Password" className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <div className="d-grid gap-2 mt-4">
                <Button className="btn-register" size="lg" type="submit">
                  Create Account
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* Error Modal */}
      <Modal
        show={openModal}
        onHide={() => setOpenModal(false)}
        centered
        className="error-modal"
      >
        <Modal.Body className="text-center p-4">
            <div className="text-warning mb-3">
                <AiOutlineWarning size={50} />
            </div>
            <h4>Password Mismatch</h4>
            <p className="text-muted">
                The password and confirm password fields do not match. Please try again.
            </p>
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
                Close
            </Button>
        </Modal.Body>
      </Modal>

      <SnackbarComponent
        pageState={pageStatus}
        notification={notificationMessage}
        successSnackBarState={successSnackBarStatus}
        failedSnackBarState={failedSnackBarStatus}
        handleClose={handleSnackBarClose}
      />
    </div>
  );
};

export default UserManagement;