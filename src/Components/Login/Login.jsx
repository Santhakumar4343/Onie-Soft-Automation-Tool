import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TestLogo from "../../assets/TestLogo.png";
import axios from 'axios';

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
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundImage: "linear-gradient(-100deg, #4f0e83 5%, #6bfffa 80%)" }}>
      <div className="row align-items-center" style={{ backgroundColor: "white", borderRadius: "20px" }}>
        <div className="col-12 col-md-6 d-flex justify-content-center mb-4 mb-md-0">
          <img src={TestLogo} className="img-fluid rounded" alt="Logo" style={{ maxWidth: '550px' }} />
        </div>

        <div className="col-12 col-md-6 d-flex justify-content-center">
          <div className="w-100 p-4 border rounded" style={{ maxWidth: '400px' }}>
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
