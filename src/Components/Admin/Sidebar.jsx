import  { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import Logo from "../../assets/oniesoft.png";
import "./AdminDashboard.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on the current path
  const getValueFromPath = () => {
    switch (location.pathname) {
      case "/dashboard":
        return 0;
      case "/dashboard/projects":
        return 1;
      case "/dashboard/users":
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
        navigate("/dashboard");
        break;
      case 1:
        navigate("/dashboard/projects");
        break;
      case 2:
        navigate("/dashboard/users");
        break;
      default:
        break;
    }
  };

  return (
    <div className=" p-3  ">
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
        aria-label="Admin Dashboard Navigation"
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
          icon={<FolderIcon />}
          label="Projects"
          aria-label="Projects"
           iconPosition="start"
        />
        <Tab
          icon={<PeopleIcon />}
          label="Users"
          aria-label="Users"
          iconPosition="start"
        />
      </Tabs>
    </div>
  );
};

export default Sidebar;