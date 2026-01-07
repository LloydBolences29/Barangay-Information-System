import { useState, useEffect } from "react";
import "./PunongBarangayCertificate.css";
import ModalComponent from "../../ModalComponent"; // Adjust path if needed
import SnackbarComponent from "../../SnackbarComponent"; // Adjust path if needed
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PunongBarangayTemplate from "../../TreasurerComponent/TreasurerFormTemplate/PunongBarangayTemplate"; // Adjust path
import { FaPrint, FaFileInvoiceDollar } from "react-icons/fa";

// React Bootstrap imports
import { Table, Button, Form, Col, Row, FloatingLabel, Container } from "react-bootstrap";

const PunongBarangayCertificate = () => {
  const [tableData, setTableData] = useState([]);
  
  // Form State
  const [tableFormData, setTableFormData] = useState({
    accountNo: "",
    checkNo: "",
    date: "",
    payee: "",
    amount: "",
    purpose: "",
  });

  // State to track which row we are editing (-1 means adding new)
  const [editIndex, setEditIndex] = useState(-1);

  const [totalAmount, setTotalAmount] = useState(0);
  const [showAddDataModal, setShowAddDataModal] = useState(false);
  
  // Notifications
  const [pageStatus, setPageStatus] = useState("idle");
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  
  // PDF Config
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [brgyNo, setBrgyNo] = useState("");
  const [zone, setZone] = useState("");
  const [province, setProvince] = useState("");

  // --- 1. Auto-Calculate Total ---
  // Whenever tableData changes, recalculate the total automatically.
  // This is safer than adding/subtracting manually.
  useEffect(() => {
    const newTotal = tableData.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
    setTotalAmount(newTotal);
  }, [tableData]);

  const handleShowAddDataModal = () => {
    setEditIndex(-1); // Reset to "Add Mode"
    setTableFormData({
      accountNo: "",
      checkNo: "",
      date: "",
      payee: "",
      amount: "",
      purpose: "",
    });
    setShowAddDataModal(true);
  };

  const handleShowPrintModal = () => setShowPrintModal(true);
  
  const handleSnackBarClose = () => {
    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };

  // --- 2. Save Data (Handles both Add and Edit) ---
  const handleSaveData = () => {
    // Basic Validation
    if (!tableFormData.amount || !tableFormData.payee) {
      setNotificationMessage("Please fill in required fields.");
      setPageStatus("error");
      setFailedSnackBarStatus(true);
      return;
    }

    if (editIndex >= 0) {
      // UPDATE EXISTING ROW
      const updatedTableData = [...tableData];
      updatedTableData[editIndex] = tableFormData;
      setTableData(updatedTableData);
      setNotificationMessage("Record updated successfully.");
    } else {
      // ADD NEW ROW
      setTableData([...tableData, tableFormData]);
      setNotificationMessage("Record added successfully.");
    }

    setShowAddDataModal(false);
    setPageStatus("success");
    setSuccessSnackBarStatus(true);
    
    // Reset form
    setTableFormData({
      accountNo: "",
      checkNo: "",
      date: "",
      payee: "",
      amount: "",
      purpose: "",
    });
    setEditIndex(-1);
  };

  // --- 3. Edit Handler ---
  const handleEditRow = (index) => {
    setEditIndex(index); // Set the index we are editing
    setTableFormData(tableData[index]); // Fill form with that row's data
    setShowAddDataModal(true); // Open the modal
  };

  // --- 4. Delete Handler ---
  const handleDeleteRow = (index) => {
    // Confirm delete (optional, but good practice)
    if (window.confirm("Are you sure you want to delete this record?")) {
      const updatedTableData = tableData.filter((_, i) => i !== index);
      setTableData(updatedTableData);
      
      setNotificationMessage("Record deleted.");
      setPageStatus("success");
      setSuccessSnackBarStatus(true);
    }
  };

  return (
    <div id="pbc-body">
      <Container>
        {/* Header Section */}
        <div className="pbc-header mb-4">
            <div className="header-text">
                <h1>Punong Barangay Certification</h1>
                <p className="text-muted">Manage check disbursements and generate certificates</p>
            </div>
            <div className="header-actions">
                 <Button
                    variant="primary"
                    className="action-btn-main shadow-sm"
                    onClick={handleShowAddDataModal}
                  >
                    <AiOutlinePlus className="me-2" /> Add Record
                  </Button>
                  <Button
                    variant="success"
                    className="action-btn-secondary shadow-sm ms-2"
                    onClick={handleShowPrintModal}
                    disabled={tableData.length === 0}
                  >
                    <FaPrint className="me-2"/> Generate PDF
                  </Button>
            </div>
        </div>

        {/* Main Content Card */}
        <div className="pbc-card shadow-sm">
          <div className="table-responsive">
            <Table hover className="custom-table align-middle">
              <thead>
                <tr>
                  <th>Account No.</th>
                  <th>Check No.</th>
                  <th>Date</th>
                  <th>Payee</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center empty-state py-5">
                      <FaFileInvoiceDollar size={50} color="#dee2e6" className="mb-3" />
                      <p className="text-muted">No records found. Click "Add Record" to start.</p>
                    </td>
                  </tr>
                )}
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td className="fw-bold text-primary">{data.accountNo}</td>
                    <td>{data.checkNo}</td>
                    <td>{data.date}</td>
                    <td>{data.payee}</td>
                    <td className="fw-bold">₱ {parseFloat(data.amount).toLocaleString()}</td>
                    <td className="text-muted small">{data.purpose}</td>
                    <td className="text-center">
                      <Button 
                        variant="link" 
                        className="text-secondary p-0 me-2"
                        onClick={() => handleEditRow(index)}
                      >
                        <AiOutlineEdit size={20} />
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-danger p-0"
                        onClick={() => handleDeleteRow(index)}
                      >
                        <AiOutlineDelete size={20} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="pbc-card-footer">
            <div className="total-label">Total Amount</div>
            <div className="total-value">₱ {totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </div>
        </div>
      </Container>

      {/* --- ADD/EDIT MODAL --- */}
      {showAddDataModal && (
        <ModalComponent
          // Dynamic Title based on editIndex
          modalTitle={editIndex >= 0 ? "Edit Check Record" : "Add Check Record"}
          modalSize="lg"
          modalShow={showAddDataModal}
          onHide={() => setShowAddDataModal(false)}
          additionalButton={
            <Button
              id="save-changes"
              variant="primary"
              onClick={handleSaveData}
            >
              {editIndex >= 0 ? "Update Record" : "Save Record"}
            </Button>
          }
        >
          <Form>
             <div className="p-2">
                <Row className="mb-3">
                  <Col md={6}>
                    <FloatingLabel controlId="floatingAccount" label="Account No.">
                      <Form.Control
                        type="text"
                        value={tableFormData.accountNo}
                        onChange={(e) => setTableFormData({ ...tableFormData, accountNo: e.target.value })}
                        placeholder="Enter Account No."
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="floatingCheckNo" label="Check No.">
                      <Form.Control
                        type="text"
                        value={tableFormData.checkNo}
                        onChange={(e) => setTableFormData({ ...tableFormData, checkNo: e.target.value })}
                        placeholder="Enter Check No."
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <FloatingLabel controlId="floatingDate" label="Date">
                      <Form.Control
                        type="date"
                        value={tableFormData.date}
                        onChange={(e) => setTableFormData({ ...tableFormData, date: e.target.value })}
                        placeholder="Enter Date"
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                     <FloatingLabel controlId="floatingPayee" label="Payee">
                      <Form.Control
                        type="text"
                        value={tableFormData.payee}
                        onChange={(e) => setTableFormData({ ...tableFormData, payee: e.target.value })}
                        placeholder="Enter Payee"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                   <Col md={6}>
                    <FloatingLabel controlId="floatingAmount" label="Amount">
                      <Form.Control
                        type="number"
                        step="0.01"
                        value={tableFormData.amount}
                        onChange={(e) => setTableFormData({ ...tableFormData, amount: e.target.value })}
                        placeholder="Enter Amount"
                      />
                    </FloatingLabel>
                   </Col>
                   <Col md={6}>
                    <FloatingLabel controlId="floatingPurpose" label="Purpose">
                      <Form.Control
                        type="text"
                        value={tableFormData.purpose}
                        onChange={(e) => setTableFormData({ ...tableFormData, purpose: e.target.value })}
                        placeholder="Enter Purpose"
                      />
                    </FloatingLabel>
                   </Col>
                </Row>
             </div>
          </Form>
        </ModalComponent>
      )}

      {/* --- PRINT MODAL (Same as before) --- */}
      {showPrintModal && (
        <ModalComponent
          modalTitle="Print Preview"
          modalSize="xl"
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
                  totalAmount={totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                />
              }
              fileName="Punong_Barangay_Certificate.pdf"
            >
              {({ loading }) => (
                <Button variant="success" disabled={loading}>
                  {loading ? "Generating..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          }
        >
          <Row className="h-100">
            <Col md={3} className="border-end p-4 bg-light">
              <h6 className="mb-3 fw-bold text-uppercase text-muted" style={{fontSize: '0.8rem'}}>Configuration</h6>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Barangay No.</Form.Label>
                  <Form.Control type="text" value={brgyNo} onChange={(e) => setBrgyNo(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Zone</Form.Label>
                  <Form.Control type="text" value={zone} onChange={(e) => setZone(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Province</Form.Label>
                  <Form.Control type="text" value={province} onChange={(e) => setProvince(e.target.value)} />
                </Form.Group>
              </Form>
            </Col>
            <Col md={9} className="p-0">
               <div style={{ height: "70vh", background: "#525659" }}>
                <PDFViewer width="100%" height="100%" showToolbar={true}>
                    <PunongBarangayTemplate
                    brgyNo={brgyNo}
                    zone={zone}
                    province={province}
                    checkData={tableData}
                    totalAmount={totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    />
                </PDFViewer>
               </div>
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