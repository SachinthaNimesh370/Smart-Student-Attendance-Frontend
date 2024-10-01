import React, { useState, useRef, useCallback } from 'react';
import Sidenav from '../Sidenav';
import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';
import Webcam from 'react-webcam'; // Install react-webcam using: npm install react-webcam
import axios from 'axios';

function FaceRecognize() {
  // State to store the captured image
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  // Function to capture the image from the webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc); // Set the captured image to state
  }, [webcamRef]);

  // Helper function to convert a base64 image string to a Blob
  const base64ToBlob = (base64Image) => {
    const byteString = atob(base64Image.split(',')[1]);
    const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // Function to send the captured image to Face++ API
  const sendImageToFacePlusPlus = async () => {
    if (!image) return;

    const apiKey = '2o6GZDIn8vhQYKsyP6MqOLghE0Ks6sZH	';  // Replace with your Face++ API key
    const apiSecret = 'j9Y3neP-41AfYz2vuwug-g6z7LKwWK3I';  // Replace with your Face++ API secret

    // Convert base64 image to Blob
    const imageBlob = base64ToBlob(image);

    // Prepare the form data
    const formData = new FormData();
    formData.append('api_key', apiKey);
    formData.append('api_secret', apiSecret);
    formData.append('image_file', imageBlob, 'captured_image.jpg');
    formData.append('return_landmark', '1');
    formData.append('return_attributes', 'gender,age');

    try {
      const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Face++ API response:', response.data);
    } catch (error) {
      console.error('Error sending image to Face++:', error);
    }
  };

  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, paddingLeft: 30, paddingTop: 5 }}>
        <Typography gutterBottom sx={{ textAlign: 'center', fontWeight: 600, fontSize: 40, color: '#120b4f' }}>
          Face Registration
        </Typography>

        {/* Webcam capture area */}
        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
          />
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={capture}>
              Capture Face
            </Button>
          </Box>
        </Box>

        {/* Display the captured image */}
        {image && (
          <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
            <Typography gutterBottom>Captured Image:</Typography>
            <img src={image} alt="Captured Face" width={320} height={240} />
          </Box>
        )}

        {/* Button to send the image to the Face++ API */}
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" color="secondary" onClick={sendImageToFacePlusPlus}>
            Detect Face with Face++
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default FaceRecognize;
