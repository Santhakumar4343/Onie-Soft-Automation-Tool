import './UserDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserSidebar from './UserSideBar';
import UserProjects from './UserProjects';
import UserTestcases from './UserTestCases';
import UserTestRuns from './UserTestRuns';
import UserTestRunDetails from './UserTestRunDetails';
import UserTestRunView from './TestRunView';
import Config from './Config';
import Userview from './Userview';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserDashboard = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Handlers for dropdown toggle
  const toggleDropdown = () => setDropdownOpen(true);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="col-2 p-3 text-white usersidebar">
        <UserSidebar />
      </div>

      {/* Main content */}
      <div className="col-10 p-3">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1></h1>
          <h2>User Dashboard</h2>
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
                <a className="dropdown-item" href="/profile">
                  Profile
                </a>
                <a className="dropdown-item" href="/logout">
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
          <Route path="/testcases/*" element={<UserTestcases />} />
          <Route path="/testruns" element={<UserTestRuns />} />
          <Route path="/testrunDetails" element={<UserTestRunDetails />} />
          <Route path="/testrunView" element={<UserTestRunView />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;
