import React, { useState } from 'react';
import { Container, Button, Modal, Form, Col, Row, Dropdown } from 'react-bootstrap';
import './App.css';
import axios from 'axios';
import { ChevronCompactDown, DashLg } from 'react-bootstrap-icons';

function App() {
  const [show, setShow] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [schemaInputs, setSchemaInputs] = useState([]);
  const [options] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ]);
  const [showDropdown, setShowDropdown] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddSchema = () => {
    setSchemaInputs([...schemaInputs, { placeholder: 'Select an option', value: '' }]);
  };

  const handleRemoveSchema = (index) => {
    const newSchemaInputs = [...schemaInputs];
    newSchemaInputs.splice(index, 1);
    setSchemaInputs(newSchemaInputs);
  };

  const handleSchemaInputChange = (index, value) => {
    const newSchemaInputs = [...schemaInputs];
    newSchemaInputs[index].value = value;
    setSchemaInputs(newSchemaInputs);
  };

  const handleSaveSegment = async () => {
    const segmentData = {
      segment_name: segmentName,
      schema: schemaInputs.map(input => ({ [input.placeholder.toLowerCase().replace(/ /g, '_')]: input.value }))
    };

    console.log(segmentData); 

    try {
      const response = await axios.post('https://webhook.site/412cfc43-d050-492e-afc8-fcb63bec505a', segmentData);
      console.log('Segment saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving segment:', error);
    }

    handleClose();
  };

  const handleOptionSelect = (index, option) => {
    const newSchemaInputs = [...schemaInputs];
    newSchemaInputs[index].placeholder = option.label;
    newSchemaInputs[index].value = ''; 
    setSchemaInputs(newSchemaInputs);
    setShowDropdown(null);
  };

  
  const selectedOptions = schemaInputs.map(input => input.placeholder).filter(value => value !== 'Select an option');

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between">
        <div>
          <h1 style={{ backgroundColor: 'lightgreen', width: '600px', textAlign: 'center' }}>View Audience</h1>
          <hr />
          <Button variant="primary" onClick={handleShow}>
            Save segment
          </Button>
        </div>
        <div>
          <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title style={{ backgroundColor: 'lightgreen', width: '600px', textAlign: 'center', height: '80px', fontStyle: 'inherit' }}>
                Saving Segment
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formSegmentName">
                  <Form.Label>Enter the Name of the Segment</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name of the segment"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                  />
                </Form.Group>
                <div className="mt-4">
                  <h6>Add schemas to segment</h6>
                  {schemaInputs.map((input, index) => {
                    
                    const availableOptions = options.filter(option => !selectedOptions.includes(option.label));

                    return (
                      <Row key={index} className="align-items-center mb-3">
                        <Col xs="auto">
                          <Form.Check type="radio" name="schemaRadio" id={`schemaRadio${index}`} />
                        </Col>
                        <Col>
                          <div className="custom-input-wrapper">
                            <Form.Control
                              type="text"
                              placeholder={input.placeholder}
                              value={input.value} 
                              onChange={(e) => handleSchemaInputChange(index, e.target.value)}
                              className="custom-input"
                              onFocus={() => setShowDropdown(index)} 
                              onBlur={() => setTimeout(() => setShowDropdown(null), 200)} 
                            />
                            {input.placeholder === 'Select an option' && (
                              <ChevronCompactDown
                                className="chevron-icon"
                                onClick={() => setShowDropdown(index === showDropdown ? null : index)} 
                              />
                            )}
                            {showDropdown === index && (
                              <Dropdown.Menu show className="custom-dropdown-menu">
                                {availableOptions.length === 0 ? (
                                  <Dropdown.Item disabled>No options available</Dropdown.Item>
                                ) : (
                                  availableOptions.map((option) => (
                                    <Dropdown.Item
                                      key={option.value}
                                      onClick={() => handleOptionSelect(index, option)}
                                    >
                                      {option.label}
                                    </Dropdown.Item>
                                  ))
                                )}
                              </Dropdown.Menu>
                            )}
                          </div>
                        </Col>
                        <Col xs="auto">
                          <DashLg size="30px" color="rgb(2, 56, 56)" onClick={() => handleRemoveSchema(index)} />
                        </Col>
                      </Row>
                    );
                  })}
                  <div className="d-flex align-items-center">
                    <a href="#!" onClick={handleAddSchema} className="add-schema-link">
                      + Add new schema
                    </a>
                  </div>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleSaveSegment}>
                Save the Segment
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </Container>
  );
}

export default App;
