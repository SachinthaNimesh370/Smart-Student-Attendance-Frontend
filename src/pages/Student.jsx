import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { styled } from '@mui/material/styles';

// Custom styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '10px',
  borderRight: `1px solid ${theme.palette.divider}`,
}));

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

const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',
  padding: '6px',
  borderRight: `1px solid ${theme.palette.divider}`,
}));

function Student() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({
    studentRegNo: '',
    studentEmail: '',
    studentPassword: '',
    activestatus: false
  });

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

  const handleRowClick = (student) => {
    setSelectedStudent(student);
  };

  const handleClear = () => {
    setSelectedStudent({
      studentRegNo: '',
      studentEmail: '',
      studentPassword: '',
      activestatus: false
    });
  };

  const handleStatusChange = (event) => {
    setSelectedStudent((prev) => ({ ...prev, activestatus: event.target.value === 'Active' }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put("http://localhost:8090/api/v1/student/updateRegStudent", selectedStudent);
      console.log("Student updated successfully:", response.data);
      fetchStudents(); // Refresh the student list after the update
    } catch (error) {
      console.error("Error updating student data:", error);
    }
  };

  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 27, display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Table on the left side */}
        <Box sx={{ flex: 1, marginRight: 4 }}>
          <Typography variant="h4" gutterBottom>
            Student Data
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
                  <StyledTableCell>Student Reg No</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Password</StyledTableCell>
                  <StyledTableCell>Active Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <StyledTableRow key={index} onClick={() => handleRowClick(student)}>
                    <StyledBodyCell>{student.studentRegNo}</StyledBodyCell>
                    <StyledBodyCell>{student.studentEmail}</StyledBodyCell>
                    <StyledBodyCell>{student.studentPassword}</StyledBodyCell>
                    <StyledBodyCell>{student.activestatus ? "Active" : "Inactive"}</StyledBodyCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Text fields and buttons on the right side */}
        <Box sx={{ width: 250, paddingTop: 5 }}>
          <Typography variant="h6" gutterBottom>
            Selected Student Details
          </Typography>
          <TextField
            label="Student Reg No"
            variant="outlined"
            fullWidth
            name="studentRegNo"
            value={selectedStudent.studentRegNo}
            onChange={handleInputChange}
            sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '14px', height: '28px' } }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="studentEmail"
            value={selectedStudent.studentEmail}
            onChange={handleInputChange}
            sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '14px', height: '28px' } }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            name="studentPassword"
            value={selectedStudent.studentPassword}
            onChange={handleInputChange}
            sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '14px', height: '28px' } }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Active Status</InputLabel>
            <Select
              value={selectedStudent.activestatus ? 'Active' : 'Inactive'}
              onChange={handleStatusChange}
              label="Active Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          {/* Buttons below the text fields */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
            <Button variant="contained" color="secondary" onClick={() => console.log("Delete clicked")}>Delete</Button>
            <Button variant="outlined" onClick={handleClear}>Clear</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Student;
