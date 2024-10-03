import React, { useEffect, useState } from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';
import axios from 'axios';

// Sample data for the graph
const sampleData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
];

// Custom XAxis wrapper
const CustomXAxis = (props) => {
  return <XAxis {...props} dataKey={props.dataKey || 'name'} />;
};

// Custom YAxis wrapper
const CustomYAxis = (props) => {
  return <YAxis {...props} />;
};

function Dashboard() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [nonActiveStudents, setNonActiveStudents] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8090/api/v1/student/getAllStudent')
      .then(response => {
        const students = response.data.data;

        // Debug: log the response to check the data format
        console.log('API Response:', students);

        // Count the total number of students
        const total = students.length;

        // Count active and non-active students based on activestatus
        const active = students.filter(student => student.activestatus).length; // Check for true
        const nonActive = students.filter(student => !student.activestatus).length; // Check for false

        // Update the state
        setTotalStudents(total);
        setActiveStudents(active);
        setNonActiveStudents(nonActive);
      })
      .catch(error => {
        console.error("There was an error fetching the student data!", error);
      });
  }, []);

  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 27 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          {/* Card 1: Total Attendance */}
          <Paper sx={{ padding: 2, flex: 1, marginRight: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6">Total Attendance</Typography>
            <Typography variant="h4" sx={{ color: '#3f51b5' }}>
              <CountUp start={0} end={1500} duration={2} />
            </Typography>
          </Paper>

          {/* Card 2: Total Students */}
          <Paper sx={{ padding: 2, flex: 1, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h4" sx={{ color: '#3f51b5' }}>
              <CountUp start={0} end={totalStudents} duration={2} />
            </Typography>
          </Paper>

          {/* Card 3: Active Students */}
          <Paper sx={{ padding: 2, flex: 1, marginLeft: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6">Active Students</Typography>
            <Typography variant="h4" sx={{ color: '#4caf50' }}>
              <CountUp start={0} end={activeStudents} duration={2} />
            </Typography>
          </Paper>

          {/* Card 4: Non-Active Students */}
          <Paper sx={{ padding: 2, flex: 1, marginLeft: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6">Non-Active Students</Typography>
            <Typography variant="h4" sx={{ color: '#f44336' }}>
              <CountUp start={0} end={nonActiveStudents} duration={2} />
            </Typography>
          </Paper>
        </Box>

        {/* Graph Section */}
        <Paper sx={{ padding: 2, bgcolor: '#fff', boxShadow: 3 }}>
          <Typography variant="h5" gutterBottom>
            Attendance Trend
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <CustomXAxis />
              <CustomYAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3f51b5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </>
  );
}

export default Dashboard;