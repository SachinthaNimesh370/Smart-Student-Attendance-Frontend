import React, { useState } from 'react';
import Sidenav from '../Sidenav';
import axios from 'axios';

function Summery() {
  // State to hold the new column name
  const [columnName, setColumnName] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle form submission
  const handleAddColumn = async (e) => {
    e.preventDefault(); // Prevent the page from refreshing

    try {
      // Send the request to the backend to add the new column
      const response = await axios.post('http://localhost:8090/api/v1/student/addColumn', null, {
        params: {
          columnName: columnName, // Pass the new column name as a parameter
        },
      });

      // On success, display a success message
      setMessage(response.data);
      setColumnName(''); // Reset the input field after submission
    } catch (error) {
      // Handle errors and display error message
      setMessage('Error adding column: ' + error.message);
    }
  };

  return (
    <>
      <Sidenav />

      <div style={{ paddingLeft: '300px', paddingTop: '20px' }}>
        <h2>Create New Column in Summery Table</h2>
        
        {/* Form to accept new column name */}
        <form onSubmit={handleAddColumn}>
          <label htmlFor="columnName">New Column Name:</label>
          <input
            type="text"
            id="columnName"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)} // Update state on input change
            placeholder="Enter column name"
            required
          />
          <button type="submit">Create Column</button>
        </form>

        {/* Display success or error message */}
        {message && <p>{message}</p>}
      </div>
    </>
  );
}

export default Summery;
