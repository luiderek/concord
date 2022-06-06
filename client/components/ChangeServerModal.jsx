import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

export default function ChangeServerModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = e => {
    e.preventDefault();
    setShow(false);

    const processedServerName = e.target.form.elements[0].value.trim().split(/\s+/).join('-');

    fetch('/api/servers/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': window.localStorage.getItem('react-context-jwt')
      },
      body: JSON.stringify({ serverName: processedServerName })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('error:', data);
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <div className="server-name" onClick={handleShow}>
        {props.serverName}
      </div>

      <Modal show={show} onHide={handleClose}
        centered>
        <Form>
          <Modal.Header className='justify-content-center'>
            <Modal.Title className='mb-2 mt-2'>
              <h4>Join Server</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form.Group className="mb-3" controlId="formRoom">
              <Form.Label>Server Name</Form.Label>
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
              Join Server
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
