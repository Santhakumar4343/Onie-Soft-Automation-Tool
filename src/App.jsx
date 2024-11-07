import { Route, Routes } from "react-router-dom";
import "./App.css";


import { ToastContainer } from "react-toastify";
import Login from "./Components/Login/Login";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import PrivateRoute from "./assets/PrivateRoutes";
import Testcases from "./Components/Test Cases/Testcases";
import TestRuns from "./Components/Test Runs/TestRuns";
import TestRunDetails from "./Components/Test Runs/TestRunDetails";


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
        </Routes> 
    </div>
  );
}

export default App;
