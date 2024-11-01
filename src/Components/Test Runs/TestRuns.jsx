import { Modal } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TestRuns=()=> {

 
  const [searchText,setSearchText] =useState("");
  const [testRunModal,setTestRunModal]=useState("");

  const navigate =useNavigate();
  
  const [testRunData,setTestData]=useState({
    testRunName:""
  })
  const [testRuns, setTestRuns] = useState([
    {
      projectId: "4",
      testRunId: "TC001",
      testRunName: "TestRun 1",
      createdBy: "29/10/24",
      updatedAt: "29/10/24",
    },
    {
      projectId: "4",
      testRunId: "TC002",
      testRunName: "Test Run 2",
      createdBy: "28/10/24",
      updatedAt: "28/10/24",
    },
    {
      projectId: "4",
      testRunId: "TC003",
      testRunName: "Test Run 3",
      createdBy: "27/10/24",
      updatedAt: "27/10/24",
    },
    {
      projectId: "4",
      testRunId: "TC001",
      testRunName: "Test Run 4",
      createdBy: "29/10/24",
      updatedAt: "29/10/24",
    },
    {
      projectId: "4",
      testRunId: "TC002",
      testRunName: "Test Run 5",
      createdBy: "28/10/24",
      updatedAt: "28/10/24",
    },
    {
      projectId: "4",
      testRunId: "TC003",
      testRunName: "Test Run 6",
      createdBy: "27/10/24",
      updatedAt: "27/10/24",
    }]);
    const handleTestRun=()=>{
           setTestRunModal(true)
    }

    const filteredTestRuns=testRuns.filter(testRun=>(
      testRun.testRunName.toLowerCase().includes(searchText)
    ))

    const handleTestRunClick=()=>{
       navigate("/testRunDetails")
    }

    const handleTestRunSubmit=(e)=>{
      e.preventDefault();
      alert("Test Run Submitted");
    }
    const handleTestRuntChange=(e)=>{
      const {name,value}=e.target;
      setTestData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  return (
    <div>
    <div className="body-container">
    <div className="search-container">
      <button className="project-btn" onClick={handleTestRun} style={{height:"35px"}}>
        Create Test Run
      </button>
      <input
        type="text"
        value={searchText}
        placeholder="Search by Test Run Name"
        className="search-input"
        onChange={(e)=>{setSearchText(e.target.value)}}
      />
    </div>
    <div className="cards-container">
      {filteredTestRuns.map((testRun, index) => (
        <div className="project-card" key={index} onClick={handleTestRunClick}>
          <h3 className="project-name" >{testRun.testRunName}</h3>
        </div>
      ))}
    </div>
  </div>

  
<Modal open={testRunModal} onClose={() => setTestRunModal(false)}>
<div className="modal-content">
  <h3 style={{ textAlign: "center" }}>Create Test Run</h3>
  <form onSubmit={handleTestRunSubmit} className="property-form">
    <input
      type="text"
      name="testRunName"
      placeholder="Test Run Name"
      onChange={handleTestRuntChange}
      value={testRunData.testRunName}
      required
    />
    <button type="submit" className="submit-button" style={{marginTop:"10px",borderRadius:"20px",background:"#4f0e83"}}>
      Create Test Run
    </button>
  </form>
</div>
</Modal>
</div>
  )
}

export default TestRuns
