import { Route, Routes } from "react-router-dom";
import "./App.css";


import { ToastContainer } from "react-toastify";
import Login from "./Components/Login/Login";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import PrivateRoute from "./assets/PrivateRoutes";
import SuperAdminDashboard from "./Components/SuperAdmin/SuperAdminDashBoard";
import UserDashboard from "./Components/Users/UserDashboard";




function App() {
  return (
    <div className="app">
       <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
     <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<PrivateRoute element={<AdminDashboard />} />} />
        <Route path="/AdminDashboard/*" element={<PrivateRoute element={<SuperAdminDashboard />} />} />
        <Route path="/userDashboard/*" element={<PrivateRoute element={<UserDashboard />} />} />
        </Routes> 
    </div>
  );
}

export default App;
