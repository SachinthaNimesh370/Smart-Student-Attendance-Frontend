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
const ButtonCell = styled(StyledBodyCell)({
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
      const response = await axios.get("http://localhost:8090/api/v1/student/getAllAttendance");
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    fetchAttendanceData(); // Fetch attendance data when the component mounts
  }, []);

  // Function to handle the deletion of a student's attendance record
  const handleDelete = async (studentRegNo, date) => {
    try {
      const [day, month, year] = date.split('/');
      const formattedDate = `${year}-${month}-${day}`;

      await axios.delete(`http://localhost:8090/api/v1/student/deleteAttendance/${studentRegNo}/${formattedDate}`);
      fetchAttendanceData();
      alert("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  // Function to handle accepting an attendance record
  const handleAccept = async (record) => {
    try {
      const { studentRegNo, time, date, location, attendance } = record;

      const requestBody = {
        studentRegNo,
        time,
        date,
        location,
        attendance
      };

      const response = await axios.post('http://localhost:8090/api/v1/student/acceptedAttendance', requestBody);
      alert(response.data);

      // Add the accepted record to the set
      setAcceptedRecords(prev => new Set(prev).add(record.studentRegNo)); // Track accepted records
      fetchAttendanceData();
    } catch (error) {
      console.error("Error accepting attendance:", error);
    }
  };

  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30, display: 'flex', justifyContent: 'space-between', paddingTop: 5 }}>
        <Box sx={{ flex: 1, marginRight: 4 }}>
          <Typography gutterBottom sx={{ textAlign: 'center', fontWeight: 600, fontSize: 40, color: '#120b4f' }}>
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
                    <StyledBodyCell>{record.location.join(', ')}</StyledBodyCell>
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
                        onClick={() => handleDelete(record.studentRegNo, record.date)}
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
