import { useLocation } from "react-router-dom";
import Logo from "../../assets/oniesoft.png";
import "./UserDashboard.css";

const UserSidebar = () => {
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
            href="/userDashboard"
            className={location.pathname === "/userDashboard" ? "active" : ""}
          >
            Projects
          </a>
        </li>
        
      </ul>
    </div>
  );
};

export default UserSidebar;
