import React, { useEffect, useState } from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: '#120b4f',
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '10px',
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',
  padding: '6px',
  borderRight: `1px solid ${theme.palette.divider}`,
}));

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

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);

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
    fetchAttendanceData();
  }, []);

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

      // Send POST request to accept attendance
      const response = await axios.post('http://localhost:8090/api/v1/student/acceptedAttendance', requestBody);
      alert(response.data); // Show the success message from the backend
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
            sx={{ 
              boxShadow: 3, 
              borderRadius: 1, 
              maxHeight: 600, 
              overflowY: 'auto'
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Time</StyledTableCell>
                  <StyledTableCell>Student Reg No</StyledTableCell>                
                  <StyledTableCell>Location</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell> {/* Column for action buttons */}
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((record, index) => (
                  <StyledTableRow key={index}>
                    <StyledBodyCell>{record.date}</StyledBodyCell>
                    <StyledBodyCell>{record.time}</StyledBodyCell>
                    <StyledBodyCell>{record.studentRegNo}</StyledBodyCell>
                    <StyledBodyCell>{record.location.join(', ')}</StyledBodyCell>
                    <StyledBodyCell>
                      {/* "Accept" Button */}
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleAccept(record)}
                        style={{ marginRight: 8 }} // Space between buttons
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
                    </StyledBodyCell>
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
