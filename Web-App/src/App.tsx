import { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // If the admin is not authenticated, show the secure login screen
  if (!isAdminAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAdminAuthenticated(true)} />;
  }

  // Once authenticated, load the executive admin dashboard
  return <AdminDashboard />;
}