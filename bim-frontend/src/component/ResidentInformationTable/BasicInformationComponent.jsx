import { useState } from "react";
import { BsSearch } from "react-icons/bs";

const BasicInformationComponent = () => {
  return (
    <>
      <div id="basic-info-container">
        <div id="basic-info-wrapper">
          <div id="search-icon">
            <BsSearch />
          </div>
          <div id="search-paragraph"><p>Search for resident's name.</p></div>
        </div>
      </div>
    </>
  );
};

export default BasicInformationComponent;
