import {  createContext, useContext, useState } from "react";

const ResidentContext = createContext();


export const ResidentProvider = ({ children }) => {
     const [residents, setResidents] = useState([]); // fetched data
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <ResidentContext.Provider
      value={{
        residents,
        setResidents,
        searchTerm,
        setSearchTerm,
        loading,
        setLoading,
      }}
    >
      {children}
    </ResidentContext.Provider>
  );
}

export const useResident = () => useContext(ResidentContext);