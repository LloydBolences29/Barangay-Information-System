import React from "react";
import { useResident } from "../utils/ResidentContext";
import { Spinner } from "react-bootstrap";
import { List, ListItem, ListItemButton, ListItemText, Chip } from "@mui/material";
import { BsSearch } from "react-icons/bs";

// It receives "onSelectResident" as a prop
const SearchListComponent = ({ onSelectResident }) => {
  const { residents, loading } = useResident(); // Gets data from Context

  return (
    <>
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p>Loading residents...</p>
        </div>
      ) : residents.length === 0 ? (
        <>
          <div id="search-icon">
            <BsSearch size={40} />
          </div>
          <div id="search-paragraph">
            <p>Search for resident's name.</p>
          </div>
        </>
      ) : (
        <List>
          {residents.map((resident) => (
            <ListItem key={resident.id} disablePadding>
              <ListItemButton onClick={() => onSelectResident(resident)}>
                <ListItemText
                  primary={`${resident.firstname} ${resident.middlename} ${
                    resident.lastname
                  } ${resident.name_extension === 'N/A' ? "" : resident.name_extension}`}
                />
                {/* Add the status chip */}
                {/* <Chip
                  label={resident.status}
                  color={resident.status === "Active" ? "success" : "default"}
                  size="small"
                /> */}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default SearchListComponent;