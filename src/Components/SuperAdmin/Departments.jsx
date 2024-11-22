import { Modal } from "@mui/material";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { createBranch, getAllBranchesByCompany } from "../API/Api";
import { useLocation, useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
const Deparments = () => {
  const [projectModal, setProjectModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [branches, setBranches] = useState([]);
  
  const location = useLocation();
const cmpId = location.state?.company.id || {};

console.log(cmpId)
  const navigate=useNavigate();
  const [branchData, setBranchData] = useState({
    branchName: "",
    branchId: "",
    
  });

  const handleBranchClick=(branch)=>{
    navigate("/adminDashboard/admins" ,{state:{branch}})
  }
   
  const handleProject = () => {
    setProjectModal(true);
  };

  useEffect(() => {
    getAllBranchesByCompany(cmpId)
      .then((response) => {
        setBranches(response.data);
      })
      .catch((err) => console.log(err));
  }, [cmpId]);

  const handleProjectSubmit = (e) => {
    const data={
      branchName: branchData.branchName,
      branchId: branchData.branchId,
      cmpId:cmpId
    };
    e.preventDefault();
    createBranch(data)
      .then((response) => {
      if(response.status===201||response.status===201){
        Swal.fire({
          icon: "success",
          title: "Branch Saved",
          text: "Your Branch has been Created successfully!",
        });
        location.reload()
      }
      else{
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Could not create the Branch.",
        });
      }
      })
      .catch((err) => {
       
        console.log(err);
      });
    setProjectModal(false);
    setBranchData({ cmpName: "", cmpId: "" });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setBranchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const filteredBranches = branches.filter((company) =>
    company.branchName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <h2 className="text-center" style={{ color: "#4f0e83" }}>
       {location.state?.company?.cmpName} Branches
      </h2>
      <div className="d-flex justify-content-between mb-4">
        <button
          onClick={handleProject}
          style={{
            height: "40px",
            color: "white",
            backgroundColor: "#4f0e83",
            width: "10%",
            borderRadius: "20px",
          }}
        >
          Add Branch
        </button>
        <input
          type="text"
          value={searchText}
          placeholder="Search by Branch  Name"
          className="form-control"
          style={{ width: "40%" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="table-responsive">
  <table className="table  table-hover ">
    <thead >
      <tr>
        <th>Branch ID</th>
        <th>Branch Name</th>
        <th>View Admins</th>
      </tr>
    </thead>
    <tbody>
      {filteredBranches.map((branch, index) => (
        <tr key={index}>
          <td>{branch.branchId}</td>
          <td>{branch.branchName}</td>
          <td>
            <VisibilityIcon
              style={{cursor:"pointer"}}
              onClick={() => handleBranchClick(branch)}
            >
             
            </VisibilityIcon>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      <Modal open={projectModal} onClose={() => setProjectModal(false)}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div
            className="modal-content p-4"
            style={{
              maxWidth: "500px",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "20px",
            }}
          >
            <h4 className="modal-title text-center">Add Branch</h4>
            <form onSubmit={handleProjectSubmit} className="mt-4">

            <div className="form-group">
                <input
                  type="text"
                  name="branchId"
                  className="form-control w-80 mb-3"
                  placeholder="Branch Id"
                  onChange={handleProjectChange}
                  value={branchData.branchId}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="branchName"
                  className="form-control w-80 mb-3"
                  placeholder="Branch Name"
                  onChange={handleProjectChange}
                  value={branchData.branchName}
                  required
                />
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-secondary mt-3"
                  style={{
                    borderRadius: "20px",
                    marginRight: "20px",
                    width: "150px",
                  }}
                  onClick={() => setProjectModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  style={{
                    borderRadius: "20px",
                    background: "#4f0e83",
                    width: "150px",
                  }}
                >
                  Add Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Deparments;
