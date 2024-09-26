import React, { useState, useEffect } from 'react';
import Sidenav from '../Sidenav';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled header cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: '#120b4f',
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '10px',
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
}));

// Styled body cell
const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',
  padding: '6px',
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
}));

// Custom styled table row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer',
  },
  height: '40px',
}));

function Summery() {
  // State to hold the new column name and attendance data
  const [columnName, setColumnName] = useState('');
  const [message, setMessage] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);

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

  // Function to fetch attendance data from the backend
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('http://localhost:8090/api/v1/student/attendanceData');
      setAttendanceData(response.data); // Assuming response data is an array of attendance records
    } catch (error) {
      setMessage('Error fetching data: ' + error.message);
    }
  };

  // Use effect to fetch data when the component mounts
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  return (
    <>
      <Sidenav />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#120b4f' }}>
         Attendance Summery 
        </Typography>

        {/* Form to accept new column name */}
        <form onSubmit={handleAddColumn} style={{ marginBottom: '20px' }}>
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
        {message && <Typography color="error">{message}</Typography>}

        {/* Attendance Data Table */}
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#120b4f', marginTop: '20px' }}>
          Attendance Data
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 1, maxHeight: 600, overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Student Reg No</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Time</StyledTableCell>
                <StyledTableCell>Location</StyledTableCell>
                <StyledTableCell>Attendance</StyledTableCell>
                {/* Add other columns dynamically if needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.length > 0 ? (
                attendanceData.map((record, index) => (
                  <StyledTableRow key={index}>
                    <StyledBodyCell>{record.studentRegNo}</StyledBodyCell>
                    <StyledBodyCell>{record.date}</StyledBodyCell>
                    <StyledBodyCell>{record.time}</StyledBodyCell>
                    <StyledBodyCell>{record.location.join(', ')}</StyledBodyCell> {/* Assuming location is an array */}
                    <StyledBodyCell>{record.attendance ? 'Present' : 'Absent'}</StyledBodyCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledBodyCell colSpan={5}>No attendance data available.</StyledBodyCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default Summery;
