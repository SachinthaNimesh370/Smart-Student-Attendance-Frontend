import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { styled } from '@mui/material/styles';

// Custom styled components for the table headers
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: '#120b4f',
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '10px',
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

// Custom styled components for the body cells with conditional styling for status
const StyledBodyCell = styled(TableCell)(({ theme, status }) => ({
  fontSize: '14px',
  padding: '6px',
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  color: status === 'Inactive' ? 'red' : status === 'Active' ? 'green' : 'inherit', // Apply green color if status is Active
}));

function Student() {
  const [students, setStudents] = useState([]); // State to store all student data
  const [selectedStudent, setSelectedStudent] = useState({ // State for the selected student details
    studentRegNo: '',
    studentEmail: '',
    studentPassword: '',
    activestatus: false,
  });

  // Fetch all student data from the backend API
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/v1/controller/getAllStudent"); // API call to fetch students
      setStudents(response.data.data); // Set the retrieved student data
    } catch (error) {
      console.error("Error fetching student data:", error); // Log error if fetching fails
    }
  };

  // Fetch student data when the component loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle row click to select a student and populate their details in the form
  const handleRowClick = (student) => {
    setSelectedStudent(student); // Set the clicked student as the selected one
  };

  // Clear the selected student details from the form
  const handleClear = () => {
    setSelectedStudent({
      studentRegNo: '',
      studentEmail: '',
      studentPassword: '',
      activestatus: false,
    });
  };

  // Handle change for the 'Active Status' dropdown
  const handleStatusChange = (event) => {
    setSelectedStudent((prev) => ({ ...prev, activestatus: event.target.value === 'Active' })); // Update the active status
  };

  // Handle input change for text fields (studentRegNo, studentEmail, studentPassword)
  const handleInputChange = (event) => {
    const { name, value } = event.target; // Get input field name and value
    setSelectedStudent((prev) => ({ ...prev, [name]: value })); // Update the corresponding field in selectedStudent
  };

  // Update the selected student data via API call
  const handleUpdate = async () => {
    try {
      const response = await axios.put("http://localhost:8090/api/v1/controller/updateRegStudent", selectedStudent); // API call to update student
      console.log("Student updated successfully:", response.data.data);
      fetchStudents(); // Refresh the student list after the update
    } catch (error) {
      console.error("Error updating student data:", error); // Log error if updating fails
    }
  };

  // Delete the selected student via API call
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8090/api/v1/controller/deleteRegStudent/${selectedStudent.studentRegNo}`); // API call to delete student
      console.log("Student deleted successfully:", response.data.data);
      fetchStudents(); // Refresh the student list after deletion
      handleClear(); // Clear the form after student is deleted
    } catch (error) {
      console.error("Error deleting student data:", error); // Log error if deletion fails
    }
  };

  return (
    <>
      <Sidenav /> {/* Sidenav component rendering */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30, display: 'flex', justifyContent: 'space-between' }}>
        {/* Table on the left side for displaying student data */}
        <Box sx={{ flex: 1, marginRight: 4 }}>
          <Typography  sx={{  fontWeight: 600, fontSize: 40, color: '#120b4f' }}>
              Student Data
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 1, maxHeight: 600, overflowY: 'auto' }}>
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
                {students.map((student) => (
                  <StyledTableRow key={student.studentRegNo} onClick={() => handleRowClick(student)}>
                    <StyledBodyCell>{student.studentRegNo}</StyledBodyCell>
                    <StyledBodyCell>{student.studentEmail}</StyledBodyCell>
                    <StyledBodyCell>{student.studentPassword}</StyledBodyCell>
                    <StyledBodyCell status={student.activestatus ? 'Active' : 'Inactive'}>
                      {student.activestatus ? "Active" : "Inactive"}
                    </StyledBodyCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Text fields and buttons on the right side for form inputs */}
        <Box sx={{ width: 250, paddingTop: 8 }}>
          <Typography sx={{fontSize:22,fontWeight:500,color: '#120b4f',marginBottom:5 }} gutterBottom>
            Selected Student Details
          </Typography>
          <TextField
            label="Student Reg No"
            variant="outlined"
            fullWidth
            name="studentRegNo" // Set the input field name
            value={selectedStudent.studentRegNo} // Bind to the selectedStudent state
            onChange={handleInputChange} // Handle input change
            sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '14px', height: '28px' } }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="studentEmail" // Set the input field name
            value={selectedStudent.studentEmail} // Bind to the selectedStudent state
            onChange={handleInputChange} // Handle input change
            sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '14px', height: '28px' } }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            name="studentPassword" // Set the input field name
            value={selectedStudent.studentPassword} // Bind to the selectedStudent state
            onChange={handleInputChange} // Handle input change
            sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '14px', height: '28px' } }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Active Status</InputLabel>
            <Select
              value={selectedStudent.activestatus ? 'Active' : 'Inactive'} // Bind dropdown to activestatus
              onChange={handleStatusChange} // Handle status change
              label="Active Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          {/* Buttons below the text fields */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="outlined" onClick={handleClear}>
              Clear
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Student;
