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
  textAlign: 'center', // Center align header text
}));

// Styled body cell for table data, center text
const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',
  padding: '6px',
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center', // Center align table data text
}));

// Styled row with hover effect and alternating background colors
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '91d7fa',
  },
  '&:hover': {
    backgroundColor: '91d7fa',
    cursor: 'pointer',
  },
  height: '40px',
}));

// Styled cell for buttons, center buttons within cell
const ButtonCell = styled(StyledBodyCell)({
  display: 'flex',
  justifyContent: 'center', // Center align the buttons horizontally
  alignItems: 'center', // Center align the buttons vertically
  gap: '10px', // Add spacing between buttons
});

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]); // State to hold fetched attendance data

  // Fetch the data from backend
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/v1/student/getAllAttendance"); // API call to fetch attendance data
      setAttendanceData(response.data); // Store the fetched data in the state
    } catch (error) {
      console.error("Error fetching attendance data:", error); // Log error if fetch fails
    }
  };

  useEffect(() => {
    fetchAttendanceData(); // Fetch attendance data when the component mounts
  }, []);

  // Function to handle the deletion of a student's attendance record
  const handleDelete = async (studentRegNo, date) => {
    try {
      const [day, month, year] = date.split('/'); // Convert date format from dd/mm/yyyy to yyyy-mm-dd
      const formattedDate = `${year}-${month}-${day}`;

      await axios.delete(`http://localhost:8090/api/v1/student/deleteAttendance/${studentRegNo}/${formattedDate}`); // API call to delete record
      fetchAttendanceData(); // Refresh the table data after deletion
      alert("Record deleted successfully!"); // Alert success message
    } catch (error) {
      console.error("Error deleting attendance:", error); // Log error if deletion fails
    }
  };

  // Function to handle accepting an attendance record
  const handleAccept = async (record) => {
    try {
      const { studentRegNo, time, date, location, attendance } = record; // Destructure attendance record data

      const requestBody = {
        studentRegNo,
        time,
        date,
        location,
        attendance
      };

      // Send POST request to accept attendance
      const response = await axios.post('http://localhost:8090/api/v1/student/acceptedAttendance', requestBody);
      alert(response.data); // Show the success message from the backend
      fetchAttendanceData(); // Refresh the table data after accepting
    } catch (error) {
      console.error("Error accepting attendance:", error); // Log error if accept fails
    }
  };

  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30, display: 'flex', justifyContent: 'space-between', paddingTop: 5 }}>
        <Box sx={{ flex: 1, marginRight: 4 }}>
          {/* Title of the page */}
          <Typography gutterBottom sx={{ textAlign: 'center', fontWeight: 600, fontSize: 40, color: '#120b4f' }}>
            Student Attendance
          </Typography>
          {/* Table container to display the data */}
          <TableContainer 
            component={Paper} 
            sx={{ 
              boxShadow: 3, 
              borderRadius: 1, 
              maxHeight: 600, 
              overflowY: 'auto'
            }}
          >
            <Table stickyHeader>
              {/* Table header */}
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Time</StyledTableCell>
                  <StyledTableCell>Student Reg No</StyledTableCell>                
                  <StyledTableCell>Location</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell> {/* Column for action buttons */}
                </TableRow>
              </TableHead>
              {/* Table body */}
              <TableBody>
                {attendanceData.map((record, index) => (
                  <StyledTableRow key={index}>
                    <StyledBodyCell>{record.date}</StyledBodyCell>
                    <StyledBodyCell>{record.time}</StyledBodyCell>
                    <StyledBodyCell>{record.studentRegNo}</StyledBodyCell>
                    <StyledBodyCell>{record.location.join(', ')}</StyledBodyCell>
                    <ButtonCell>
                      {/* "Accept" Button */}
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleAccept(record)}
                      >
                        Accept
                      </Button>
                      {/* "Delete" Button */}
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
