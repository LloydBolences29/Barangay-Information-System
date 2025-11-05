import { useState } from "react";
import ResidentInformationTable from "../ResidentInformationTable/ResidentInformationTable";
import "./ResidentManagement.css";
import { Button } from "react-bootstrap";

const ResidentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchResident = async (term) =>{
    console.log("Searching for resident with term:", term);
  }
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
                <input id="search-input" type="text" placeholder="Search Resident..." onChange={(e) => setSearchTerm(e.target.value)} />
                <Button variant="outline-primary" size="sm" onClick={() => handleSearchResident(searchTerm)}>Search</Button>
              </div>
              <div id="action-buttons">
                <Button variant="outline-primary" size="sm">Add Resident</Button>
              </div>
            </div>
            <ResidentInformationTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResidentManagement;
