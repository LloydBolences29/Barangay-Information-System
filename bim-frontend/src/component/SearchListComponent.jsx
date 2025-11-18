import React from "react";
import { useResident } from "../utils/ResidentContext";
import { Spinner } from "react-bootstrap";
import { List, ListItem, ListItemButton, ListItemText, Chip, Box, Typography } from "@mui/material";
import { BsSearch } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi"; // Optional: Icon for error

const SearchListComponent = ({ onSelectResident, onError }) => {
  const { residents, loading } = useResident();

  return (
    <>
      {loading ? (
        // 1. PRIORITY: Loading
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p>Loading residents...</p>
        </div>
      ) : onError ? ( 
        // 2. PRIORITY: Error Message (Check this BEFORE empty list)
        <div className="text-center my-4" style={{ color: 'red' }}>
           <div id="search-icon">
             <BiErrorCircle size={40} />
           </div>
           <p>{onError}</p>
        </div>
      ) : residents.length === 0 ? (
        // 3. PRIORITY: Empty State (Default / Start)
        <>
          <div id="search-icon">
            <BsSearch size={40} />
          </div>
          <div id="search-paragraph">
            <p>Search for resident's name.</p>
          </div>
        </>
      ) : (
        // 4. PRIORITY: Show the List
        <List>
          {residents.map((resident) => (
            <ListItem key={resident.id} disablePadding>
              <ListItemButton onClick={() => onSelectResident(resident)}>
                <ListItemText
                  primary={`${resident.firstname} ${resident.middlename} ${
                    resident.lastname
                  } ${resident.name_extension === 'N/A' ? "" : resident.name_extension}`}
                />
                 {/* <Chip ... /> */}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default SearchListComponent;