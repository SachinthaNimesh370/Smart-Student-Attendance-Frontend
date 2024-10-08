import React, { useState } from 'react';
import Sidenav from '../Sidenav';
import { Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

function LectureHalls() {
  // State variables to store form input values
  const [hallName, setHallName] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

  // Handler for submitting form data
  const handleSubmit = async () => {
    // Create the lecture hall data object
    const lectureHallData = {
      hall_name: hallName,
      location: [parseFloat(latitude), parseFloat(longitude)], // Location array with latitude and longitude
    };

    try {
      // Send the data to the backend using axios
      const response = await axios.post('http://localhost:8090/api/v1/student/savelecturehall', lectureHallData);
      alert(response.data); // Display response message
    } catch (error) {
      console.error('Error saving lecture hall:', error);
      alert('Error saving lecture hall');
    }
  };

  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30 }}>
        <Box sx={{ marginBottom: 4 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 40, color: '#120b4f' }}>
            Lecture Hall's Locations
          </Typography>
        </Box>

        {/* Input fields for Lecture Hall name and location */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Lecture Hall Name"
            value={hallName}
            onChange={(e) => setHallName(e.target.value)}
            fullWidth
            sx={{ width: '25%', height: '50px' }}  // Customize width and height here
          />
          <TextField
            label="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            fullWidth
            sx={{ width: '25%', height: '50px' }}  // Customize width and height here
          />
          <TextField
            label="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            fullWidth
            sx={{ width: '25%', height: '50px' }}  // Customize width and height here
          />

          {/* Submit Button */}
          <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit} 
              sx={{ width: '25%', height: '50px' }}  // sx goes here, inside the opening tag
            >
              Save Lecture Hall
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default LectureHalls;
