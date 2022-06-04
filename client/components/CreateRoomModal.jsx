import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import socket from '../lib/socket-instance';
// This is non optimal but I want things up and running first.

export default function CreateRoomModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = e => {
    e.preventDefault();
    setShow(false);

    // Replacing any roomnames with spaces with a hyphen.
    // Deals with leading/trailing spaces, multiple spaces.
    const processedRoomName = e.target.form.elements[0].value.trim().split(/\s+/).join('-');

    fetch('/api/rooms/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': window.localStorage.getItem('react-context-jwt')
      },
      body: JSON.stringify({ roomname: processedRoomName })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('error:', data);
        } else {
          // {room_id: 10, room_name: 'something', server_id: 1}
          socket.emit('new room', data);
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <div style={{ position: 'relative', width: 0, height: 0 }}>
        <i className="fa-solid fa-plus" onClick={handleShow}></i>
      </div>

      <Modal show={show} onHide={handleClose}
        centered>
        <Form>
          <Modal.Header className='justify-content-center'>
            <Modal.Title className='mb-2 mt-2'>
              <h4>Create Room</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form.Group className="mb-3" controlId="formRoom">
              <Form.Label>Room Name</Form.Label>
              <Form.Control className='dark-input' type="text" />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="blue-button-room blue-button"
            variant="primary"
            type="submit"
            onClick={handleSubmit}>
              Create Room
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
