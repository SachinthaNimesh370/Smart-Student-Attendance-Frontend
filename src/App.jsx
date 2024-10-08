import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import History from './pages/History';
import Student from './pages/Student';
import Summery from './pages/Summery';
import FaceRecognize from './pages/FaceRecognize';
import Notification from './pages/Notification';
import LectureHalls from './pages/LectureHalls';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/student" element={<Student />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/history" element={<History />} />
          <Route path="/summery" element={<Summery />} />
          <Route path="/face_recognize" element={<FaceRecognize />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/lecturehalls" element={<LectureHalls />} />
         
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

