import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Badge,
  Modal,
  Form,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";
import { AiOutlineEdit, AiOutlineUser } from "react-icons/ai";
import SnackbarComponent from "../SnackbarComponent";
import "./AdminDashboard.css"; // Make sure to create this CSS file

const AdminDashboard = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState([]);

  // --- Edit Modal States ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    user_role: "",
    is_active: 1,
  });
  const [pageStatus, setPageStatus] = useState("idle");
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSnackBarClose = (event, reason) => {
    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/api/users/get-all-users`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setUserData(data.users);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // --- Handlers ---

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      user_role: user.user_role,
      is_active: user.is_active,
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {

    const payload = {
      firstName: editFormData.firstname, // Map lowercase state to CamelCase backend expectation
      lastName: editFormData.lastname, // Map lowercase state to CamelCase backend expectation
      username: editFormData.username,
      user_role: editFormData.user_role,
      is_active: parseInt(editFormData.is_active),
    };

    try {
      // 2. Call the API
      const response = await fetch(
        `${VITE_API_URL}/api/users/update-user/${selectedUser.id}`,
        {
          method: "PATCH", // Changed from PUT to PATCH based on your router
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // 3. Update local state immediately (Optimistic Update)
        const updatedUsers = userData.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                firstname: editFormData.firstname, // Update local view with new data
                lastname: editFormData.lastname,
                username: editFormData.username,
                user_role: editFormData.user_role,
                is_active: parseInt(editFormData.is_active),
              }
            : user
        );
        setPageStatus("success");
        setNotificationMessage("User updated successfully!");
        setSuccessSnackBarStatus(true);
        setUserData(updatedUsers);

        handleCloseModal();
     
      } else {
        setPageStatus("error");
        setNotificationMessage("Failed to update user.");
        setFailedSnackBarStatus(true);
        console.error("Update failed:", data.message);
      }
    } catch (error) {
      console.error("Failed to update user", error);
      setPageStatus("error");
      setNotificationMessage("An error occurred while connecting to the server.");
      setFailedSnackBarStatus(true);
    }
  };

  return (
    <div id="admin-dashboard-body">
      <Container>
        {/* Header Section */}
        <div className="admin-header mb-4">
          <div className="header-text">
            <h1>User Management</h1>
            <p className="text-muted">
              Manage system access, roles, and user statuses
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="admin-card shadow-sm">
          <Table hover responsive className="admin-table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Profile</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(userData) && userData.length > 0 ? (
                userData.map((user) => (
                  <tr key={user.id}>
                    <td className="text-muted">#{user.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="user-avatar-placeholder">
                          {user.firstname.charAt(0)}
                          {user.lastname.charAt(0)}
                        </div>
                        <div className="ms-3">
                          <div className="fw-bold text-dark">
                            {user.firstname} {user.lastname}
                          </div>
                          <div className="small text-muted">System User</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.username}</td>
                    <td>
                      <Badge bg="info" className="role-badge">
                        {user.user_role}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        bg={user.is_active === 1 ? "success" : "secondary"}
                        className="status-badge"
                      >
                        {user.is_active === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="action-btn"
                        onClick={() => handleEditClick(user)}
                      >
                        <AiOutlineEdit className="me-1" /> Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>

      {/* --- EDIT MODAL --- */}
      <Modal show={showEditModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <FloatingLabel controlId="floatingFirst" label="First Name">
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    name="firstname"
                    value={editFormData.firstname}
                    onChange={handleInputChange}
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel controlId="floatingLast" label="Last Name">
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="lastname"
                    value={editFormData.lastname}
                    onChange={handleInputChange}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <FloatingLabel controlId="floatingUsername" label="Username">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={editFormData.username}
                    onChange={handleInputChange}
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel controlId="floatingRole" label="Role">
                  <Form.Select
                    name="user_role"
                    value={editFormData.user_role}
                    onChange={handleInputChange}
                  >
                    <option value="admin">Admin</option>
                    <option value="secretary">Secretary</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="captain">Captain</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel
                  controlId="floatingStatus"
                  label="Account Status"
                >
                  <Form.Select
                    name="is_active"
                    value={editFormData.is_active}
                    onChange={handleInputChange}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Snackbar */}
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

export default AdminDashboard;
