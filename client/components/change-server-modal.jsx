import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
// import 'react-bootstrap-typeahead/css/Typeahead.css';

export default function ChangeServerModal(props) {
  const [show, setShow] = useState(false);
  const [serverList, setServerList] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    updateServerList();
  };

  useEffect(() => {
    updateServerList();
  }, []);

  const updateServerList = () => {
    fetch('/api/servers/', {
      headers: {
        'x-access-token': window.localStorage.getItem('react-context-jwt')
      }
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('error:', data);
        } else {
          setServerList(data);
        }
      })
      .catch(err => console.error(err));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setShow(false);

    if (selected.length !== 0) {
      const [id, name] = [selected[0].server_id, selected[0].serv_name];
      props.handleServerChange(name, id);
    } else {
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
          } else {
            props.handleServerChange(data.serv_name, data.server_id);
          }
        })
        .catch(err => console.error(err));
    }
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
              <h4>Change Server</h4>
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
              {selected.length === 0 ? 'Create Server' : 'Join Server'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
