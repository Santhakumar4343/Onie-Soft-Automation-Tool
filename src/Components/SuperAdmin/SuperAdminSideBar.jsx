import  { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import Logo from "../../assets/oniesoft.png";
import './SuperAdminDashboard.css';

const SuperAdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on the current path
  const getValueFromPath = () => {
    switch (location.pathname) {
      case "/adminDashboard/":
        return 0;
      case "/adminDashboard/companies":
        return 1;
      default:
        return 0;
    }
  };

  const [activeTab, setActiveTab] = useState(getValueFromPath());

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);

    // Navigate to the corresponding route
    switch (newValue) {
      case 0:
        navigate("/adminDashboard/");
        break;
      case 1:
        navigate("/adminDashboard/companies");
        break;
      default:
        break;
    }
  };

  return (
    <div className="  sideBar">
      {/* Profile Section */}
      <div className="profile-section text-center mb-4">
        <img
          src={Logo}
          alt="Logo"
          className="profile-img rounded-circle"
          width="120"
          height="120"
        />
      </div>

      {/* Tabs Section */}
      <Tabs
        orientation="vertical"
        value={activeTab}
        onChange={handleTabChange}
        aria-label="Super Admin Dashboard Navigation"
        sx={{
          ".MuiTab-root": {
            textTransform: "none", // Prevent uppercase labels
            justifyContent: "flex-start", // Align labels and icons to the left
            color: "#ffffff", // Default text color
            fontSize: "1rem",
            paddingLeft: "16px",
          },
          ".Mui-selected": {
            color: "#4f0e83", // Active tab text color
          },
          ".MuiTabs-indicator": {
            backgroundColor: "#4f0e83", // Active tab indicator color
          },
        }}
      >
        <Tab
          icon={<DashboardIcon />}
          label="Dashboard"
          aria-label="Dashboard"
          iconPosition="start"
        />
        <Tab
          icon={<BusinessIcon />}
          label="Companies"
          aria-label="Companies"
           iconPosition="start"
        />
      </Tabs>
    </div>
  );
};

export default SuperAdminSidebar;
