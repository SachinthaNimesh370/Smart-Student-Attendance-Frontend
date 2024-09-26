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
  // State to hold data and messages
  const [columnName, setColumnName] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [summeryData, setSummeryData] = useState([]);
  const [message, setMessage] = useState('');

  // Function to fetch attendance data from the backend
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('http://localhost:8090/api/v1/student/attendanceData');
      setAttendanceData(response.data);
    } catch (error) {
      setMessage('Error fetching attendance data: ' + error.message);
    }
  };

  // Function to fetch summary data from the backend
  const fetchSummeryData = async () => {
    try {
      const response = await axios.get('http://localhost:8090/api/v1/student/getAllSummeryData');
      setSummeryData(response.data);
    } catch (error) {
      setMessage('Error fetching summery data: ' + error.message);
    }
  };

  // Function to handle form submission for adding a new column
  const handleAddColumn = async (e) => {
    e.preventDefault(); // Prevent the page from refreshing

    try {
      const response = await axios.post('http://localhost:8090/api/v1/student/addColumn', null, {
        params: {
          columnName: columnName,
        },
      });
      setMessage(response.data);
      setColumnName(''); // Reset the input field after submission
    } catch (error) {
      setMessage('Error adding column: ' + error.message);
    }
  };

  // Use effect to fetch data when the component mounts
  useEffect(() => {
    fetchAttendanceData(); // Fetch attendance data
    fetchSummeryData();    // Fetch summary data
  }, []);

  return (
    <>
      <Sidenav />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#120b4f' }}>
          Attendance Summary
        </Typography>

        {/* Form to accept new column name */}
        <form onSubmit={handleAddColumn} style={{ marginBottom: '20px' }}>
          <label htmlFor="columnName">New Column Name:</label>
          <input
            type="text"
            id="columnName"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            placeholder="Enter column name"
            required
          />
          <button type="submit">Create Column</button>
        </form>

        {/* Display success or error message */}
        {message && <Typography color="error">{message}</Typography>}


        {/* Summary Data Table */}
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#120b4f', marginTop: '20px' }}>
          Summary Data
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 1, maxHeight: 600, overflowY: 'auto', marginTop: '20px' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {summeryData.length > 0 && Object.keys(summeryData[0]).map((key, index) => (
                  <StyledTableCell key={index}>{key}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {summeryData.length > 0 ? (
                summeryData.map((row, rowIndex) => (
                  <StyledTableRow key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <StyledBodyCell key={colIndex}>{value}</StyledBodyCell>
                    ))}
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledBodyCell colSpan={100}>No summary data available.</StyledBodyCell>
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
