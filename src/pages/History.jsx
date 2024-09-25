import React, { useEffect, useState } from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

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

// Custom styled components for the table rows
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

function History() {
  const [historyData, setHistoryData] = useState([]); // State to hold fetched history data

  // Fetch history data from the backend
  const fetchHistoryData = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/v1/student/getAllAcceptAttendance");
      setHistoryData(response.data); // Set the fetched data to state
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  useEffect(() => {
    fetchHistoryData(); // Call the fetch function when the component mounts
  }, []);

  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 27 }}>
        <Typography gutterBottom sx={{ textAlign: 'center', fontWeight: 600, fontSize: 40, color: '#120b4f' }}>
          History
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 1, maxHeight: 600, overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Student Reg No</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Time</StyledTableCell>
                <StyledTableCell>Location</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((record, index) => (
                record.history.map((attendance, historyIndex) => (
                  <StyledTableRow key={`${index}-${historyIndex}`}>
                    <StyledBodyCell>{record.studentRegNo}</StyledBodyCell>
                    <StyledBodyCell>{attendance.date}</StyledBodyCell>
                    <StyledBodyCell>{attendance.time}</StyledBodyCell>
                    <StyledBodyCell>{attendance.location}</StyledBodyCell> {/* Adjust based on actual fields in StudentAttend */}
                  </StyledTableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default History;
