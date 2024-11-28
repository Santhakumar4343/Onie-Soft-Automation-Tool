import "./AdminDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Testcases from "../TestCases/Testcases";
import TestRuns from "../TestRuns/TestRuns";
import TestRunDetails from "../TestRuns/TestRunDetails";
import Projects from "../Projects/Projects";
import Users from "../Users/Users";
import Company from "../Company/Company";
import TestRunView from "../TestRuns/TestRunView";
import AdminView from "./AdminView";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const AdminDashboard = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Handlers for dropdown toggle
  const toggleDropdown = () => setDropdownOpen(true);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="col-2 p-3 text-white adminsidebar">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="col-10 p-3">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1></h1>
          <h2>Admin Dashboard</h2>
          <div
            className="position-relative"
            onMouseEnter={toggleDropdown}
            onMouseLeave={closeDropdown}
          >
            <AccountCircleIcon style={{ fontSize: "2rem", cursor: "pointer" }} />
            {isDropdownOpen && (
              <div
                className="dropdown-menu dropdown-menu-right show"
                style={{ position: "absolute", right: 0 }}
              >
                <a className="dropdown-item" href="/dashboard/profile">
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
          <Route path="/" element={<AdminView />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<AdminProfile/>} />
          <Route path="/testcases/*" element={<Testcases />} />
          <Route path="/testruns" element={<TestRuns />} />
          <Route path="/testrunDetails" element={<TestRunDetails />} />
          <Route path="/testRunView" element={<TestRunView />} />
          <Route path="/users" element={<Users />} />
          <Route path="/company" element={<Company />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
