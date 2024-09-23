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
      // Convert the date from dd/MM/yyyy to yyyy-MM-dd
      const [day, month, year] = date.split('/'); // Split the date string
      const formattedDate = `${year}-${month}-${day}`; // Reformat to yyyy-MM-dd
  
      // Send the formatted date to the backend
      await axios.delete(`http://localhost:8090/api/v1/student/deleteAttendance/${studentRegNo}/${formattedDate}`);
      
      // Refresh data after deletion
      fetchAttendanceData();
      alert("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting attendance:", error);
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
                  <StyledTableCell>Action</StyledTableCell> {/* Column for delete button */}
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
                      {/* Pass studentRegNo and date to handleDelete */}
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
