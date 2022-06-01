import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

// This is non optimal but I want things up and running first.

export default function SignUpModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = e => {
    e.preventDefault();
    setShow(false);
    // form user
    // console.log('user', e.target.form.elements[0].value);
    // form pass
    // console.log('pass', e.target.form.elements[1].value);
    const authobject = {
      username: e.target.form.elements[0].value,
      password: e.target.form.elements[1].value
    };
    // console.log(authobject);
    fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(authobject)
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('error:', data);
        }
        // console.log('successfully created account', data);
        // location.reload(); // Refresh page. I know its terrible but it's funny.
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <Button onClick={handleShow}>
        Sign Up
      </Button>

      <Modal show={show} onHide={handleClose}
        centered>
        <Form>
          <Modal.Header>
            <Modal.Title className='mb-2 mt-2'>
              <h4>Sign Up</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form.Group className="mb-3" controlId="formUser">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPass">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
