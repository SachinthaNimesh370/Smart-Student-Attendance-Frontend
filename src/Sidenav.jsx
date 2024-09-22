import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
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
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle'; // For user account info
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 200;

export default function Sidenav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/attendance", label: "Attendance", icon: <CheckCircleIcon /> },
    { path: "/history", label: "History", icon: <HistoryIcon /> },
    { path: "/student", label: "Student", icon: <PeopleIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Student Attendance System
          </Typography>
          <IconButton color="inherit">
            <AccountCircle />
            <Typography sx={{ ml: 1 }}>Admin</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper', // Neutral color
            color: 'text.primary', // Text color adapted to neutral background
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" noWrap>
            Welcome, Admin!
          </Typography>
        </Box>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding onClick={() => navigate(item.path)}>
              <ListItemButton
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': { backgroundColor: 'secondary.main', color: 'white' },
                  '&:hover': { backgroundColor: 'primary.main', color: 'white' },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography variant="caption" sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
          © 2024 Student Attendance System
        </Typography>
      </Drawer>
    </Box>
  );
}
