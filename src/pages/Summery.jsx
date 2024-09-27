import React, { useState, useEffect } from 'react';
import Sidenav from '../Sidenav';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TextField, Button } from '@mui/material';

// Styled header cell with angled text alignment
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: '#120b4f',
  fontWeight: 'bold',
  fontSize: '14px',
  padding: '8px',
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  height: '50px',
  position: 'relative',
}));

// Styled body cell
const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '12px',
  padding: '4px',
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
  height: '30px',
}));

function Summery() {
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
      console.log(response.data);
    } catch (error) {
      setMessage('Error fetching summery data: ' + error.message);
    }
  };

  // Function to handle form submission for adding a new column
  const handleAddColumn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8090/api/v1/student/addColumn', null, {
        params: { columnName: columnName },
      });
      setMessage(response.data);
      setColumnName('');
    } catch (error) {
      setMessage('Error adding column: ' + error.message);
    }
  };

  // Use effect to fetch data when the component mounts
  useEffect(() => {
    fetchAttendanceData();
    fetchSummeryData();
  }, []);

  return (
    <>
      <Sidenav />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          paddingLeft: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 5,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#120b4f' }}>
          Attendance Summary
        </Typography>

        {/* Form to accept new column name */}
        <form
          onSubmit={handleAddColumn}
          style={{
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
            width: '100%',
            maxWidth: '300px',
            marginLeft: 920,
          }}
        >
          <Typography htmlFor="columnName" style={{ color: '#333' }}>
            New Column Name:
          </Typography>
          <TextField
            id="columnName"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            placeholder="DD/MM/YYYY"
            required
            inputProps={{
              pattern: "([0-2][0-9]|(3)[0-1])/(0[1-9]|1[0-2])/[0-9]{4}",
              title: "Please enter a date in the format dd/mm/yyyy",
            }}
            variant="outlined"
            sx={{
              width: '150px', // Set the desired width
              height: '40px', // Set the desired height
              '& .MuiOutlinedInput-root': {
                height: '100%', // Ensure the input takes the full height
                '& input': {
                  height: '100%', // Set input height
                  textAlign: 'center',
                },
              },
            }}
          />
          <Button type="submit" variant="contained" color="primary" style={{ padding: '10px 10px', width: 120, fontSize: 12 }}>
            Create Column
          </Button>
        </form>

        {/* Summary Data Table */}
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 3,
            borderRadius: 1,
            maxHeight: 600,
            overflowY: 'auto',
            marginTop: '20px',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {summeryData.length > 0 &&
                  Object.keys(summeryData[0]).map((key, index) => (
                    <StyledTableCell key={index}>{key}</StyledTableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {summeryData.length > 0 ? (
                summeryData.map((row, rowIndex) => (
                  <StyledTableRow key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <StyledBodyCell key={colIndex}>
                        {/* Display string values as they are and convert boolean/null to 1/0 */}
                        {typeof value === 'boolean' ? (value ? 1 : 0) : value === null ? 0 : value}
                      </StyledBodyCell>
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
