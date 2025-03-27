import React, { useState, useEffect } from 'react';
import Sidenav from '../Sidenav';
import {
  Box, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';

// Custom styled components for the table headers
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: '#120b4f',
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '10px',
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
}));

// Custom styled components for the body cells with conditional styling for status
const StyledBodyCell = styled(TableCell)(({ theme, status }) => ({
  fontSize: '14px',
  padding: '6px',
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  color: status === 'Inactive' ? 'red' : status === 'Active' ? 'green' : 'inherit',
}));

function LectureHalls() {
  const [hallName, setHallName] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [lectureHalls, setLectureHalls] = useState([]);
  const [selectedHallId, setSelectedHallId] = useState(null);

  useEffect(() => {
    fetchLectureHalls();
  }, []);

  const fetchLectureHalls = async () => {
    try {
      const response = await axios.get('http://localhost:8090/api/v1/controller/getAlllecturehall');
      setLectureHalls(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching lecture halls:', error);
    }
  };

  const handleSubmit = async () => {
    const lectureHallData = {
      id: selectedHallId,
      hall_name: hallName,
      location: [parseFloat(latitude), parseFloat(longitude)],
    };

    try {
      const response = await axios.post('http://localhost:8090/api/v1/controller/savelecturehall', lectureHallData);
      alert(response.data.data);
      fetchLectureHalls();
      clearFields();
    } catch (error) {
      console.error('Error saving lecture hall:', error);
      alert('Error saving lecture hall');
    }
  };

  const handleUpdate = async () => {
    if (selectedHallId === null) {
      alert("Please select a lecture hall to update.");
      return;
    }

    const lectureHallData = {
      id: selectedHallId,
      hall_name: hallName,
      location: [parseFloat(latitude), parseFloat(longitude)],
    };

    try {
      const response = await axios.put('http://localhost:8090/api/v1/controller/updatelecturehall', lectureHallData);
      alert(response.data.data);
      fetchLectureHalls();
      clearFields();
      setSelectedHallId(null);
    } catch (error) {
      console.error('Error updating lecture hall:', error);
      alert('Error updating lecture hall');
    }
  };

  // Delete lecture hall by ID
  const handleDelete = async () => {
    if (selectedHallId === null) {
      alert("Please select a lecture hall to delete.");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8090/api/v1/controller/deletelecturehall/${selectedHallId}`);
      alert(response.data.data);
      fetchLectureHalls();
      clearFields();
      setSelectedHallId(null);
    } catch (error) {
      console.error('Error deleting lecture hall:', error);
      alert('Error deleting lecture hall');
    }
  };

  const handleRowClick = (hall) => {
    setHallName(hall.hall_name);
    setLatitude(hall.location[0].toString());
    setLongitude(hall.location[1].toString());
    setSelectedHallId(hall.id);
  };

  const clearFields = () => {
    setHallName('');
    setLatitude('');
    setLongitude('');
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
            sx={{ width: '25%', height: '50px' }}
          />
          <TextField
            label="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            fullWidth
            sx={{ width: '25%', height: '50px' }}
          />
          <TextField
            label="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            fullWidth
            sx={{ width: '25%', height: '50px' }}
          />
        </Box>

        {/* Button Container */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ width: '25%', height: '50px' }}
          >
            Save Lecture Hall
          </Button>

          {/* Update Button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpdate}
            sx={{ width: '25%', height: '50px' }}
          >
            Update Lecture Hall
          </Button>

          {/* Delete Button */}
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ width: '25%', height: '50px' }}
          >
            Delete Lecture Hall
          </Button>

          {/* Clear Button */}
          <Button
            variant="outlined"
            color="warning"
            onClick={clearFields}
            sx={{ width: '25%', height: '50px' }}
          >
            Clear Fields
          </Button>
        </Box>

        {/* Table to display lecture halls */}
        <Box sx={{ marginTop: -55, display: 'flex', justifyContent: 'flex-end' }}>
          <TableContainer component={Paper} sx={{ width: '73%' }}>
            <Table sx={{ minWidth: 650 }} aria-label="lecture hall table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e0f7fa' }}>
                  {/* Customized Table Header */}
                  <StyledTableCell>Lecture Hall Name</StyledTableCell>
                  <StyledTableCell>Latitude</StyledTableCell>
                  <StyledTableCell>Longitude</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lectureHalls.map((hall) => (
                  <TableRow
                    key={hall.id}
                    onClick={() => handleRowClick(hall)}
                    hover
                    style={{ cursor: 'pointer' }}
                  >
                    <StyledBodyCell component="th" scope="row">{hall.hall_name}</StyledBodyCell>
                    <StyledBodyCell align="right">{hall.location[0]}</StyledBodyCell>
                    <StyledBodyCell align="right">{hall.location[1]}</StyledBodyCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}

export default LectureHalls;