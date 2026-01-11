import { useState } from "react";
import { useSettings } from "../../utils/SettingsContext";
import "./AdminSettings.css";
import SnackbarComponent from "../SnackbarComponent";
import { Button, Modal, Form } from "react-bootstrap"; // Added Form

const AdminSettings = () => {
  const { settings, refreshSettings } = useSettings();
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  // -- Modal States --
  const [showSetBarangayNameModal, setShowSetBarangayNameModal] = useState(false);
  const [showSetBarangayLogoModal, setShowSetBarangayLogoModal] = useState(false);

  // -- Data States --
  const [barangayName, setBarangayName] = useState("");
  const [barangayLogo, setBarangayLogo] = useState(null); // Stores the selected file

  // -- Snackbar States --
  const [pageStatus, setPageStatus] = useState("idle");
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSnackBarClose = () => {
    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };

  // -- Toggle Settings --
  const handleToggle = async (key, currentValue) => {
    const newValue = !currentValue;
    try {
      await fetch(`${VITE_API_URL}/api/system-settings/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: newValue }),
      });
      refreshSettings();
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  // -- Handler: Update Name --
  const handleChangeName = async () => {
    if (!barangayName.trim()) {
      setNotificationMessage("Please enter a valid name.");
      setFailedSnackBarStatus(true);
      return;
    }

    try {
      const response = await fetch(`${VITE_API_URL}/api/system-settings/update-barangay-name`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barangay_name: barangayName }),
      });

      const data = await response.json();
      if (response.ok) {
        setPageStatus("success");
        setNotificationMessage("Barangay name updated successfully.");
        setSuccessSnackBarStatus(true);
        setShowSetBarangayNameModal(false);
        setBarangayName(""); // Reset input
        refreshSettings();
      } else {
        throw new Error(data.message || "Failed to update name");
      }
    } catch (error) {
      console.error("Error updating name:", error);
      setPageStatus("error");
      setNotificationMessage("Failed to update barangay name.");
      setFailedSnackBarStatus(true);
    }
  };

  // -- Handler: File Selection --
  const handleLogoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBarangayLogo(e.target.files[0]);
    }
  };

  // -- Handler: Upload Logo --
  const handleUploadLogo = async () => {
    if (!barangayLogo) {
      setNotificationMessage("Please select an image file first.");
      setFailedSnackBarStatus(true);
      return;
    }

    // Use FormData for file uploads
    const formData = new FormData();
    formData.append("barangay_logo", barangayLogo);
    
    // Note: If your backend needs the name to do an 'upsert', append it here:
    // formData.append("barangay_name", settings.barangay_name || "New Barangay");

    try {
      const response = await fetch(`${VITE_API_URL}/api/system-settings/update-barangay-logo`, {
        method: "PATCH",
        // Do NOT set Content-Type header manually for FormData; the browser sets it with the boundary
        body: formData, 
      });

      const data = await response.json();
      if (response.ok) {
        setPageStatus("success");
        setNotificationMessage("Logo updated successfully.");
        setSuccessSnackBarStatus(true);
        setShowSetBarangayLogoModal(false);
        setBarangayLogo(null);
        refreshSettings();
      } else {
        throw new Error(data.message || "Failed to update logo");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      setPageStatus("error");
      setNotificationMessage("Failed to upload logo.");
      setFailedSnackBarStatus(true);
    }
  };

  return (
    <div className="p-4">
      <h2>System Configuration</h2>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={settings.payment_required || false}
          onChange={() => handleToggle("payment_required", settings.payment_required)}
        />
        <label className="form-check-label">Require Payment for Certificates</label>
      </div>

      <div className="additional-global-settings-container">
        <div className="additional-global-settings-wrapper d-flex gap-3">
          <Button variant="outline-primary" onClick={() => setShowSetBarangayNameModal(true)}>
            Set Barangay Name
          </Button>
          <Button variant="outline-primary" onClick={() => setShowSetBarangayLogoModal(true)}>
            Set Barangay Logo
          </Button>
        </div>
      </div>

      {/* --- MODAL 1: Set Barangay Name --- */}
      <Modal show={showSetBarangayNameModal} onHide={() => setShowSetBarangayNameModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Set Barangay Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter barangay name..." 
              value={barangayName} 
              onChange={(e) => setBarangayName(e.target.value)} 
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSetBarangayNameModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleChangeName}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- MODAL 2: Set Barangay Logo --- */}
      <Modal show={showSetBarangayLogoModal} onHide={() => setShowSetBarangayLogoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Set Barangay Logo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Upload Image</Form.Label>
            <Form.Control 
              type="file" 
              accept="image/*" 
              onChange={handleLogoFileChange} 
            />
            <Form.Text className="text-muted">
               Recommended: PNG or JPG. Max size 2MB.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSetBarangayLogoModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUploadLogo}>
            Upload Logo
          </Button>
        </Modal.Footer>
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

export default AdminSettings;