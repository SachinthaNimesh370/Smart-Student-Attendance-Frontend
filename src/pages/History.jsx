import React, { useEffect, useState, useRef } from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Collapse, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';

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

// Custom styled components for the table rows
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer',
  },
  height: '36px',
  padding: 0,
  margin: 0,
}));

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [open, setOpen] = useState(null);
  const columnWidths = useRef({});

  const fetchHistoryData = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/v1/controller/getAllAcceptAttendance");
      setHistoryData(response.data.data);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleRowClick = (index) => {
    setOpen(open === index ? null : index);
  };

  const setColumnWidth = (columnIndex, element) => {
    if (element) {
      columnWidths.current[columnIndex] = element.offsetWidth;
    }
  };

  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30 }}>
        <Typography  sx={{  fontWeight: 600, fontSize: 40, color: '#120b4f' }}>
          History
        </Typography>
        
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 1, maxHeight: 600, overflowY: 'auto',  }}>
          <Table stickyHeader >
            <TableHead>
              <TableRow>
                <StyledTableCell ref={el => setColumnWidth(0, el)}>Student Reg No</StyledTableCell>
                <StyledTableCell ref={el => setColumnWidth(1, el)}>Date</StyledTableCell>
                <StyledTableCell ref={el => setColumnWidth(2, el)}>Time</StyledTableCell>
                <StyledTableCell ref={el => setColumnWidth(3, el)}>Location</StyledTableCell>
                <StyledTableCell ref={el => setColumnWidth(4, el)}></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((record, index) => {
                const hasHistoryData = record.history && record.history.length > 0;
                const firstHistory = hasHistoryData ? record.history[0] : { date: '0', time: '0', location: '0' };

                return (
                  <React.Fragment key={index}>
                    <StyledTableRow onClick={() => handleRowClick(index)}>
                      <StyledBodyCell>{record.studentRegNo}</StyledBodyCell>
                      <StyledBodyCell>{firstHistory.date}</StyledBodyCell>
                      <StyledBodyCell>{firstHistory.time}</StyledBodyCell>
                      <StyledBodyCell>
                        {Array.isArray(firstHistory.location) 
                          ? `${firstHistory.location[0]}, ${firstHistory.location[1]}` 
                          : firstHistory.location}
                      </StyledBodyCell>
                      {/* <StyledBodyCell>
                        {(() => {
                          // Destructure lat and lon from the location array
                          if (Array.isArray(firstHistory.location)) {
                            const [lat, lon] = firstHistory.location;

                            // Format lat and lon to three decimal places
                            const formattedLat = parseFloat(lat).toFixed(3);
                            const formattedLon = parseFloat(lon).toFixed(3);

                            console.log(formattedLat, formattedLon);

                            // Check formatted coordinates and return corresponding location name
                            if (formattedLat === '9.332' && formattedLon === '80.414') {
                              return 'Lecture Hall 01';
                            } else if (formattedLat === '9.333' && formattedLon === '80.414') {
                              return 'Lecture Hall 02';
                            } else {
                              return 'Fake Attendance';
                            }
                          } else {
                            // Handle case where location is not an array
                            return 'Invalid Location';
                          }
                        })()}
                      </StyledBodyCell> */}
                      


                      <StyledBodyCell>
                        <IconButton size="small">
                          {open === index ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </StyledBodyCell>
                    </StyledTableRow>

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
                                      <StyledBodyCell style={{ width: columnWidths.current[3] }}>
                                        {Array.isArray(attendance.location) 
                                          ? `${attendance.location[0]}, ${attendance.location[1]}` 
                                          : attendance.location}
                                      </StyledBodyCell>
                                      <StyledBodyCell style={{ width: columnWidths.current[4] }}></StyledBodyCell>
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
