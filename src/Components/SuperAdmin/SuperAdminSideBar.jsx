import { useLocation } from "react-router-dom";
import Logo from "../../assets/oniesoft.png";
import './superAdminDashboard.css';

const SuperAdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="col-md-3 col-lg-2 p-3 text-white">
      <div className="profile-section text-center mb-4">
        <img
          src={Logo}
          alt="Logo"
          className="profile-img rounded-circle"
          width="120"
          height="120"
        />
      </div>
      <ul className="nav flex-column">
      <li className="nav-item">
          <a
            href="/adminDashboard/"
            className={location.pathname === "/adminDashboard/" ? "active" : ""}
          >
            Dashboard
          </a>
        </li>
        <li className="nav-item">
          <a
            href="/adminDashboard/companies"
            className={location.pathname === "/adminDashboard/companies" ? "active" : ""}
          >
            Companies
          </a>
        </li>
       
        {/* <li className="nav-item">
          <a
            href="/adminDashboard/admins"
            className={location.pathname === "/adminDashboard/admins" ? "active" : ""}
          >
            Admins
          </a>
        </li> */}
      </ul>
    </div>
  );
};

export default SuperAdminSidebar;
