import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export default function ChangeServerModal(props) {
  const [show, setShow] = useState(false);
  const [serverList, setServerList] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetch('/api/servers/', {
      headers: {
        'x-access-token': window.localStorage.getItem('react-context-jwt')
      }
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('error:', data);
        } else {
          // data = []{serv_name: , server_id:}
          setServerList(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    setShow(false);
    const [id, name] = [selected[0].server_id, selected[0].serv_name];
    props.handleServerChange(name, id);

    // Ideally I might need a different typeover/input component,
    // where if the name doesn't line up with an existing,
    // it will create the room, and then switch into it afterwards.

    // Create Server Fetch Request.
    // const processedServerName = e.target.form.elements[0].value.trim().split(/\s+/).join('-');
    // fetch('/api/servers/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-access-token': window.localStorage.getItem('react-context-jwt')
    //   },
    //   body: JSON.stringify({ serverName: processedServerName })
    // }).then(res => res.json())
    //   .then(data => {
    //     if (data.error) {
    //       console.error('error:', data);
    //     }
    //   })
    //   .catch(err => console.error(err));
  };

  return (
    <>
      <div className="server-name" onClick={handleShow}>
        {props.serverName.split('-').join(' ')}
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
              <Typeahead
                id="server-selector"
                className='dark-input'
                labelKey="serv_name"
                onChange={setSelected}
                options={serverList}
                placeholder="Select a server: "
                selected={null}
              />
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
