import Sidenav from '../Sidenav'
import Box from '@mui/material/Box';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

// Custom styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '12px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

function Student() {
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        try {
          const response = await axios.get("http://localhost:8090/api/v1/student/getAllStudent");
          setStudents(response.data);  
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
      <>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 27 }}>
              <Typography variant="h4" gutterBottom>
                  Student Data
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 3,}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Student Reg No</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Password</StyledTableCell>
                      <StyledTableCell>Active Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student, index) => (
                      <StyledTableRow key={index}>
                        <TableCell>{student.studentRegNo}</TableCell>
                        <TableCell>{student.studentEmail}</TableCell>
                        <TableCell>{student.studentPassword}</TableCell>
                        <TableCell>{student.activestatus ? "Active" : "Inactive"}</TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          </Box>
      </>
    );
}

export default Student;
