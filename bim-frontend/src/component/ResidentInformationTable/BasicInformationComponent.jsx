import { useState } from "react";
import "../../styles/BasicInformationComponent.css";
import { useResident } from "../../utils/ResidentContext";
import { Container, Form, Row, Col, Spinner } from "react-bootstrap";
import { Button } from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import ModalComponent from "../ModalComponent";
import SnackbarComponent from "../SnackbarComponent";


const BasicInformationComponent = ({ selectedResident, onBackClick, onUpdateSuccess }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [pageStatus, setPageStatus] = useState("idle");
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const { residents, loading } = useResident();
  const [openEditResidentModal, setOpenEditResidentModal] = useState(false);
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
  });

  console.log("Selected Resident:", selectedResident);

  const handleSnackBarClose = (event, reason) => {
    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };

  const handleOpenEditResidentModal = () => {
    setOpenEditResidentModal(true);
  };

  const handleUpdateResidentInfo = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/api/residents/update-resident/${selectedResident.id}`, {
        method: "PATCH",
        withfCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedResidentData),
      });

      const data = await response.json();
      if (response.ok) {
        setPageStatus("success");
        setNotificationMessage("Resident information updated successfully!");
        setSuccessSnackBarStatus(true);
        setOpenEditResidentModal(false);
        onUpdateSuccess(updatedResidentData);
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
                // href={`/edit-resident/${resident._id}`}
              >
                {" "}
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<AiOutlineEdit />}
                sx={{ mb: 2 }}
                // href={`/edit-resident/${resident._id}`}
              >
                {" "}
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
                  <Col md={6}>
                    <Form.Label className="fw-bold">Citizenship:</Form.Label>
                    <div>{selectedResident.citizenship}</div>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">
                      Profession/Occupation:
                    </Form.Label>
                    <div>{selectedResident.occupation}</div>
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
              additionalButton={buttons}
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
                    </Row>
                  </div>
                </Form.Group>
              </Form>
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
