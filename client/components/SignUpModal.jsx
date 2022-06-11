import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default function SignUpModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = e => {
    e.preventDefault();
    setShow(false);
    const authobject = {
      username: e.target.form.elements[0].value,
      password: e.target.form.elements[1].value
    };
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
        } else {
          fetch('/api/auth/sign-in', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': window.localStorage.getItem('react-context-jwt')
            },
            body: JSON.stringify(authobject)
          }).then(res => res.json())
            .then(data => {
              if (data.error) {
                console.error('error:', data);
              } else if (data.user && data.token) {
                props.onSignIn(data);
              }
            })
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <Button className="blue-button" onClick={handleShow}>
        Sign Up
      </Button>

      <Modal show={show} onHide={handleClose}
        centered>
        <Form>
          <Modal.Header className='justify-content-center'>
            <Modal.Title className='mb-2 mt-2'>
              <h4>Sign Up</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form.Group className="mb-3" controlId="formUser">
              <Form.Label>Username</Form.Label>
              <Form.Control className='dark-input' type="text" maxLength="12" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPass">
              <Form.Label>Password</Form.Label>
              <Form.Control className='dark-input' type="password" />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="blue-button"
            variant="primary"
            type="submit"
            onClick={handleSubmit}>
              Continue
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
