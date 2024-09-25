import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { styled } from '@mui/material/styles';

// Custom styled components for the table headers
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,  // Light color for the header
  color: '#120b4f',  // Text color for the headers
  fontWeight: 'bold',  // Bold text for emphasis
  fontSize: '16px',  // Font size for header text
  padding: '10px',  // Padding for table cells
  borderRight: `1px solid ${theme.palette.divider}`,  // Border between table cells
  textAlign: 'center',  // Center-align text in table headers
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

// Custom styled components for the body cells
const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',  // Font size for table body
  padding: '6px',  // Padding for the table cells
  borderRight: `1px solid ${theme.palette.divider}`,  // Border between table cells
  textAlign: 'center',  // Center-align text in the table body
}));

function Student() {
  const [students, setStudents] = useState([]);  // State to store all student data
  const [selectedStudent, setSelectedStudent] = useState({  // State for the selected student details
    studentRegNo: '',
    studentEmail: '',
    studentPassword: '',
    activestatus: false
  });

  // Fetch all student data from the backend API
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/v1/student/getAllStudent");  // API call to fetch students
      setStudents(response.data);  // Set the retrieved student data
    } catch (error) {
      console.error("Error fetching student data:", error);  // Log error if fetching fails
    }
  };

  // Fetch student data when the component loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle row click to select a student and populate their details in the form
  const handleRowClick = (student) => {
    setSelectedStudent(student);  // Set the clicked student as the selected one
  };

  // Clear the selected student details from the form
  const handleClear = () => {
    setSelectedStudent({
      studentRegNo: '',
      studentEmail: '',
      studentPassword: '',
      activestatus: false
    });
  };

  // Handle change for the 'Active Status' dropdown
  const handleStatusChange = (event) => {
    setSelectedStudent((prev) => ({ ...prev, activestatus: event.target.value === 'Active' }));  // Update the active status
  };

  // Handle input change for text fields (studentRegNo, studentEmail, studentPassword)
  const handleInputChange = (event) => {
    const { name, value } = event.target;  // Get input field name and value
    setSelectedStudent((prev) => ({ ...prev, [name]: value }));  // Update the corresponding field in selectedStudent
  };

  // Update the selected student data via API call
  const handleUpdate = async () => {
    try {
      const response = await axios.put("http://localhost:8090/api/v1/student/updateRegStudent", selectedStudent);  // API call to update student
      console.log("Student updated successfully:", response.data);
      fetchStudents();  // Refresh the student list after the update
    } catch (error) {
      console.error("Error updating student data:", error);  // Log error if updating fails
    }
  };

  // Delete the selected student via API call
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8090/api/v1/student/deleteRegStudent/${selectedStudent.studentRegNo}`);  // API call to delete student
      console.log("Student deleted successfully:", response.data);
      fetchStudents();  // Refresh the student list after deletion
      handleClear();  // Clear the form after student is deleted
    } catch (error) {
      console.error("Error deleting student data:", error);  // Log error if deletion fails
    }
  };

  return (
    <>
      <Sidenav />  {/* Sidenav component rendering */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30, display: 'flex', justifyContent: 'space-between', paddingTop:5 }}>
        
        {/* Table on the left side for displaying student data */}
        <Box sx={{ flex: 1, marginRight: 4 }}>
          <Typography gutterBottom sx={{ textAlign: 'center', fontWeight: 600, fontSize: 40, color: '#120b4f' }}>
            Student Data
          </Typography>
          <TableContainer 
            component={Paper} 
            sx={{ 
              boxShadow: 3, 
              borderRadius: 1, 
              maxHeight: 600,  // Limit table height and enable scrolling
              overflowY: 'auto'
            }}
          >
            <Table stickyHeader>  {/* Sticky header to keep table header visible during scroll */}
              <TableHead>
                <TableRow>
                  <StyledTableCell>Student Reg No</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Password</StyledTableCell>
                  <StyledTableCell>Active Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (  // Map over student data and create table rows
                  <StyledTableRow key={index} onClick={() => handleRowClick(student)}>  {/* Handle row click to select student */}
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

        {/* Text fields and buttons on the right side for form inputs */}
        <Box sx={{ width: 250, paddingTop: 5 }}>
          <Typography variant="h6" gutterBottom>
            Selected Student Details
          </Typography>
          <TextField
            label="Student Reg No"
            variant="outlined"
            fullWidth
            name="studentRegNo"  // Set the input field name
            value={selectedStudent.studentRegNo}  // Bind to the selectedStudent state
            onChange={handleInputChange}  // Handle input change
            sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '14px', height: '28px' } }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="studentEmail"  // Set the input field name
            value={selectedStudent.studentEmail}  // Bind to the selectedStudent state
            onChange={handleInputChange}  // Handle input change
            sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '14px', height: '28px' } }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            name="studentPassword"  // Set the input field name
            value={selectedStudent.studentPassword}  // Bind to the selectedStudent state
            onChange={handleInputChange}  // Handle input change
            sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '14px', height: '28px' } }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Active Status</InputLabel>
            <Select
              value={selectedStudent.activestatus ? 'Active' : 'Inactive'}  // Bind dropdown to activestatus
              onChange={handleStatusChange}  // Handle status change
              label="Active Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          {/* Buttons below the text fields */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>  {/* Button to update student data */}
            <Button variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>  {/* Button to delete student */}
            <Button variant="outlined" onClick={handleClear}>Clear</Button>  {/* Button to clear the form */}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Student;
