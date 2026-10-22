import { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);


  if (!isAdminAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAdminAuthenticated(true)} />;
  }

  
  return <AdminDashboard />;
}