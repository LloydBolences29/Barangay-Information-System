import { useState } from "react";
import "../../styles/BasicInformationComponent.css";
import { useResident } from "../../utils/ResidentContext";
import { Container, Form, Row, Col, Spinner } from "react-bootstrap";
import { Button, Chip } from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import ModalComponent from "../ModalComponent";
import SnackbarComponent from "../SnackbarComponent";

const BasicInformationComponent = ({
  selectedResident,
  onBackClick,
  onUpdateSuccess,
}) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [pageStatus, setPageStatus] = useState("idle");
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const { residents, setResidents, loading } = useResident();
  const [openEditResidentModal, setOpenEditResidentModal] = useState(false);
  const [openSoftDeleteModal, setOpenSoftDeleteModal] = useState(false);
  const [updatedResidentData, setUpdatedResidentData] = useState({
    lastname: selectedResident.lastname || "",
    firstname: selectedResident.firstname || "",
    middlename: selectedResident.middlename || "",
    name_extension: selectedResident.name_extension || "",
    dob: selectedResident.dob || "",
    place_of_birth: selectedResident.place_of_birth || "",
    civil_status: selectedResident.civil_status || "",
    citizenship: selectedResident.citizenship || "",
    occupation: selectedResident.occupation || "",
    resident_status: selectedResident.resident_status || "",
  });



  const handleSnackBarClose = (event, reason) => {
    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };

  const handleOpenEditResidentModal = () => {
    setOpenEditResidentModal(true);
  };

  const handleUpdateResidentInfo = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/api/residents/update-resident/${selectedResident.id}`,
        {
          method: "PATCH",
          withfCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedResidentData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        const updated = { ...selectedResident, ...updatedResidentData };
        // Update search results list
    setResidents(prev =>
        prev.map(res =>
            res.id === updated.id ? updated : res
        )
    );
        setPageStatus("success");
        setNotificationMessage("Resident information updated successfully!");
        setSuccessSnackBarStatus(true);
        setOpenEditResidentModal(false);
        onUpdateSuccess(updated);
      }
    } catch (error) {
      console.log("Error updating resident info:", error);
      setPageStatus("error");
      setNotificationMessage("Failed to update resident information.");
      setFailedSnackBarStatus(true);
    }
  };

  const buttons = [
    {
      id: "save-changes",
      label: "Save Changes",
      variant: "outline-success",
      onClick: () => {
        handleUpdateResidentInfo();
      },
    },
  ];

  console.log("Selected Resident:", updatedResidentData);

  const handleSoftDelete = async () =>{
    setOpenSoftDeleteModal(true);
  }

  const handleSoftDeleteConfirm = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/api/residents/soft-delete-resident/${selectedResident.id}`, {
        method: "PATCH",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resident_status: "inactive" }),
      })
      const data = await response.json();
      if (response.ok) {
        setPageStatus("success");
        setNotificationMessage("Resident deleted successfully!");
        setSuccessSnackBarStatus(true);
        setOpenSoftDeleteModal(false);
        onUpdateSuccess({...selectedResident, resident_status: "inactive"});
      }
      
    } catch (error) {
      console.log("Error deleting resident:", error);
      setPageStatus("error");
      setNotificationMessage(error.message || "Failed to delete resident.");
      setFailedSnackBarStatus(true);
    }
  }

  return (
    <div id="basic-info-container">
      <div id="basic-info-wrapper">
        <Container>
          <div className="button-actions">
            <Button onClick={onBackClick} sx={{ mb: 2 }}>
              &larr; Back to Search Results
            </Button>
            <div className="right-button-actions">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<AiOutlineEdit />}
                sx={{ mb: 2 }}
                onClick={handleOpenEditResidentModal}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<AiOutlineEdit />}
                sx={{ mb: 2 }}
                onClick={handleSoftDelete}
              >
                Delete
              </Button>
            </div>
          </div>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicInfo">
              <div key={selectedResident._id || selectedResident.firstname}>
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Label className="fw-bold">Last Name:</Form.Label>

                    <div>{selectedResident.lastname}</div>
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-bold">First Name:</Form.Label>
                    <div>{selectedResident.firstname}</div>
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-bold">Middle Name:</Form.Label>
                    <div>{selectedResident.middlename}</div>
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-bold">Name Extension:</Form.Label>
                    <div>{selectedResident.name_extension}</div>
                  </Col>
                </Row>
                <br />

                <Row>
                  <Col md={3}>
                    <Form.Label className="fw-bold">Date of Birth:</Form.Label>
                    <div>{selectedResident.dob}</div>
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-bold">Place of Birth:</Form.Label>
                    <div>{selectedResident.place_of_birth}</div>
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-bold">Sex:</Form.Label>
                    <div>{selectedResident.sex}</div>
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-bold">Civil Status:</Form.Label>
                    <div>{selectedResident.civil_status}</div>
                  </Col>
                </Row>

                <br />
                <Row>
                  <Col md={4}>
                    <Form.Label className="fw-bold">Citizenship:</Form.Label>
                    <div>{selectedResident.citizenship}</div>
                  </Col>
                  <Col md={4}>
                    <Form.Label className="fw-bold">
                      Profession/Occupation:
                    </Form.Label>
                    <div>{selectedResident.occupation}</div>
                  </Col>
                  <Col md={4}>
                    <Form.Label className="fw-bold">
                     Resident Status:
                    </Form.Label>
                    <div><Chip label={selectedResident.resident_status === "inactive" ? "Deleted" : selectedResident.resident_status} color={selectedResident.resident_status === "active" ? "success" : "default"} /></div>
                  </Col>
                </Row>
              </div>
            </Form.Group>
          </Form>

          {openEditResidentModal && (
            <ModalComponent
              modalTitle="Edit Resident"
              modalSize="lg"
              modalShow={openEditResidentModal}
              onHide={() => setOpenEditResidentModal(false)}
              additionalButton={
                <Button
                  id="save-changes"
                  variant="outlined"
                  color="success"
                  size="small"
                  startIcon={<AiOutlineEdit />}
                  onClick={handleUpdateResidentInfo}
                >
                  Save Changes
                </Button>
              }
            >
              <Form>
                <Form.Group className="mb-3" controlId="formBasicInfo">
                  <div key={selectedResident._id || selectedResident.firstname}>
                    <Row className="mb-3">
                      <Col md={3}>
                        <Form.Label className="fw-bold">Last Name:</Form.Label>

                        <Form.Control
                          type="text"
                          value={updatedResidentData.lastname}
                          onChange={(e) =>
                            setUpdatedResidentData({
                              ...updatedResidentData,
                              lastname: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Label className="fw-bold">First Name:</Form.Label>
                        <Form.Control
                          type="text"
                          value={updatedResidentData.firstname}
                          onChange={(e) =>
                            setUpdatedResidentData({
                              ...updatedResidentData,
                              firstname: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Label className="fw-bold">
                          Middle Name:
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={updatedResidentData.middlename}
                          onChange={(e) =>
                            setUpdatedResidentData({
                              ...updatedResidentData,
                              middlename: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Label className="fw-bold">
                          Name Extension:
                        </Form.Label>
                        <Form.Select
                          value={updatedResidentData.name_extension}
                          onChange={(e) =>
                            setUpdatedResidentData({
                              ...updatedResidentData,
                              name_extension: e.target.value,
                            })
                          }
                        >
                          <option value="N/A">None</option>
                          <option value="Jr.">Jr.</option>
                          <option value="Sr.">Sr.</option>
                          <option value="II">II</option>
                          <option value="III">III</option>
                          <option value="IV">IV</option>
                        </Form.Select>
                      </Col>
                    </Row>
                    <br />

                    <Row>
                      <Col md={3}>
                        <Form.Label className="fw-bold">
                          Date of Birth:
                        </Form.Label>
                        {/* Birthday form */}
                        <Form.Control
                          type="date"
                          value={updatedResidentData.dob}
                          onChange={(e) =>
                            setUpdatedResidentData({
                              ...updatedResidentData,
                              dob: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Label className="fw-bold">
                          Place of Birth:
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={updatedResidentData.place_of_birth}
                          onChange={(e) =>
                            setUpdatedResidentData({
                              ...updatedResidentData,
                              place_of_birth: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Label className="fw-bold">Sex:</Form.Label>
                        <div>{selectedResident.sex}</div>
                      </Col>
                      <Col md={3}>
                        <Form.Label className="fw-bold">
                          Civil Status:
                        </Form.Label>
                        <Form.Select
                          value={updatedResidentData.civil_status}
                          onChange={(e) =>
                            setUpdatedResidentData({
                              ...updatedResidentData,
                              civil_status: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Civil Status</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="widowed">Widowed</option>
                          <option value="divorced">Divorced</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    <br />
                    <Row>
                      <Col md={6}>
                        <Form.Label className="fw-bold">
                          Citizenship:
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={updatedResidentData.citizenship}
                          onChange={(e) =>
                            setUpdatedResidentData({
                              ...updatedResidentData,
                              citizenship: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="fw-bold">
                          Profession/Occupation:
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={updatedResidentData.occupation}
                          onChange={(e) =>
                            setUpdatedResidentData({
                              ...updatedResidentData,
                              occupation: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="fw-bold">
                          Resident Status:
                        </Form.Label>
                        <Form.Select
                          type="text"
                          value={updatedResidentData.resident_status}
                          onChange={(e) =>
                            setUpdatedResidentData({
                              ...updatedResidentData,
                              resident_status: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Resident Status</option>
                          <option value="active">Active</option>
                          <option value="moved-out">Moved Out</option>
                          <option value="deceased">Deceased</option>
                          <option value="inactive">Deleted</option>

                        </Form.Select>
                      </Col>
                    </Row>
                  </div>
                </Form.Group>
              </Form>
            </ModalComponent>
          )}

          {openSoftDeleteModal && (
            <ModalComponent
              modalTitle="Confirm Deletion"
              modalSize="md"
              modalShow={openSoftDeleteModal}
              onHide={() => setOpenSoftDeleteModal(false)}
              additionalButton={
                <Button
                  id="confirm-delete"
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<AiOutlineEdit />}
                  onClick={handleSoftDeleteConfirm}
                >
                  Confirm Delete
                </Button>
              }
            >
              <p>
                Are you sure you want to delete the resident{" "}
                <strong>
                  {selectedResident.firstname} {selectedResident.lastname}
                </strong>
                ? This action can be undone by restoring the resident's
                status.
              </p>
            </ModalComponent>
          )}
          {/* Snackbar */}
          <SnackbarComponent
            pageState={pageStatus}
            notification={notificationMessage}
            successSnackBarState={successSnackBarStatus}
            failedSnackBarState={failedSnackBarStatus}
            handleClose={handleSnackBarClose}
          />
        </Container>
      </div>
    </div>
  );
};

export default BasicInformationComponent;
