import React, { useEffect, useState } from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';

function Attendance() {
    const [attendanceData, setAttendanceData] = useState([]);

    // Fetch the data from backend
    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get("http://localhost:8090/api/v1/student/getAllAttendance"); // Adjust the URL based on your API
            setAttendanceData(response.data);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        }
    };

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    return (
        <>
            <Sidenav />
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 27 }}>
                <Typography variant="h4" gutterBottom>
                    Attendance
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student Reg No</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Attendance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attendanceData.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell>{record.studentRegNo}</TableCell>
                                    <TableCell>{record.date}</TableCell>
                                    <TableCell>{record.time}</TableCell>
                                    <TableCell>{record.location.join(', ')}</TableCell> {/* Join location array into a string */}
                                    <TableCell>{record.attendance ? 'Present' : 'Absent'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}

export default Attendance;
