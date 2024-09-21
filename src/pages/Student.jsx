import React from 'react'
import Sidenav from '../Sidenav'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

function Student() {
  return (
    <>
        <Sidenav/>
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3,paddingLeft:27 }}>
            <h1>Student</h1>
        </Box>
    </>
    
  )
}

export default Student