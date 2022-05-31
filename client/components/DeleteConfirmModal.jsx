import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import MessageCard from './MessageCard';
// This is non optimal but I want things up and running first.

export default function DeleteConfirmModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = e => {
    e.preventDefault();
    setShow(false);
    fetch(`/api/msg/${props.msgID}`, {
      method: 'DELETE'
    }).then(res => res.json())
      .then(data => {
        location.reload(); // Refresh page. I know its terrible but it's funny.
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <button className='all-unset'>
        <i className="fa-solid fa-trash-can"
          onClick={handleShow}></i>
      </button>

      <Modal show={show} onHide={handleClose}
            centered>
        <Modal.Header>
          <Modal.Title>
            <h4>Delete Message</h4>
            <span>Are you sure you want to delete this message?</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MessageCard {...props}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}