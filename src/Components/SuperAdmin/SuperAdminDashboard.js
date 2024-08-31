import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <h1>SuperAdmin Dashboard</h1>
      <button onClick={() => handleNavigation('/workflow-management')}>Workflow Management</button>
      <button onClick={() => handleNavigation('/template-management')}>Template Management</button>
      <button onClick={() => handleNavigation('/field-management')}>Field Management</button>
    </div>
  );
};

export default SuperAdminDashboard;
