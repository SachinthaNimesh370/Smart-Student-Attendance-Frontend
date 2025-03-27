import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import FaceIcon from '@mui/icons-material/Face'; // Import FaceIcon
import Avatar from '@mui/material/Avatar';
import SchoolIcon from '@mui/icons-material/School';
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Logout icon
import SummarizeIcon from '@mui/icons-material/Summarize'; // New Summery Icon
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';


const drawerWidth = 225;

export default function Sidenav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Define the routes and their corresponding labels and icons
  const navItems = [
    { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/student", label: "Student", icon: <PeopleIcon /> },
    { path: "/attendance", label: "Attendance", icon: <CheckCircleIcon /> },
    { path: "/summery", label: "Summery", icon: <SummarizeIcon /> }, // Updated Icon
    { path: "/history", label: "History", icon: <HistoryIcon /> },
     { path: "/face_recognize", label: "FaceRecognize", icon: <FaceIcon /> },
    { path: "/notification", label: "Notification", icon: <NotificationsIcon /> },
    { path: "/lecturehalls", label: "LectureHalls", icon: <MeetingRoomIcon /> },
  ];

  // Handle Logout click
  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens, redirecting)
    console.log("User logged out");
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        {/* You can add additional AppBar elements here if needed */}
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{alignContent: 'center',paddingLeft:11,bgcolor: 'primary.main',paddingTop:2, }}>
          <Avatar sx={{ mr: 1,alignItems: 'center', }}>
            <SchoolIcon />
          </Avatar>
        </Box>
        
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center' }}>
          <Typography fontSize={18} noWrap sx={{ mr: 1 ,paddingLeft:2}}>
            Student Attendance 
          </Typography>
        </Box>

        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding onClick={() => navigate(item.path)}>
              <ListItemButton selected={location.pathname === item.path}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />

        {/* Logout button positioned at the bottom */}
        <Box sx={{ mt: 'auto' }}>
          <List>
            <ListItem disablePadding onClick={handleLogout}>
              <ListItemButton>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
