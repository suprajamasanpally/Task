import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import LoginPage from './Pages/LoginPage/LoginPage';
import SignupPage from './Pages/SignupPage/SignupPage';
import SuperAdminDashboard from './Components/SuperAdmin/SuperAdminDashboard';
import UserAdminDashboard from './Pages/UserAdminDashboard/UserAdminDashboard';
import WorkflowManagement from './Components/SuperAdmin/WorkflowManagement/WorkflowManagement';
import PersonalInfoPage from './Pages/PersonalInfoPage/PersonalInfoPage';




function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/signup' element={<SignupPage/>}></Route>
        <Route path='/superadmin-dashboard' element={<SuperAdminDashboard/>}></Route>
        <Route path='/workflow-management' element={<WorkflowManagement/>}></Route>
        <Route path='/useradmin-dashboard' element={<UserAdminDashboard/>}></Route>
        <Route path='/personal-info' element={<PersonalInfoPage/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;