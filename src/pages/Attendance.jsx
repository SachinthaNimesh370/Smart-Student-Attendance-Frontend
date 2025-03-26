import React, { useEffect, useState } from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Styled header cell to make the text bold and set background color, center text
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: '#120b4f',
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '10px',
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
}));

// Styled body cell for table data, center text
const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',
  padding: '6px',
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
}));

// Custom styled components for the table rows
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,  // Highlight alternate rows
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,  // Highlight on hover
    cursor: 'pointer',  // Pointer cursor when hovering over rows
  },
  height: '40px',  // Height of table rows
}));

// Styled cell for buttons, center buttons within cell
const ButtonCell = styled(StyledBodyCell)( {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
});

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]); // State to hold fetched attendance data
  const [acceptedRecords, setAcceptedRecords] = useState(new Set()); // State to track accepted records

  // Fetch the data from backend
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/v1/controller/getAllAttendance");
      setAttendanceData(response.data.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    fetchAttendanceData(); // Fetch attendance data when the component mounts
  }, []);

  // Function to handle the deletion of a student's attendance record
  const handleDelete = async (studentRegNo, date) => {
    if (!date || typeof date !== 'string') {
      console.error("Invalid date format:", date);
      return; // Early return if date is invalid
    }

    try {
      const [day, month, year] = date.split('/'); // Make sure date is in the format dd/mm/yyyy
      const formattedDate = `${year}-${month}-${day}`;

      await axios.delete(`http://localhost:8090/api/v1/controller/deleteAttendance/${studentRegNo}/${formattedDate}`);
      fetchAttendanceData();
      alert("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  // Function to handle accepting an attendance record and deleting it afterward
  const handleAccept = async (record) => {
    try {
      const { studentRegNo, time, date, location, attendance } = record;

      const requestBody = {
        studentRegNo,
        time,
        date,
        location,
        attendance,
      };

      // Post the accepted attendance data
      const response = await axios.post('http://localhost:8090/api/v1/controller/acceptedAttendance', requestBody);
      alert(response.data.data);

      // Add the accepted record to the set
      setAcceptedRecords(prev => new Set(prev).add(record.studentRegNo)); // Track accepted records

      // Call handleDelete to delete the attendance record after accepting it
      handleDelete(studentRegNo, date);

    } catch (error) {
      console.error("Error accepting attendance:", error);
    }
  };

  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30, display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
        <Box sx={{ flex: 1, marginRight: 4 }}>         
          <Typography sx={{ fontWeight: 600, fontSize: 40, color: '#120b4f' }}>
            Student Attendance
          </Typography>
          <TableContainer 
            component={Paper} 
            sx={{ boxShadow: 3, borderRadius: 1, maxHeight: 600, overflowY: 'auto' }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Time</StyledTableCell>
                  <StyledTableCell>Student Reg No</StyledTableCell>                
                  <StyledTableCell>Location</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((record, index) => (
                  <StyledTableRow key={index}>
                    <StyledBodyCell>{record.date}</StyledBodyCell>
                    <StyledBodyCell>{record.time}</StyledBodyCell>
                    <StyledBodyCell>{record.studentRegNo}</StyledBodyCell>
                    <StyledBodyCell>
                      {(() => {
                        // Destructure and convert lat and lon to the desired formats
                        const [lat, lon] = record.location;
                        const formattedLat = parseFloat(lat).toFixed(3); // Convert lat to x.xxxx
                        const formattedLon = parseFloat(lon).toFixed(3); // Convert lon to xx.xxx
                        console.log(formattedLat);
                        console.log(formattedLon);

                        // Validate based on the formatted values
                        if (formattedLat === '9.332' && formattedLon === '80.414') {
                          return 'Lecture Hall 01';
                        } else if (formattedLat === '9.333' && formattedLon === '80.414') {
                          return 'Lecture Hall 02';
                        } else if (formattedLat === '6.900' && formattedLon === '79.873') {
                          return 'BMICH UOJ Stall';
                        } else if (formattedLat === '0.000' && formattedLon === '0.000') {
                          return 'BMICH UOJ Stall';
                        } else {
                          return 'Fake Attendance';
                          
                        }
                      })()}
                    </StyledBodyCell>

                    <ButtonCell>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleAccept(record)}
                        disabled={acceptedRecords.has(record.studentRegNo)} // Disable if already accepted
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => handleDelete(record.studentRegNo, record.date)} // Ensure record.date is a string
                      >
                        Delete
                      </Button>
                    </ButtonCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}

export default Attendance;
