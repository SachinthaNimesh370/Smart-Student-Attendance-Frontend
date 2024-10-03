import React, { useEffect, useState } from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Change here
import CountUp from 'react-countup';
import axios from 'axios';

function Dashboard() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [nonActiveStudents, setNonActiveStudents] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    // Fetching student data
    axios.get('http://localhost:8090/api/v1/student/getAllStudent')
      .then(response => {
        const students = response.data.data;

        // Count the total number of students
        const total = students.length;

        // Count active and non-active students based on activestatus
        const active = students.filter(student => student.activestatus).length;
        const nonActive = students.filter(student => !student.activestatus).length;

        // Update the state
        setTotalStudents(total);
        setActiveStudents(active);
        setNonActiveStudents(nonActive);
      })
      .catch(error => {
        console.error("There was an error fetching the student data!", error);
      });

    // Fetching attendance data
    axios.get('http://localhost:8090/api/v1/student/dayByDayCounts')
      .then(response => {
        // Update the attendance data state
        setAttendanceData(response.data); // Assuming the response format is correct
      })
      .catch(error => {
        console.error("There was an error fetching the attendance data!", error);
      });
  }, []);

  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          {/* Card 1: Total Attendance */}
          <Paper sx={{ 
            padding: 2, 
            flex: 1, 
            marginRight: 2, 
            bgcolor: '#e3f2fd', // Light Blue
            border: '2px solid #2196f3', // Blue border
            borderRadius: 2,
          }}>
            <Typography variant="h6">Total Attendance</Typography>
            <Typography variant="h4" sx={{ color: '#3f51b5' }}>
              <CountUp start={0} end={1500} duration={2} />
            </Typography>
          </Paper>

          {/* Card 2: Total Students */}
          <Paper sx={{ 
            padding: 2, 
            flex: 1, 
            bgcolor: '#fff0f5', // Light Pink
            border: '2px solid #ff85af', // Pink border
            borderRadius: 2,
          }}>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h4" sx={{ color: '#e91e63' }}>
              <CountUp start={0} end={totalStudents} duration={2} />
            </Typography>
          </Paper>

          {/* Card 3: Active Students */}
          <Paper sx={{ 
            padding: 2, 
            flex: 1, 
            marginLeft: 2, 
            bgcolor: '#e8f5e9', // Light Green
            border: '2px solid #4caf50', // Green border
            borderRadius: 2,
          }}>
            <Typography variant="h6">Active Students</Typography>
            <Typography variant="h4" sx={{ color: '#4caf50' }}>
              <CountUp start={0} end={activeStudents} duration={2} />
            </Typography>
          </Paper>

          {/* Card 4: Non-Active Students */}
          <Paper sx={{ 
            padding: 2, 
            flex: 1, 
            marginLeft: 2, 
            bgcolor: '#ffebee', // Light Red
            border: '2px solid #f44336', // Red border
            borderRadius: 2,
          }}>
            <Typography variant="h6">Non-Active Students</Typography>
            <Typography variant="h4" sx={{ color: '#f44336' }}>
              <CountUp start={0} end={nonActiveStudents} duration={2} />
            </Typography>
          </Paper>
        </Box>

        {/* Bar Chart for Attendance */}
        <Box sx={{ mt: 4, height: 300 }}>
          <Typography variant="h6" gutterBottom>
            Day-by-Day Attendance
          </Typography>
          <ResponsiveContainer>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="columnName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="presentCount" fill="#4caf50" />
              <Bar dataKey="absentCount" fill="#f44336" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
