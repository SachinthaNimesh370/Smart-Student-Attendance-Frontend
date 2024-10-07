import React, { useState, useEffect } from 'react';
import Sidenav from '../Sidenav';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import axios from 'axios'; // Use axios for API calls

function Notification() {
  const [notificationData, setNotificationData] = useState({
    date: '',
    notification: ''
  });

  const [notifications, setNotifications] = useState([]);

  // Handle input change for creating notification
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationData({ ...notificationData, [name]: value });
  };

  // Handle form submit to create notification
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make POST request to the back end
      const response = await axios.post('http://localhost:8090/api/v1/student/createNotification', notificationData); // Update with your backend URL
      alert(response.data); // Show success message returned by backend
      setNotificationData({ date: '', notification: '' }); // Clear the form after submission
      fetchNotifications(); // Refresh the list of notifications after submission
    } catch (error) {
      console.error("Error creating notification", error);
    }
  };

  // Fetch all notifications from the back end
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8090/api/v1/student/getAllNotifications');
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  // Fetch notifications when the component loads
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle clicking on a notification card to set the form data
  const handleCardClick = (notif) => {
    setNotificationData({ date: notif.date, notification: notif.notification });
  };

  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30, display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Notification Form on the left-hand side */}
        <Box sx={{ flex: 1, marginRight: 4 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 40, color: '#120b4f' }}>
            Notification
          </Typography>

          {/* Notification Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              label="Date"
              name="date"
              value={notificationData.date}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Notification"
              name="notification"
              value={notificationData.notification}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Create Notification
            </Button>
          </Box>
        </Box>

        {/* Parent Card containing Notification Cards */}
        <Card sx={{ flex: 1, maxWidth: '50%', marginLeft: 'auto', marginTop: 13, maxHeight: 550, overflowY: 'auto' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {notifications.map((notif) => (
              <Card key={notif.id} sx={{ mb: 2 }} onClick={() => handleCardClick(notif)}> {/* Child card with click handler */}
                <CardContent>
                  <Typography variant="h6" component="div">
                    {notif.notification}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {notif.date}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
        
      </Box>
    </>
  );
}

export default Notification;
