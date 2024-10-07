import React, { useState, useEffect } from 'react';
import Sidenav from '../Sidenav';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import axios from 'axios'; // Use axios for API calls

function Notification() {
  const [notificationData, setNotificationData] = useState({
    id: null, // Store the ID of the notification for updating/deleting
    date: '',
    notification: ''
  });

  const [notifications, setNotifications] = useState([]);

  // Handle input change for creating/updating notification
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationData({ ...notificationData, [name]: value });
  };

  // Handle form submit to create notification
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (notificationData.id) {
      // If ID exists, it's an update
      try {
        const response = await axios.put('http://localhost:8090/api/v1/student/updateNotification', notificationData);
        alert(response.data); // Show success message returned by backend
      } catch (error) {
        console.error("Error updating notification", error);
      }
    } else {
      // Otherwise, it's a create
      try {
        const response = await axios.post('http://localhost:8090/api/v1/student/createNotification', notificationData);
        alert(response.data); // Show success message returned by backend
      } catch (error) {
        console.error("Error creating notification", error);
      }
    }

    // Clear the form after submission and refresh notifications
    clearForm();
    fetchNotifications();
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
    setNotificationData({ id: notif.id, date: notif.date, notification: notif.notification });
  };

  // Clear form fields
  const clearForm = () => {
    setNotificationData({ id: null, date: '', notification: '' });
  };

  // Handle delete notification
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await axios.delete(`http://localhost:8090/api/v1/student/deleteNotification/${id}`);
        alert('Notification deleted successfully');
        fetchNotifications(); // Refresh the list after deletion
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
