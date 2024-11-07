import { Modal } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const TestRuns = () => {
  const [searchText, setSearchText] = useState("");
  const [testRunModal, setTestRunModal] = useState(false);
  const navigate = useNavigate();
  const [testRunData, setTestData] = useState({ testRunName: "" });
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
  ]);

  const handleTestRun = () => setTestRunModal(true);

  const filteredTestRuns = testRuns.filter((testRun) =>
    testRun.testRunName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleTestRunClick = () => navigate("/dashboard/testRunDetails");

  const handleTestRunSubmit = (e) => {
    e.preventDefault();
    alert("Test Run Submitted");
  };

  const handleTestRunChange = (e) => {
    const { name, value } = e.target;
    setTestData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="d-flex">
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-primary"
            style={{
              height: "40px",
              color: "white",
              backgroundColor: "#4f0e83",
              width: "15%",
              borderRadius: "20px",
            }}
            onClick={handleTestRun}
          >
            Create Test Run
          </button>
          <input
            type="text"
            value={searchText}
            placeholder="Search by Test Run Name"
            className="form-control w-50"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="row">
          {filteredTestRuns.map((testRun, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div
                className="card shadow-sm h-100"
                onClick={handleTestRunClick}
                style={{ backgroundColor:"#118f8d",cursor:"pointer",borderRadius:"10px" }}
              >
                <div className="card-body text-center" >
                  <h5 className="card-title">{testRun.testRunName}</h5>
                  <p className="card-text text-muted">
                    Created: {testRun.createdBy} <br />
                    Updated: {testRun.updatedAt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={testRunModal} onClose={() => setTestRunModal(false)}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
           
          }}
        >
          <div className="modal-content p-4" style={{ maxWidth: "500px", width: "100%", backgroundColor:"white",borderRadius:"20px" }}>
            <h4 className="modal-title text-center">Add Test Run</h4>
            <form onSubmit={handleTestRunSubmit} className="mt-4">
              <div className="form-group">
                <input
                  type="text"
                  name="testRunName"
                  className="form-control w-80 mb-3"
                  placeholder="Test Run Name"
                  onChange={handleTestRunChange}
                  value={testRuns.testRunName}
                  required
                />
              </div>
              <div className="text-center">
              <button
                  type="submit"
                  className="btn btn-primary mt-3 "
                  style={{ borderRadius: "20px", background: "#4f0e83" ,marginRight:"20px",width:"150px"}}
                  onClick={()=>{setTestRunModal(false)}}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary mt-3 w-20"
                  style={{ borderRadius: "20px", background: "#4f0e83",width:"150px" }}
                >
                  Add Test Run
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TestRuns;
