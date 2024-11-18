
import './UserDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import { Route, Routes } from 'react-router-dom';
import UserSidebar from './UserSideBar';
import UserProjects from './UserProjects';
import UserTestcases from './UserTestCases';
import UserTestRuns from './UserTestRunDetails';
import UserTestRunDetails from './UserTestRuns';


const UserDashboard = () => {
  return (
    <div className="d-flex">
      
      <div className="col-2 p-3  text-white sidebar">
        <UserSidebar />
      </div>
      {/* Content Area - Set to 80% width using Bootstrap col classes */}
      <div className="col-10 p-3">
        <Routes>
          <Route path="/" element={<UserProjects />} />
          <Route path="/testcases/*" element={<UserTestcases />} />
          <Route path="/testruns" element={<UserTestRuns />} />
          <Route path="/testrunDetails" element={<UserTestRunDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;
