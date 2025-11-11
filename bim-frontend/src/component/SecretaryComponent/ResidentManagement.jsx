import { useState } from "react";
import ResidentInformationTable from "../ResidentInformationTable/ResidentInformationTable";
import "./ResidentManagement.css";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import ModalComponent from "../../component/ModalComponent";
import StepperComponent from "../StepperComponent";
import ResidentNamaeInformationForm from "../ResidentNameInformationForm";
import PersonalDetailForm from "../PersonalDetailForm";
import AddressInfoForm from "../AddressInfoForm";
import SnackbarComponent from "../SnackbarComponent";
import Box from "@mui/material/Box";

const ResidentManagement = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openNewResidentModal, setOpenNewResidentModal] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1 Form
    firstname: "",
    middlename: "",
    lastname: "",
    name_extension: "N/A",
    relationship_to_head: "",

    // Step 2 Form
    dob: "",
    place_of_birth: "",
    sex: "",
    civil_status: "",
    citizenship: "",

    // Step 3 Form
    occupation: "",
    house_no: "",
    street: "",
    address: "",
  });
  const [pageStatus, setPageStatus] = useState("idle");
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessSnackBarState(false);
    setFailedSnackBarState(false);
  };

  //function to submit the form
  const handleSubmitForm = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/api/residents/add-resident`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Form data submitted:", formData);

      const data = await response.json();
      console.log("Response from server:", data);
      if (response.ok) {
        setPageStatus("success");
        setNotificationMessage("Resident added successfully!");
        setSuccessSnackBarStatus(true);
        setOpenNewResidentModal(false);
      } else {
        setPageStatus("error");
        setNotificationMessage(data.message || "Failed to add resident.");
        setFailedSnackBarStatus(true);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      setPageStatus("error");
      setNotificationMessage(error.message);
      setFailedSnackBarStatus(true);
      setOpenNewResidentModal(false);
    }
  };

  // Helper function to update the state
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleNewResidentModalOpen = () => {
    setOpenModal(false);
    setTimeout(() => {
      setOpenNewResidentModal(true);
    }, 500);
  };

  const handleSearchResident = async (term) => {
    console.log("Searching for resident with term:", term);
  };

  const steps = [
    {
      label: "Resident Name",
      description: (
        <ResidentNamaeInformationForm
          formData={formData}
          handleChange={handleFormChange}
        />
      ),
    },
    {
      label: "Personal Details",
      description: (
        <PersonalDetailForm
          formData={formData}
          handleChange={handleFormChange}
        />
      ),
    },
    {
      label: "Residence & Profession",
      description: (
        <AddressInfoForm formData={formData} handleChange={handleFormChange} />
      ),
    },
  ];
  return (
    <>
      <div id="ris-body">
        <div id="header-title">
          <h1>Resident Information System</h1>
        </div>

        <div className="container">
          <div id="ris-main-wrapper">
            <div id="ris-actions">
              <div id="search-actions">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search Resident..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-3"
                  size="sm"
                  onClick={() => handleSearchResident(searchTerm)}
                >
                  Search
                </Button>
              </div>
              <div id="action-buttons">
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-3"
                  size="sm"
                  onClick={handleOpenModal}
                >
                  Add Resident
                </Button>
              </div>
            </div>
            <ResidentInformationTable />
          </div>
        </div>
      </div>

      {openModal && (
        <Modal
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={openModal}
          onHide={handleCloseModal}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Resident
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Add New or Existing Resident</h4>
            <div id="modal-buttons">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleNewResidentModalOpen}
              >
                Add New
              </Button>
              <Button variant="outline-secondary" size="sm">
                Add To Existing One
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {openNewResidentModal && (
        <ModalComponent
          modalTitle="Add New Resident"
          modalSize="xl"
          modalShow={openNewResidentModal}
          onHide={() => setOpenNewResidentModal(false)}
        >
          <StepperComponent steps={steps} onFinalSubmit={handleSubmitForm} />
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
    </>
  );
};

export default ResidentManagement;
