import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import socket from '../lib/socket-instance';

export default function DeleteConfirmModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = e => {
    e.preventDefault();
    setShow(false);
    fetch(`/api/msg/${props.msgID}`, {
      method: 'DELETE',
      headers: {
        'x-access-token': window.localStorage.getItem('react-context-jwt')
      }
    })
      .then(res => res.json())
      .then(data => {
        socket.emit('message delete', data);
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <button className="all-unset">
        <i className="fa-solid fa-trash-can" onClick={handleShow}></i>
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>
            <h4>Delete Message</h4>
            <span>Are you sure you want to delete this message?</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="message-card">
            <span>{props.time}</span>
            <span>{props.name}</span>
            <span>{props.content}</span>
          </div>
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
