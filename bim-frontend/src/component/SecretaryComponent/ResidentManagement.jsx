import { useState, Suspense, lazy } from "react";
import "./ResidentManagement.css";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import ModalComponent from "../../component/ModalComponent";
import StepperComponent from "../StepperComponent";

import SnackbarComponent from "../SnackbarComponent";
import { useResident } from "../../utils/ResidentContext";

const ResidentNameInformationForm = lazy(() =>
  import("../ResidentNameInformationForm")
);
const PersonalDetailForm = lazy(() => import("../PersonalDetailForm"));
const AddressInfoForm = lazy(() => import("../AddressInfoForm"));
const ResidentInformationTable = lazy(() =>
  import("../ResidentInformationTable/ResidentInformationTable")
);
const SearchForHousehold = lazy(() =>
  import("../ExistingResidentComponent/SearchForHousehold")
);

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
    resident_status: ""
  });
  const [pageStatus, setPageStatus] = useState("idle");
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [formType, setFormType] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const { setResidents } = useResident();

  const handleSnackBarClose = (event, reason) => {
    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };

  const handleHouseholdSelect = (householdId) => {
    // Update the formData state with the selected householdId
    setFormData((prevData) => ({
      ...prevData,
      household_id: householdId,
    }));
  }


  //having an error in submitting a form for existing resident
  // debug this becuase when i submit one form from existing resident it creates a new household
  //not getting the household id from the selected household
  //function to submit the form
  const handleSubmitForm = async () => {
        let url = "";

    if(formType === "existing-resident"){
      url = `${VITE_API_URL}/api/residents/add-resident-existing-household`;
    }else{
      url = `${VITE_API_URL}/api/residents/add-resident`;
    }
    try {
      const response = await fetch(
        url,
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

  // In ResidentManagement.jsx

  const handleNewResidentModalOpen = (type) => {
    setFormType(type);

    // update the formData state here
    if (type === "new-resident") {
      setFormData((prevData) => ({
        ...prevData,
        relationship_to_head: "Head",
      }));
    } else {
      // If they click "existing-resident", reset it to empty
      setFormData((prevData) => ({
        ...prevData,
        relationship_to_head: "", // Clear the value so they can choose
      }));
    }


    setOpenModal(false);
    setTimeout(() => {
      setOpenNewResidentModal(true);
    }, 500);
  };

  const handleAddToExistingHouseholdModal = () => {
    setFormType("existing-resident");
    setOpenModal(false);
    setTimeout(() => {
      setOpenNewResidentModal(true);
    }, 500);
  };

  const handleSearchResident = async (term) => {

    try {
      const response = await fetch(
        `${VITE_API_URL}/api/residents/search-resident/${term}`
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Search Results:", data.residents);
        setResidents(data.residents);
        setPageStatus("success");
        setNotificationMessage("Residents fetched successfully!");
        setSuccessSnackBarStatus(true);
      }
    } catch (error) {
      console.log("Error searching resident:", error);
      setPageStatus("error");
      setNotificationMessage(error.message);
      setFailedSnackBarStatus(true);
    }
  };

  //for exisiting resident
  const SearchForHouseholdStep = {
    label: "Search Household",
    description: (
      <Suspense fallback={<div>Loading...</div>}>
        <SearchForHousehold 
          onHouseholdSelect={handleHouseholdSelect}
        />
      </Suspense>
    ),
  }

  const ResidentNameStep = {
    label: "Resident Name",
    description: (
      <Suspense fallback={<div>Loading...</div>}>
        <ResidentNameInformationForm
          formData={formData}
          handleChange={handleFormChange}
          typeofForm={formType}
        />
      </Suspense>
    ),
  };

  const PersonalDetailsStep = {
    label: "Personal Details",
    description: (
      <Suspense fallback={<div>Loading...</div>}>
        <PersonalDetailForm
          formData={formData}
          handleChange={handleFormChange}
        />
      </Suspense>
    ),
  };

  const AddressProfessionStep = {
    label: "Residence & Profession",
    description: (
      <Suspense fallback={<div>Loading...</div>}>
        <AddressInfoForm
          formData={formData}
          handleChange={handleFormChange}
        />
      </Suspense>
    ),
  };

  let steps = [];

  if (formType === "existing-resident") {
    steps.push(SearchForHouseholdStep);
  }

  steps.push(ResidentNameStep);
  steps.push(PersonalDetailsStep);
  steps.push(AddressProfessionStep);
  return (
    <>
      <div id="ris-body">
        <div id="header-title">
          <h1> System</h1>
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
            <Suspense fallback={<div>Loading...</div>}>
              <ResidentInformationTable />
            </Suspense>
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
                onClick={() => handleNewResidentModalOpen("new-resident")}
              >
                Add New
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() =>
                  handleAddToExistingHouseholdModal("existing-resident")
                }
              >
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
