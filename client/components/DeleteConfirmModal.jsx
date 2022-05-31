import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
// This is non optimal but I need things running first before optimization.

export default function DeleteConfirmModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* <Button onClick={handleShow} /> */}
      <i className="fa-solid fa-trash-can"
        onClick={handleShow}></i>

      <Modal show={show} onHide={handleClose}
            centered>
        <Modal.Header>
          <Modal.Title>
            <h4>Delete Message</h4>
            <span>Are you sure you want to delete this message?</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          image, person, date, text content.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
