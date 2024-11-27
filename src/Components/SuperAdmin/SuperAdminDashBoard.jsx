import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSideBar';
import Admins from '../Admin/Admins';
import Departments from './Departments';
import Companies from './Companies';
import './SuperAdminDashboard.css';
import View from './View';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Ensure you have this icon imported
import { useState } from 'react';
import SuperProfile from './SuperProfile';

const SuperAdminDashboard = () => {
  // State for dropdown visibility
  const [isDropdownOpen, setDropdownOpen] =useState(false);

  // Handlers for dropdown toggle
  const toggleDropdown = () => setDropdownOpen(true);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div className="d-flex">
      {/* Sidebar Section */}
      <div className="col-2 p-2 text-white sidebar">
        <SuperAdminSidebar />
      </div>

      {/* Main Content Section */}
      <div className="col-10 p-3">
        {/* Header with Profile Icon */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className='hidden'></h2>
        <h2>Super Admin Dashboard</h2>
          <div
            className="position-relative"
            onMouseEnter={toggleDropdown}
            onMouseLeave={closeDropdown}
          > 
            
            <AccountCircleIcon style={{ fontSize: '2rem', cursor: 'pointer' }} />
            {isDropdownOpen && (
              <div
                className="dropdown-menu dropdown-menu-right show"
                style={{ position: 'absolute', right: 0 }}
              >
                <a className="dropdown-item" href="/adminDashboard/profile">
                  Profile
                </a>
                <a className="dropdown-item" href="/logout">
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Routing Section */}
        <Routes>
          <Route path="/" element={<View />} />
          <Route path="/profile" element={<SuperProfile/>} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/admins" element={<Admins />} />
        </Routes>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
