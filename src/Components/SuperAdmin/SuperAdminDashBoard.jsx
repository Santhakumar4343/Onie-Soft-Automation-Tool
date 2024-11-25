

import 'bootstrap/dist/css/bootstrap.min.css';


import { Route, Routes } from 'react-router-dom';

import SuperAdminSidebar from './SuperAdminSideBar';
import Admins from '../Admin/Admins';
import Departments from './Departments';
import Companies from './Companies';
import './superAdminDashboard.css';
import View from './View';
const SuperAdminDashboard = () => {
  return (
    <div className="d-flex">
      
      <div className="col-2 p-2  text-white sidebar">
        <SuperAdminSidebar />
      </div>
     
      <div className="col-10 p-3">
        <Routes>
        <Route path="/" element={<View/>}></Route>
          <Route path="/companies" element={<Companies/>} />
          <Route path="/departments" element={<Departments/>}></Route>
          <Route path="/admins" element={<Admins/>}></Route>
          
        </Routes>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
