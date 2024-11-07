import Logo from "../../assets/oniesoft.png";
import"./AdminDashboard.css"
const Sidebar = ({ activeLink, handleLinkClick }) => {
  return (
    <div className="col-md-3 col-lg-2 sidebar p-3  text-white">
      <div className="profile-section text-center mb-4">
        <img src={Logo} alt="Logo" className="profile-img rounded-circle" width="120" height="120" />
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <a
            href="/dashboard"
            className={`nav-link ${activeLink === 'projects' ? 'active' : ''}`}
            onClick={() => handleLinkClick('projects')}
            style={{fontWeight:"1000",fontFamily:"sans-serif",color:"white"}}
          >
            <span className={`nav-arrow ${activeLink === 'projects' ? 'show-arrow' : ''}`}>&#8594;</span>
            Projects
          </a>
        </li>
        <li className="nav-item">
          <a
           href="/dashboard/users"
            
            className={`nav-link ${activeLink === 'users' ? 'active' : ''}`}
            onClick={() => handleLinkClick('users')}
            style={{fontWeight:"1000",fontFamily:"sans-serif",color:"white"}}
          >
            <span className={`nav-arrow ${activeLink === 'users' ? 'show-arrow' : ''}`}>&#8594;</span>
            Users
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
