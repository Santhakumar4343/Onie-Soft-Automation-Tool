import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import Logo from "../../assets/oniesoft.png";
import "./UserDashboard.css";

const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on the current path
  const getValueFromPath = () => {
    switch (location.pathname) {
      case "/userDashboard":
        return 0;
      case "/userDashboard/projects":
        return 1;
      case "/userDashboard/config":
        return 2;
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
        navigate("/userDashboard");
        break;
      case 1:
        navigate("/userDashboard/projects");
        break;
      case 2:
        navigate("/userDashboard/config");
        break;
      default:
        break;
    }
  };

  return (
    <div className="text-white sidebar-container">
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
        aria-label="User Dashboard Navigation"
        sx={{
          ".MuiTab-root": {
            textTransform: "none", // Prevent uppercase labels
            justifyContent: "flex-start", // Align labels and icons to the left
            color: "#4f0e83", // Default text color for all tabs
            fontSize: "1rem",
            paddingLeft: "16px",
          },
          ".Mui-selected": {
            color: "#e00769", // Active tab text color
           // Active tab background color
            borderRadius: "4px", // Optional: Rounded corners for the active tab
          },
          ".MuiTabs-indicator": {
            backgroundColor: "#e00769",
            // Hide the default indicator
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
          icon={<FolderIcon />}
          label="Projects"
          aria-label="Projects"
          iconPosition="start"
        />
        <Tab
          icon={<SettingsIcon />}
          label="Config"
          aria-label="Config"
          iconPosition="start"
        />
      </Tabs>
    </div>
  );
};

export default UserSidebar;
