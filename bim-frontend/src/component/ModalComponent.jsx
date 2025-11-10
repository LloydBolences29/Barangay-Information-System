import React from "react";

import { Modal, Button } from "react-bootstrap";

const ModalComponent = ({ children, modalTitle, onHide, modalSize, modalShow }) => {
  return (
    <>
      <Modal size={modalSize} show={modalShow} onHide={onHide} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {modalTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComponent;
