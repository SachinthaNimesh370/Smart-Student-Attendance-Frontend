import React, { useEffect, useState } from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';
import axios from 'axios';

function Dashboard() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [nonActiveStudents, setNonActiveStudents] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [firstDataPercentage, setFirstDataPercentage] = useState(0);
  const [firstDataTitle, setFirstDataTitle] = useState("");

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
    const data = response.data;

    // Update the attendance data state
    setAttendanceData(data); // Assuming the response format is correct

    // Calculate total present count and total count
    const totalPresentCount = data.reduce((acc, curr) => acc + curr.presentCount, 0);
    const totalCount = data.reduce((acc, curr) => acc + curr.totalCount, 0);

    // Calculate overall attendance percentage
    const percentage = (totalPresentCount / totalCount) * 100;
    setAttendancePercentage(percentage.toFixed(2)); // Round to two decimal places

    // Calculate percentage for the last entry in the attendance data
    if (data.length > 0) {
      const lastEntry = data[data.length - 1];  // Get the last element in the array
      const lastPercentage = (lastEntry.presentCount / lastEntry.totalCount) * 100;
      setFirstDataPercentage(lastPercentage.toFixed(2)); // Update the percentage state
      setFirstDataTitle(`${lastEntry.columnName} Attendance Percentage`); // Update the title to reflect the last column
    }
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

          {/* Card 5: Total Attendance Percentage */}
          <Paper sx={{ 
            padding: 2, 
            flex: 1, 
            marginLeft: 2, 
            bgcolor: '#ffeb3b', // Light Yellow
            border: '2px solid #fbc02d', // Yellow border
            borderRadius: 2,
          }}>
            <Typography variant="h6">Total Attendance Percentage</Typography>
            <Typography variant="h4" sx={{ color: '#fbc02d' }}>
              <CountUp start={0} end={attendancePercentage} duration={2} suffix="%" />
            </Typography>
          </Paper>

          {/* Card 6: First Entry Attendance Percentage */}
          <Paper sx={{ 
            padding: 2, 
            flex: 1, 
            marginLeft: 2, 
            bgcolor: '#c8e6c9', // Light Green
            border: '2px solid #66bb6a', // Green border
            borderRadius: 2,
          }}>
            <Typography variant="h6">{firstDataTitle}</Typography>
            <Typography variant="h4" sx={{ color: '#66bb6a' }}>
              <CountUp start={0} end={firstDataPercentage} duration={2} suffix="%" />
            </Typography>
          </Paper>
        </Box>

        {/* Line Chart for Attendance */}
        <Box sx={{ mt: 4, height: 300 }}>
          <Typography variant="h6" gutterBottom>
            Day-by-Day Attendance
          </Typography>
          <ResponsiveContainer>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="columnName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="presentCount" stroke="#4caf50" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="absentCount" stroke="#f44336" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
