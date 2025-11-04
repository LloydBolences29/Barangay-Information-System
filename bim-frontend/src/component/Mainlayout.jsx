import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";
import "../styles/Mainlayout.css";

import SnackbarComponent from "./SnackbarComponent";

//react bootstrap imports
import { Button } from "react-bootstrap";
const Mainlayout = ({
  user_name,
  children,
  activeComponent,
  setActiveComponent,
  componentLabel,
}) => {
  const navigate = useNavigate();
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [pageStatus, setPageStatus] = useState("idle");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [failedSnackBarStatus, setFailedSnackBarStatus] = useState(false);
  const [successSnackBarStatus, setSuccessSnackBarStatus] = useState(false);

  const handleOnclick = (component) => {
    setActiveComponent(component);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessSnackBarStatus(false);
    setFailedSnackBarStatus(false);
  };
  const { auth, setAuth } = useAuth();

  const handleLogout = async () => {
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
  console.log("User role", auth.user);
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
                <h2>Welcome, {user_name}</h2>
              </div>
              <div id="action-buttons">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>

            <div id="sidebar-nav-container">
              <ul id="sidebar-nav-list">
                {componentLabel &&
                  componentLabel.map((label) => (
                    <li key={label}>
                      <Button
                        onClick={() => handleOnclick(`${label.key}`)}
                        className="nav-button"
                        variant={
                          activeComponent === `${label.key}`
                            ? "primary"
                            : "outline-primary"
                        }
                      >
                        {label.label}
                      </Button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div id="main-content-container">{children}</div>
        </div>
      )}
    </>
  );
};

export default Mainlayout;
