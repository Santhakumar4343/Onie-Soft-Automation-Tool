
import './AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar';

import { Route, Routes } from 'react-router-dom';
import Testcases from '../TestCases/Testcases';
import TestRuns from '../TestRuns/TestRuns';
import TestRunDetails from '../TestRuns/TestRunDetails';
import Projects from '../Projects/Projects';
import Users from '../Users/Users';
import Company from '../Company/Company';
import TestRunView from '../TestRuns/TestRunView';

const AdminDashboard = () => {
  return (
    <div className="d-flex">
      
      <div className="col-2 p-3  text-white adminsidebar">
        <Sidebar />
      </div>
      {/* Content Area - Set to 80% width using Bootstrap col classes */}
      <div className="col-10 p-3">
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/testcases/*" element={<Testcases />} />
          <Route path="/testruns" element={<TestRuns />} />
          <Route path="/testrunDetails" element={<TestRunDetails />} />
          <Route path="/testRunView" element={<TestRunView />} />
          <Route path="/users" element={<Users/>}></Route>
          <Route path="/company" element={<Company/>}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
