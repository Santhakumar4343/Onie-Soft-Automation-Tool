import { useState } from 'react';
import './AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar';

import { Route, Routes } from 'react-router-dom';
import Testcases from '../Test Cases/Testcases';
import TestRuns from '../Test Runs/TestRuns';
import TestRunDetails from '../Test Runs/TestRunDetails';
import Projects from '../Projects/Projects';
import Users from '../Users/Users';

const AdminDashboard = () => {
  return (
    <div className="d-flex">
      
      <div className="col-2 p-3  text-white sidebar">
        <Sidebar />
      </div>
      {/* Content Area - Set to 80% width using Bootstrap col classes */}
      <div className="col-10 p-3">
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/testcases" element={<Testcases />} />
          <Route path="/testruns" element={<TestRuns />} />
          <Route path="/testrunDetails" element={<TestRunDetails />} />
          <Route path="/users" element={<Users/>}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;