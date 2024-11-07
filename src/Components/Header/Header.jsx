import Logo from "../../assets/oniesoft.png"
import "../Header/dashboard.css"
const Header=() =>{
  return (
    <div className="header-container" style={{ position: "sticky", top: 0, backgroundColor: "#f8f9fa", zIndex: 100 ,color:"#4f0e83"}} >
        <div className="logo-container">
           <img src={Logo} alt="logo" width="28%"   style={{marginLeft:"50px"}} />
        </div>
    </div>
  )
}

export default Header
