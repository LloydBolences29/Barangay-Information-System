import { useState } from "react";
import ResidentInformationTable from "../ResidentInformationTable/ResidentInformationTable";
import "./ResidentManagement.css";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import ModalComponent from "../../component/ModalComponent";
import StepperComponent from "../StepperComponent";
import ResidentNamaeInformationForm from "../ResidentNameInformationForm";
import PersonalDetailForm from "../PersonalDetailForm";
import AddressInfoForm from "../AddressInfoForm";

const ResidentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openNewResidentModal, setOpenNewResidentModal] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1 Form
    firstname: '',
    middlename: '',
    lastname: '',
    extname: 'N/A',
    
    // Step 2 Form
    dob: '',
    placeOfBirth: '',
    sex: '',
    civilStatus: '',

    // Step 3 Form
    profession: '',
    houseNumber: '',
    streetName: '',
    fullAddress: '',
  });

  // Helper function to update the state
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
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
      label: 'Resident Name',
      description: <ResidentNamaeInformationForm formData={formData} handleChange={handleFormChange} />,
    },
    {
      label: 'Personal Details',
      description: <PersonalDetailForm formData={formData} handleChange={handleFormChange} />,
    },
    {
      label: 'Residence & Profession',
      description: <AddressInfoForm formData={formData} handleChange={handleFormChange} />,
    }
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
          modalSize="lg"
          modalShow={openNewResidentModal}
          onHide={() => setOpenNewResidentModal(false)}
        >
          {/* <div>
            <div id="header-content">
              <div id="header-title">
                <h5>Individual Record of Barangay Inhabitant</h5>
              </div>

              <div id="prefilled-content">
                <div id="prefilled-left">
                  <p>Region: </p>
                  <p>Province: </p>
                </div>
                <div id="prefilled-right">
                  <p>City/Mun: </p>
                  <p>Barangay: </p>
                </div>
              </div>
            </div>
            <Form>
              <Form.Group className="mb-3" controlId="formResidentName">
                <Row>
                  <Row>
                    <Form.Label>Resident Name</Form.Label>
                  </Row>

                  <Col>
                    <Form.Group controlId="formFirstname">
                      <Form.Label size="sm">
                        Firstname <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter resident firstname"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="formMiddlename">
                      <Form.Label size="sm">
                        Middle name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter resident middlename"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formLastname">
                      <Form.Label size="sm">
                        Lastname <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter resident lastname"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="formExtname">
                      <Form.Label size="sm">Extension (Optional) </Form.Label>
                      <Form.Select>
                        <option value="N/A">None</option>
                        <option value="Jr.">Jr.</option>
                        <option value="Sr.">Sr.</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </div> */}
          
          <StepperComponent steps={steps}/>
        </ModalComponent>
      )}
    </>
  );
};

export default ResidentManagement;
