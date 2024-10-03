import React, { useEffect, useState } from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart } from '@mui/x-charts/BarChart';
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

  const [uData, setUData] = useState([]);
  const [pData, setPData] = useState([]);
  const [xLabels, setXLabels] = useState([]);

  useEffect(() => {
    // Fetching student data
    axios.get('http://localhost:8090/api/v1/student/getAllStudent')
      .then(response => {
        const students = response.data.data;
        const total = students.length;
        const active = students.filter(student => student.activestatus).length;
        const nonActive = students.filter(student => !student.activestatus).length;
        
        setTotalStudents(total);
        setActiveStudents(active);
        setNonActiveStudents(nonActive);
      })
      .catch(error => {
        console.error("Error fetching student data", error);
      });

    // Fetching attendance data
    axios.get('http://localhost:8090/api/v1/student/dayByDayCounts')
      .then(response => {
        const data = response.data.data;
        setAttendanceData(data);

        const totalPresentCount = data.reduce((acc, curr) => acc + curr.presentCount, 0);
        const totalCount = data.reduce((acc, curr) => acc + curr.totalCount, 0);

        const percentage = (totalPresentCount / totalCount) * 100;
        setAttendancePercentage(percentage.toFixed(2));

        if (data.length > 0) {
          const lastEntry = data[data.length - 1];
          const lastPercentage = (lastEntry.presentCount / lastEntry.totalCount) * 100;
          setFirstDataPercentage(lastPercentage.toFixed(2));
          setFirstDataTitle(`${lastEntry.columnName} Attendance Percentage`);

          // For BarChart Data
          setXLabels(data.map(d => d.columnName));
          setPData(data.map(d => d.presentCount));
          setUData(data.map(d => d.absentCount));
        }
      })
      .catch(error => {
        console.error("Error fetching attendance data", error);
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
            bgcolor: '#e3f2fd', 
            border: '2px solid #2196f3', 
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
            bgcolor: '#fff0f5', 
            border: '2px solid #ff85af', 
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
            bgcolor: '#e8f5e9', 
            border: '2px solid #4caf50', 
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
            bgcolor: '#ffebee', 
            border: '2px solid #f44336', 
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
            bgcolor: '#ffeb3b', 
            border: '2px solid #fbc02d', 
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
            bgcolor: '#c8e6c9', 
            border: '2px solid #66bb6a', 
            borderRadius: 2,
          }}>
            <Typography variant="h6">{firstDataTitle}</Typography>
            <Typography variant="h4" sx={{ color: '#66bb6a' }}>
              <CountUp start={0} end={firstDataPercentage} duration={2} suffix="%" />
            </Typography>
          </Paper>
        </Box>


        {/* Bar Chart for Attendance Overview */}
        
        <Box sx={{ mt: 4, p: 2, 
                                bgcolor: '#fff',  // Optional: to give a background to the box
                                borderRadius: 2,  // Optional: to round the corners
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'  // Adding shadow
        }}>
          <Typography variant="h6" gutterBottom>
            Attendance Overview 
          </Typography>
          <BarChart
            width={500}
            height={300}
            series={[
              { data: pData, label: 'Present Count', id: 'pvId' },
              { data: uData, label: 'Absent Count', id: 'uvId' },
            ]}
            xAxis={[{ data: xLabels, scaleType: 'band' }]}
          />
        </Box>
        
      </Box>
    </>
  );
}

export default Dashboard;
