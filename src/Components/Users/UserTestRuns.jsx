import { Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL, createTestRun, getTestRunByProjectId } from "../API/Api";
import Swal from "sweetalert2";
import moment from "moment";
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const UserTestRuns = () => {
  const [searchText, setSearchText] = useState("");
  const [testRunModal, setTestRunModal] = useState(false);
  const navigate = useNavigate();
  const user=JSON.parse(sessionStorage.getItem('user'));
  console.log(user.id)
  const location=useLocation();

  const {project}=location.state||{};

  const [testRunData, setTestData] = useState({
     testRunName: "" ,
    });
  const [testRuns, setTestRuns] = useState([]);

  useEffect(()=>{
    getTestRunByProjectId(project.id).then(response=>setTestRuns(response.data)
  ).catch(err=>console.log(err))
  },[project.id])
  const handleTestRun = () => setTestRunModal(true);

  const filteredTestRuns = testRuns.filter((testRun) =>
    testRun.testRunName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleTestRunClick = (testRun) => navigate("/userDashboard/testRunDetails",{state:{project,testRun}});
  const handleTestRunView= (testRun) => navigate("/userDashboard/testRunView",{state:{project,testRun}});
  const handleTestRunSubmit = (e) => {
    e.preventDefault();
      const data={
        testRunName: testRunData.testRunName ,
        createdBy :user.empName,
        projectId:project.id
      }
    createTestRun(data).then(response=>{
      Swal.fire({
      icon:"success",
      title:"Test Run Saved",
      text:"Test Run Created Successfully!"
      })
      console.log(response)
      window.location.reload();
      setTestRunModal(false)
    }).catch(err=>{
      Swal.fire({
        icon:"error",
        title:"Oops...",
        text:"something went wrong could not create Test Run!!"
      })
      console.log(err)
      setTestRunModal(false)
    })
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
     
      <div className="container ">
      <h4 className="text-center mb-2" style={{color:"#4f0e83"}}>{project.projectName}-Test Runs</h4>
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
            className="form-control "
            style={{width:"40%"}}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="table-responsive">
  <table className="table table-bordered table-hover">
    <thead className="thead-dark">
      <tr>
        <th>#</th>
        <th>Test Run Name</th>
        <th>Created By</th>
        <th>Created At</th>
        <th>Updated At</th>
        <th>Test Cases</th>
      </tr>
    </thead>
    <tbody>
      {filteredTestRuns.map((testRun, index) => (
        <tr 
          key={index} 
          
          style={{ cursor: "pointer", backgroundColor: "rgb(79, 103, 228)", color: "white" }}
        >
          <td>{index + 1}</td>
          <td>{testRun.testRunName}</td>
          <td>{testRun.createdBy}</td>
          <td>{moment(testRun.createdAt).format("DD MMM YYYY, HH:mm:ss")}</td>
          <td>{moment(testRun.updatedAt).format("DD MMM YYYY, HH:mm:ss")}</td>
          <div>
           <td><EditIcon  className="me-2" style={{ cursor: "pointer", color: "#4f0e83" }} onClick={() => handleTestRunClick(testRun)} /></td>
           <td><RemoveRedEyeIcon  style={{ cursor: "pointer", color: "#4f0e83" }} onClick={() => handleTestRunView(testRun)}/></td>
          </div>
        </tr>
      ))}
    </tbody>
  </table>
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

export default UserTestRuns;
