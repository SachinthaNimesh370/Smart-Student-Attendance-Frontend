import React from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for the graph (placeholder data)
const sampleData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
];

function Dashboard() {
  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 27 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          {/* Card 1 */}
          <Paper sx={{ padding: 2, flex: 1, marginRight: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6">Total Attendance</Typography>
            <Typography variant="h4" sx={{ color: '#3f51b5' }}>1500</Typography>
          </Paper>

          {/* Card 2 */}
          <Paper sx={{ padding: 2, flex: 1, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h4" sx={{ color: '#3f51b5' }}>200</Typography>
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
              <XAxis dataKey="name" />
              <YAxis />
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
