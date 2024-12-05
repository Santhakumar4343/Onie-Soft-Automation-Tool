import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSideBar';
import Admins from '../Admin/Admins';
import Departments from './Departments';
import Companies from './Companies';
import './SuperAdminDashboard.css';
import View from './View';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Ensure you have this icon imported
import { useState } from 'react';
import SuperProfile from './SuperProfile';
import Swal from 'sweetalert2';

const SuperAdminDashboard = () => {
  // State for dropdown visibility
  const [isDropdownOpen, setDropdownOpen] =useState(false);
 const navigate=useNavigate()
  // Handlers for dropdown toggle
  const toggleDropdown = () => setDropdownOpen(true);
  const closeDropdown = () => setDropdownOpen(false);
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then((result) => {
      if (result.isConfirmed) {
        window.history.replaceState(null, '', '/');
        navigate('/');
      }
    });
  }
  return (
    <div className="d-flex">
      {/* Sidebar Section */}
      <div className="col-2 p-2 text-white sidebar">
        <SuperAdminSidebar />
      </div>

      {/* Main Content Section */}
      <div className="col-10 p-3">
        {/* Header with Profile Icon */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
          <h2 className='hidden'></h2>
        <h4 style={{color:"#808080" }}>Super Admin Dashboard</h4>
          <div
            className="position-relative"
            onMouseEnter={toggleDropdown}
            onMouseLeave={closeDropdown}
          > 
            
            <AccountCircleIcon style={{ fontSize: '2.7rem', cursor: 'pointer' }} />
            {isDropdownOpen && (
              <div
                className="dropdown-menu dropdown-menu-right show"
                style={{ position: 'absolute', right: 0 }}
              >
                <a className="dropdown-item" href="/adminDashboard/profile">
                  Profile
                </a>
                <a className="dropdown-item" onClick={handleLogout}>
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
