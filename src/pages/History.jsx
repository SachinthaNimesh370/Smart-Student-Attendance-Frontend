import React, { useEffect, useState, useRef } from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Collapse, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';

// Styled header cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: '#120b4f',
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '8px', // Reduced padding
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
}));

// Styled body cell
const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',
  padding: '4px', // Reduced padding for body cells
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
  height: '36px', // Reduced height to remove extra space
  padding: 0, // Remove padding between rows
  margin: 0, // Remove margin between rows
}));

function History() {
  const [historyData, setHistoryData] = useState([]); // State to hold fetched history data
  const [open, setOpen] = useState(null); // Track which row is expanded
  const columnWidths = useRef({}); // Ref to hold the widths of each column

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

  const handleRowClick = (index) => {
    setOpen(open === index ? null : index); // Toggle the clicked row's open state
  };

  // Capture the width of each main table column
  const setColumnWidth = (columnIndex, element) => {
    if (element) {
      columnWidths.current[columnIndex] = element.offsetWidth;
    }
  };

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
                <StyledTableCell ref={el => setColumnWidth(0, el)}>Student Reg No</StyledTableCell>
                <StyledTableCell ref={el => setColumnWidth(1, el)}>Date</StyledTableCell>
                <StyledTableCell ref={el => setColumnWidth(2, el)}>Time</StyledTableCell>
                <StyledTableCell ref={el => setColumnWidth(3, el)}>Location</StyledTableCell>
                <StyledTableCell ref={el => setColumnWidth(4, el)}></StyledTableCell> {/* Column for expand/collapse icon */}
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((record, index) => {
                const hasHistoryData = record.history && record.history.length > 0;
                const firstHistory = hasHistoryData ? record.history[0] : { date: '0', time: '0', location: '0' };

                return (
                  <React.Fragment key={index}>
                    {/* Main row */}
                    <StyledTableRow onClick={() => handleRowClick(index)}>
                      <StyledBodyCell>{record.studentRegNo}</StyledBodyCell>
                      <StyledBodyCell>{firstHistory.date}</StyledBodyCell>
                      <StyledBodyCell>{firstHistory.time}</StyledBodyCell>
                      <StyledBodyCell>{firstHistory.location}</StyledBodyCell>
                      <StyledBodyCell>
                        <IconButton size="small">
                          {open === index ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </StyledBodyCell>
                    </StyledTableRow>

                    {/* Expanded rows without header */}
                    <StyledTableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }} colSpan={5}>
                        <Collapse in={open === index} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 0 }}>
                            <Table size="small" aria-label="additional-data">
                              <TableBody>
                                {hasHistoryData ? 
                                  record.history.slice(1).map((attendance, historyIndex) => (
                                    <StyledTableRow key={`${index}-${historyIndex}`}>
                                      <StyledBodyCell style={{ width: columnWidths.current[0] }}>{record.studentRegNo}</StyledBodyCell>
                                      <StyledBodyCell style={{ width: columnWidths.current[1] }}>{attendance.date}</StyledBodyCell>
                                      <StyledBodyCell style={{ width: columnWidths.current[2] }}>{attendance.time}</StyledBodyCell>
                                      <StyledBodyCell style={{ width: columnWidths.current[3] }}>{attendance.location}</StyledBodyCell>
                                      <StyledBodyCell style={{ width: columnWidths.current[4] }}></StyledBodyCell> {/* Empty cell for alignment */}
                                    </StyledTableRow>
                                  )) 
                                  : 
                                  <StyledTableRow>
                                    <StyledBodyCell colSpan={5}>No additional history available</StyledBodyCell>
                                  </StyledTableRow>
                                }
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </StyledTableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default History;
