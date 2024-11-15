import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TestLogo from "../../assets/TestLogo.png";
import TestLogo1 from "../../assets/softwaretesting1.jpg";
import axios from 'axios';
import Logo from "../../assets/oniesoft.png";
const Login = () => {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8088/login/v1/authenticate', {
        empId,
        password
      });

      if (response.data.jwt) {
        sessionStorage.setItem('jwt_token', response.data.jwt);
        sessionStorage.setItem('user',JSON.stringify(response.data.register))
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundImage: "linear-gradient(-100deg, #4f0e83 5%, #6bfffa 80%)", position: "relative" }}>
  {/* Logo positioned at the top left */}
  <div style={{ position: "absolute", top: "-30px", left: "40px" }}>
    <img src={Logo} className="img-fluid" alt="Logo" style={{ maxWidth: '300px', borderRadius: '10px' }} />
  </div>

  {/* Main content */}
  <div className="row align-items-center" style={{backgroundImage: "linear-gradient(-100deg, #6bfffa 5%, #4f0e83 80%)", borderRadius: "20px", maxWidth: '1000px', padding: '20px' }}>
    {/* Test Logo Image */}
    <div className="col-12 col-md-6 d-flex justify-content-center mb-4 mb-md-0">
      <img src={TestLogo1} className="img-fluid rounded" alt="Test Logo" style={{ maxWidth: '400px' }} />
    </div>

    {/* Login Form */}
    <div className="col-12 col-md-6 d-flex justify-content-center">
      <div className="w-100 p-4 " style={{ maxWidth: '400px' }}>
        <h3 className="text-center mb-4" style={{ color: "#4f0e83", fontFamily: "system-ui" }}>Welcome to ONiE TestSuite</h3>
        <form className="text-center" onSubmit={handleLogin}>
          <input
            type="text"
            className="form-control w-100 mb-3"
            placeholder="Employee ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />
          <input
            type="password"
            className="form-control w-100 mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn w-50" style={{ backgroundColor: "#4f0e83", color: "white", borderRadius: "20px" }}>Login</button>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default Login;
