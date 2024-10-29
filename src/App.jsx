import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/Header/Dashboard";
import Testcases from "./Components/Test Cases/Testcases";
import { ToastContainer } from "react-toastify";


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
        <Route path="/" element={<Dashboard />} />
        <Route path="/testcases" element={<Testcases />}></Route>
      </Routes>
    </div>
  );
}

export default App;
