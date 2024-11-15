import { useLocation } from "react-router-dom";
import Logo from "../../assets/oniesoft.png";
import "./AdminDashboard.css";

const Sidebar = () => {
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
            href="/dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            Projects
          </a>
        </li>
        <li className="nav-item">
          <a
            href="/dashboard/users"
            className={location.pathname === "/dashboard/users" ? "active" : ""}
          >
            Users
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
