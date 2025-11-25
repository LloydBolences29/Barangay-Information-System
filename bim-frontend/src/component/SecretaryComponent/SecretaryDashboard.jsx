import React from "react";
import "./SecretaryDashboard.css";

const SecretaryDashboard = () => {
  return (
    <>
      <div id="main-secretary-dashboard">
        <div id="welcome-banner">
          <h1>Welcome to your dashboard</h1>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-wrapper">
            <h1>this is the container for your stats</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecretaryDashboard;
