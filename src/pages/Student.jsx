import React from 'react'
import Sidenav from '../Sidenav'
import Box from '@mui/material/Box';
import axios from 'axios';
import { useEffect } from 'react';

const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/v1/student/getAllStudent"); // Update with your backend URL
      console.log("Student Data:", response.data);
      // You can set this data into your React state here, for example:
      // setStudents(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };
  
  
function Student() {
    useEffect(() => {
        fetchStudents();
      }, []);
  return (
    <>
        <Sidenav/>
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3,paddingLeft:27 }}>
            <h1>Student</h1>
        </Box>
    </>
    
  )
}

export default Student