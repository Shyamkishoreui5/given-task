import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function DrapDown({ options, onAddSchema }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    const option = options.find(option => option.value === value);
    setSelectedOption(option);
  };

  const handleAddClick = () => {
    if (selectedOption) {
      onAddSchema(selectedOption);
      setSelectedOption(null); 
    }
  };

  return (
    <div>
      <Form.Group controlId="formSchemaSelect">
        <Form.Label>Select Schema</Form.Label>
        <Form.Control as="select" value={selectedOption ? selectedOption.value : ''} onChange={handleSelectChange}>
          <option value="">Select an option</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Button variant="primary" onClick={handleAddClick} disabled={!selectedOption}>
        Add
      </Button>
    </div>
  );
}

export default DrapDown;
