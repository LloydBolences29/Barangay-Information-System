import { useState } from "react";
import "./PunongBarangayCertificate.css";
import ModalComponent from "../../ModalComponent";
import SnackbarComponent from "../../SnackbarComponent";
import { AiOutlineEdit } from "react-icons/ai";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PunongBarangayTemplate from "../../TreasurerComponent/TreasurerFormTemplate/PunongBarangayTemplate";
import {
  FaFileAlt,
  FaHandHoldingHeart,
  FaPrint,
  FaBriefcase,
} from "react-icons/fa";

//react bootstap imports
import { Table, Button, Form, Col, Row, FloatingLabel } from "react-bootstrap";

const PunongBarangayCertificate = () => {
  const [tableData, setTableData] = useState([]);
  const [tableFormData, setTableFormData] = useState({
    accountNo: "",
    checkNo: "",
    date: "",
    payee: "",
    amount: "",
    purpose: "",
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [showAddDataModal, setShowAddDataModal] = useState(false);
  const [pageStatus, setPageStatus] = useState("idle");
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [brgyNo, setBrgyNo] = useState("");
  const [zone, setZone] = useState("");
  const [province, setProvince] = useState("");

  const handleShowAddDataModal = () => setShowAddDataModal(true);
  const handleSnackBarClose = (event, reason) => {
    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };

  const handleShowPrintModal = () => setShowPrintModal(true);

  const handleAddData = () => {
    setTableData([...tableData, tableFormData]);
    setTotalAmount((prev) => prev + (parseFloat(tableFormData.amount) || 0));
    setShowAddDataModal(false);

    // Reset form
    setTableFormData({
      accountNo: "",
      checkNo: "",
      date: "",
      payee: "",
      amount: "",
      purpose: "",
    });
    setPageStatus("success");
    setSuccessSnackBarStatus(true);
    setNotificationMessage("Data added successfully.");
  };

  return (
    <div className="punong-barangay-certificate-container">
      <div className="header-container">
        <h2>This is the Punong Barangay Certificate form</h2>
      </div>
      <div className="table-container">
        {/* Table content goes here */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Account No.</th>
              <th>Check No.</th>
              <th>Date</th>
              <th>Payee</th>
              <th>Amount</th>
              <th>Purpose</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table rows will be dynamically generated here */}
            {tableData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  No data available.
                </td>
              </tr>
            )}
            {tableData.map((data, index) => (
              <tr key={index}>
                <td>{data.accountNo}</td>
                <td>{data.checkNo}</td>
                <td>{data.date}</td>
                <td>{data.payee}</td>
                <td>{data.amount}</td>
                <td>{data.purpose}</td>
                <td className="d-flex gap-2">
                  <Button variant="outline-danger rounded-pill px-3">
                    Delete
                  </Button>
                  <Button variant="outline-secondary rounded-pill px-3">
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="outline-primary rounded-pill px-3"
            onClick={handleShowAddDataModal}
          >
            Add
          </Button>
          <Button
            variant="outline-success rounded-pill px-3"
            className="ms-3"
            onClick={handleShowPrintModal}
            disabled={tableData.length === 0}
          >
            To PDF
          </Button>
        </div>
        <div className="d-flex justify-content-end">
          <div>
            <h5>Total Amount: </h5>
          </div>
          <div className="ms-3 text-danger">
            <h5>₱ {totalAmount.toFixed(2)}</h5>
          </div>
        </div>
      </div>

      {showAddDataModal && (
        <ModalComponent
          modalTitle="Add Data"
          modalSize="lg"
          modalShow={showAddDataModal}
          onHide={() => setShowAddDataModal(false)}
          additionalButton={
            <Button
              id="save-changes"
              variant="outline-success"
              color="success"
              size="small"
              startIcon={<AiOutlineEdit />}
              onClick={handleAddData}
            >
              Add Info
            </Button>
          }
        >
          {/* Modal content for adding data goes here */}
          <Form>
            <Form.Group className="mb-3" controlId="formData">
              <div className="d-flex flex-column gap-3">
                <Row className="mb-3">
                  <Col md={6}>
                    <FloatingLabel
                      controlId="floatingAccount"
                      label="Account No."
                    >
                      <Form.Control
                        type="text"
                        name="accountNo"
                        value={tableFormData.accountNo}
                        onChange={(e) =>
                          setTableFormData({
                            ...tableFormData,
                            accountNo: e.target.value,
                          })
                        }
                        placeholder="Enter Account No."
                        required
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel
                      controlId="floatingCheckNo"
                      label="Check No."
                    >
                      <Form.Control
                        type="text"
                        name="checkNo"
                        value={tableFormData.checkNo}
                        onChange={(e) =>
                          setTableFormData({
                            ...tableFormData,
                            checkNo: e.target.value,
                          })
                        }
                        placeholder="Enter Check No."
                        required
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <FloatingLabel controlId="floatingDate" label="Date">
                      <Form.Control
                        type="date"
                        name="date"
                        value={tableFormData.date}
                        onChange={(e) =>
                          setTableFormData({
                            ...tableFormData,
                            date: e.target.value,
                          })
                        }
                        placeholder="Enter Date"
                        required
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="floatingPayee" label="Payee">
                      <Form.Control
                        type="text"
                        name="payee"
                        value={tableFormData.payee}
                        onChange={(e) =>
                          setTableFormData({
                            ...tableFormData,
                            payee: e.target.value,
                          })
                        }
                        placeholder="Enter Payee"
                        required
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <FloatingLabel controlId="floatingAmount" label="Amount">
                      <Form.Control
                        type="number"
                        name="amount"
                        step="0.01"
                        value={tableFormData.amount}
                        onChange={(e) =>
                          setTableFormData({
                            ...tableFormData,
                            amount: e.target.value,
                          })
                        }
                        placeholder="Enter Amount"
                        required
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="floatingPurpose" label="Purpose">
                      <Form.Control
                        type="text"
                        name="purpose"
                        value={tableFormData.purpose}
                        onChange={(e) =>
                          setTableFormData({
                            ...tableFormData,
                            purpose: e.target.value,
                          })
                        }
                        placeholder="Enter Purpose"
                        required
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              </div>
            </Form.Group>
          </Form>
        </ModalComponent>
      )}

      {showPrintModal && (
        <ModalComponent
          modalTitle="Print Punong Barangay Certificate"
          modalSize="lg"
          modalShow={showPrintModal}
          onHide={() => setShowPrintModal(false)}
          additionalButton={
            <PDFDownloadLink
              document={
                <PunongBarangayTemplate
                  brgyNo={brgyNo}
                  zone={zone}
                  province={province}
                  checkData={tableData}
                  totalAmount={totalAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                />
              }
              fileName="Punong_Barangay_Certificate.pdf"
            >
              {({ loading }) => (
                <Button variant="primary" disabled={loading} className="w-100">
                  {loading ? (
                    "Generating..."
                  ) : (
                    <>
                      <FaPrint /> Download PDF
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          }
        >
          <Row>
            <Col md={4} style={{ borderRight: "1px solid #ddd" }}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Barangay No.</Form.Label>
                  <Form.Control
                    type="text"
                    value={brgyNo}
                    onChange={(e) => setBrgyNo(e.target.value)}
                    autoFocus
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Zone</Form.Label>
                  <Form.Control
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Province</Form.Label>
                  <Form.Control
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col md={8} style={{ height: "600px", backgroundColor: "#f5f5f5" }}>
              <PDFViewer width="100%" height="100%" showToolbar={false}>
                <PunongBarangayTemplate
                  brgyNo={brgyNo}
                  zone={zone}
                  province={province}
                  checkData={tableData}
                  totalAmount={totalAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                />
              </PDFViewer>
            </Col>
          </Row>
        </ModalComponent>
      )}

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

export default PunongBarangayCertificate;
