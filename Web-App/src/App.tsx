import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OtpInput from './components/OtpInput';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OtpInput />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}