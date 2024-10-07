import React from 'react'
import Sidenav from '../Sidenav'
import { Box, Typography } from '@mui/material'

function Notification() {
  return (
    <>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30, display: 'flex', justifyContent: 'space-between' }}>
        {/* Table on the left side for displaying student data */}
            <Box sx={{ flex: 1, marginRight: 4 }}>
                <Typography  sx={{  fontWeight: 600, fontSize: 40, color: '#120b4f' }}>
                    Notification
                </Typography>
                
            </Box>
            
        </Box>

    </>
  )
}

export default Notification