import { useState, lazy, Suspense, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";
import "../styles/Mainlayout.css";

import SnackbarComponent from "./SnackbarComponent";
import { Button } from "react-bootstrap";
import Navigation from "./Navigation";

// Lazy imports outside component
const AdminDashboard = lazy(() => import("../component/AdminComponents/AdminDashboard.jsx"));
const UserManagement = lazy(() => import("../component/AdminComponents/UserManagement.jsx"));
const SecretaryComponent = lazy(() => import("../component/SecretaryComponent/ResidentManagement.jsx"));
const SecretaryDashboard = lazy(() => import("../component/SecretaryComponent/SecretaryDashboard.jsx"));
const TreasurerComponent = lazy(() => import("../component/TreasurerComponent/TreasurerForm.jsx"));
const TreasurerDashboard = lazy(() => import("../component/TreasurerComponent/TreasurerDashboard.jsx"));

// FIX: Destructure specific props
const Mainlayout = ({ children, activeComponent: activeComponentOverride, setActiveComponent: setActiveComponentOverride }) => {
  const navigate = useNavigate();
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { auth, setAuth } = useAuth();

  // State
  const [pageStatus, setPageStatus] = useState("idle");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);
  
  // Internal State for Dashboard view
  const [internalActiveTabId, setInternalActiveTabId] = useState(""); 

  // DEFINE MENU ITEMS
  let componentsRender = [];

  switch (auth.user.role) {
    case "admin":
      componentsRender = [
        { id: "admin-dashboard", label: "Admin Dashboard", componentToBeRendered: <AdminDashboard /> },
        { id: "user-management", label: "User Management", componentToBeRendered: <UserManagement /> },
      ];
      break;
    case "secretary":
      componentsRender = [
        { id: "secretary-dashboard", label: "Secretary Dashboard", componentToBeRendered: <SecretaryDashboard /> },
        { id: "resident-information-system", label: "Resident Information System", componentToBeRendered: <SecretaryComponent /> },
      ];
      break;
    case "treasurer":
      componentsRender = [
        { id: "treasurer-dashboard", label: "Treasurer Dashboard", componentToBeRendered: <TreasurerDashboard /> },
        { id: "treasurer-form", label: "Forms", componentToBeRendered: <TreasurerComponent /> },
      ];
      break;
    default:
      componentsRender = [];
      break;
  }

  // Set default active tab
  useEffect(() => {
    if (componentsRender.length > 0 && internalActiveTabId === "") {
        setInternalActiveTabId(componentsRender[0].id);
    }
  }, [auth.user, componentsRender]);


  // LOGIC: Determine which ID is "Active" for the Sidebar
  // If 'activeComponentOverride' is passed (from TreasurerFormRenderer), use that.
  // Otherwise, use the internal state.
  const currentActiveId = activeComponentOverride || internalActiveTabId;

  // LOGIC: Determine the setter
  // If we are in a sub-page (override exists), we might not want to change tabs effectively, 
  // or we want to use the override setter.
  const handleSetActive = setActiveComponentOverride || setInternalActiveTabId;


  const renderActiveComponent = () => {
    const activeItem = componentsRender.find(item => item.id === internalActiveTabId);
    return activeItem ? activeItem.componentToBeRendered : null;
  };

  // ... (Logout and Snackbar logic remains the same) ...
  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };

  const handleLogout = async () => {
     // ... your existing logout logic
     try {
      const response = await fetch(`${VITE_API_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setPageStatus("success");
        setNotificationMessage(data.message);
        setSuccessSnackBarStatus(true);
        setTimeout(() => {
          navigate("/");
          setAuth({ isAuthenticated: false });
        }, 3000);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setPageStatus("failed");
      setNotificationMessage(error.message);
      setFailedSnackBarStatus(true);
    }
  };


  return (
    <>
      <SnackbarComponent
        pageState={pageStatus}
        notification={notificationMessage}
        successSnackBarState={successSnackBarStatus}
        failedSnackBarState={failedSnackBarStatus}
        handleClose={handleSnackBarClose}
      />
      {auth.isAuthenticated && (
        <div id="main-body">
          <div id="sidebar-container">
            <div id="sidebar-profile-wrapper">
              <div id="welcome-banner">
                {/* Fixed capitalization logic */}
                <h2>Welcome, {auth.user ? `${auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1)} user` : 'User'}</h2>
              </div>
              <div id="action-buttons">
                <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>

            {/* NAVIGATION gets the calculated 'currentActiveId' */}
            <Navigation
              componentToRender={componentsRender}
              activeComponent={currentActiveId}      
              setActiveComponent={handleSetActive}  
            />
          </div>

          <div id="main-content-container">
            <Suspense fallback={<div className="p-4">Loading...</div>}>
                {/* If 'children' exists (meaning we are in TreasurerFormRenderer), render children.
                   Otherwise, render the dashboard tab component.
                */}
                {children ? children : renderActiveComponent()}
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
};

export default Mainlayout;