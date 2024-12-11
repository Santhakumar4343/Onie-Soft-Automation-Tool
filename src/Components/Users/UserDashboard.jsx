import './UserDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import UserSidebar from './UserSideBar';
import UserProjects from './UserProjects';
import UserTestcases from './UserTestCases';
import UserTestRuns from './UserTestRuns';
import UserTestRunDetails from './UserTestRunDetails';
import UserTestRunView from './TestRunView';
import Config from './Config';
import Userview from './Userview';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserProfile from './UserProfile';
import Swal from 'sweetalert2';
import Configurations from './Configurations';
import TestRunsSummary from './TestRunsSummary';
import TestRunSummary from './TestRunSummary';

const UserDashboard = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Handlers for dropdown toggle
  const toggleDropdown = () => setDropdownOpen(true);
  const closeDropdown = () => setDropdownOpen(false);
  const navigate=useNavigate();
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
      {/* Sidebar */}
      <div className="col-2 p-3 text-white usersidebar">
        <UserSidebar />
      </div>

      {/* Main content */}
      <div className="col-10 p-3">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3 mt-2">
          <h1></h1>
          <h4 style={{color:"#808080"}}>User Dashboard</h4>
          <div
            className="position-relative"
            onMouseEnter={toggleDropdown}
            onMouseLeave={closeDropdown}
          >
            <AccountCircleIcon style={{ fontSize: '2.5rem', cursor: 'pointer' }} />
            {isDropdownOpen && (
              <div
                className="dropdown-menu dropdown-menu-right show"
                style={{ position: 'absolute', right: 0 }}
              >
                <a className="dropdown-item" href="/userDashboard/profile">
                  Profile
                </a>
                <a className="dropdown-item" onClick={handleLogout}>
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Routes for different sections */}
        <Routes>
          <Route path="/" element={<Userview />} />
          <Route path="/projects" element={<UserProjects />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/testcases/*" element={<UserTestcases />} />
          <Route path="/testruns" element={<UserTestRuns />} />
          <Route path="/testrunDetails" element={<UserTestRunDetails />} />
          <Route path="/testrunView" element={<UserTestRunView />} />
          <Route path="/config" element={<Config />} />
          <Route path="/configpage" element={<Configurations />} />
          <Route path='/testRunsSummary/*' element={<TestRunsSummary/>}/>
          <Route path='/testRunSummary/*' element={<TestRunSummary/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;
