import Logo from "../../assets/oniesoft.png"
import "../Header/dashboard.css"
const Header=() =>{
  return (
    <div className="header-container" >
        <div className="logo-container">
           <img src={Logo} alt="logo" width="20%"   style={{marginLeft:"50px"}} />
          
        </div>
      
    </div>
  )
}

export default Header
