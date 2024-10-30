
import Projects from "../Projects/Projects";
import Testcases from "../Test Cases/Testcases";
import TestRunDetails from "../Test Runs/TestRunDetails";
import TestRuns from "../Test Runs/TestRuns";
import Header from "./Header";
import "./dashboard.css";

import { Route, Routes } from "react-router-dom";

const Dashboard = () => {
  
 

 

  
  
 
  return (
    <div>
      
      <Header />
      <Routes>
        <Route path="/" element={<Projects/>}> </Route>
        <Route path="/testcases" element={<Testcases/>}></Route>
        <Route path="/testRuns" element={<TestRuns/>}/>
        <Route path="/testRunDetails" element={<TestRunDetails/>} />
      </Routes>

    </div>
  );
};

export default Dashboard;
