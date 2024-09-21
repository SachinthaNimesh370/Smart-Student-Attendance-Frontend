import React from 'react'
import Sidenav from '../Sidenav'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

function Home() {
  return (
    <>
        <Sidenav/>
        <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3,paddingLeft:27 }}
        >
        <Toolbar />
        <h1>Home Page</h1>
        </Box>
        

    </>
    
  )
}

export default Home