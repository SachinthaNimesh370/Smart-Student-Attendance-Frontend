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
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 200;

export default function Sidenav() {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
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
        <Toolbar />
        <Divider />
            <List>
                <ListItem  disablePadding onClick={()=>{navigate("/")}}>
                    <ListItemButton>
                        <ListItemIcon>
                        <InboxIcon /> 
                        </ListItemIcon>
                        
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>

                <ListItem  disablePadding onClick={()=>{navigate("/attendance")}} >
                    <ListItemButton>
                        <ListItemIcon>
                        <InboxIcon /> 
                        </ListItemIcon>
                        
                        <ListItemText primary="Attendance" />
                    </ListItemButton>
                </ListItem>

                <ListItem  disablePadding onClick={()=>{navigate("/history")}}>
                    <ListItemButton>
                        <ListItemIcon>
                        <InboxIcon /> 
                        </ListItemIcon>
                        
                        <ListItemText primary="History" />
                    </ListItemButton>
                </ListItem>

                <ListItem  disablePadding onClick={()=>{navigate("/student")}}>
                    <ListItemButton>
                        <ListItemIcon>
                        <InboxIcon /> 
                        </ListItemIcon>
                        
                        <ListItemText primary="Student" />
                    </ListItemButton>
                </ListItem>
            </List>
        <Divider />
        
      </Drawer>
      
    </Box>
  );
}
