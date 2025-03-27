import React, { useState, useEffect } from 'react';
import Sidenav from '../Sidenav';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import axios from 'axios';

function Notification() {
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get current time in HH:MM format
  const getCurrentTime = () => {
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [notificationData, setNotificationData] = useState({
    id: null, // ID for updating/deleting notifications
    date: getTodayDate(), // Default date
    time: getCurrentTime(), // Default time
    notification: '' // Notification content
  });

  const [notifications, setNotifications] = useState([]);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationData({ ...notificationData, [name]: value });
  };

  // Handle form submission for creating/updating notifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (notificationData.id) {
      // Update existing notification
      try {
        const response = await axios.put('http://localhost:8090/api/v1/controller/updateNotification', notificationData);
        alert(response.data.data); // Show success message
      } catch (error) {
        console.error("Error updating notification", error);
      }
    } else {
      // Create new notification
      try {
        const response = await axios.post('http://localhost:8090/api/v1/controller/createNotification', notificationData);
        alert(response.data.data); // Show success message
      } catch (error) {
        console.error("Error creating notification", error);
      }
    }

    // Clear the form and fetch updated notifications
    clearForm();
    fetchNotifications();
  };

  // Fetch all notifications from the back end
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8090/api/v1/controller/getAllNotifications');
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  // Fetch notifications when the component loads
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle clicking on a notification card to populate the form
  const handleCardClick = (notif) => {
    setNotificationData({ 
      id: notif.id, 
      date: notif.date, 
      time: notif.time, 
      notification: notif.notification 
    });
  };

  // Clear form fields
  const clearForm = () => {
    setNotificationData({ 
      id: null, 
      date: getTodayDate(), 
      time: getCurrentTime(), 
      notification: '' 
    });
  };

  // Handle delete notification
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await axios.delete(`http://localhost:8090/api/v1/controller/deleteNotification/${id}`);
        alert('Notification deleted successfully');
        fetchNotifications(); // Refresh notifications after deletion
      } catch (error) {
        console.error("Error deleting notification", error);
      }
    }
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
              type="date" // Separate input for date
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Time"
              name="time"
              value={notificationData.time}
              onChange={handleInputChange}
              type="time" // Separate input for time
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
              {notificationData.id ? "Update Notification" : "Create Notification"}
            </Button>
            <Button variant="outlined" color="secondary" onClick={clearForm} sx={{ mt: 2, ml: 2 }}>
              Clear
            </Button>
          </Box>
        </Box>

        {/* Notification Cards on the right-hand side */}
        <Card sx={{ flex: 1, maxWidth: '50%', marginLeft: 'auto', marginTop: 13, maxHeight: 550, overflowY: 'auto' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {notifications.map((notif) => (
              <Card key={notif.id} sx={{ mb: 2 }} onClick={() => handleCardClick(notif)}>
                <CardContent>
                  <Typography sx={{ fontSize: 16 }} component="div">
                    {notif.notification}
                  </Typography>
                  <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                    {notif.date} {notif.time}
                  </Typography>
                  <Button variant="outlined" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }} >
                    Delete
                  </Button>
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
