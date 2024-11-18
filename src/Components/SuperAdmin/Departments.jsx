import { Modal } from "@mui/material";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { createBranch,  getAllBranches, getAllCompany } from "../API/Api";

const Deparments = () => {
  const [projectModal, setProjectModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [branches, setBranches] = useState([]);
  const [companies,setCompanies]=useState([]);
  const [branchData, setBranchData] = useState({
    branchName: "",
    branchId: "",
    cmpId: "",
  });

   useEffect(()=>{
    getAllCompany().then(response=>setCompanies(response.data)).catch(err=> console.log(err));
   },[])
  const handleProject = () => {
    setProjectModal(true);
  };

  useEffect(() => {
    getAllBranches()
      .then((response) => {
        setBranches(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    createBranch(branchData)
      .then((response) => {
       
        Swal.fire({
          icon: "success",
          title: "Branch Saved",
          text: "Your Branch has been Created successfully!",
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Could not create the Branch.",
        });
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
        Branches
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

      <div className="row">
        {filteredBranches.map((company, index) => (
          <div className="col-md-4 mb-5" key={index}>
            <div
              className="card shadow-sm project-card d-flex"
              style={{ backgroundColor: "rgb(79 103 228)", cursor: "pointer" }}
            >
              <div className="card-body">
                <h5
                  className="card-title text-center"
                  style={{ color: "white" }}
                >
                  {company.branchName}
                </h5>
              </div>
            </div>
          </div>
        ))}
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


              <div className="form-group">

                <select className="form-control"
                name="cmpId"
                value={branchData.cmpId || ""}
                onChange={handleProjectChange}
                required>

                  <option>---select company---</option>
                  {
                    companies.map(company=>(
                      <option key={company.id}  value={company.id}>{company.cmpName}</option>
                    ))
                  }
                </select>
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
