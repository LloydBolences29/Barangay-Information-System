import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import "../styles/Mainlayout.css";

//react bootstrap imports
import { Button } from 'react-bootstrap'
const Mainlayout = ({ user_name, children, activeComponent, setActiveComponent }) => {

    const handleOnclick = (component) => {
        setActiveComponent(component);
    }
  const { auth } = useAuth();
  console.log("User role", auth.user)
  return (
    <>
      {auth.user === "admin" && (
        <div id="main-body">
          <div id="sidebar-container">
            <div id="sidebar-profile-wrapper">
              <h2>Welcome, {user_name}</h2>
            </div>

            <div id="sidebar-nav-container">
              <ul id="sidebar-nav-list" >
                <li><Button onClick={() => handleOnclick("dashboard")} className="nav-button" variant= {activeComponent === "dashboard" ? "primary" : "outline-primary" }>Dashboard</Button></li>
                <li><Button onClick={() => handleOnclick("user-management")} className="nav-button" variant={activeComponent === "user-management" ? "primary": "outline-primary"}>User Management</Button></li>
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
