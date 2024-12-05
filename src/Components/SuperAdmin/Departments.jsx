import { Modal, Tab, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { createBranch, getAllBranchesByCompany, updateBranch } from "../API/Api";
import { useLocation, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TablePagination from "../Pagination/TablePagination";
const Deparments = () => {
  const [projectModal, setProjectModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [branches, setBranches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const location = useLocation();
  const company = location.state?.company || {};

  
  const navigate = useNavigate();
  const [branchData, setBranchData] = useState({
    branchName: "",
    branchId: "",
  });

  const handleBranchClick = (branch) => {
    navigate("/adminDashboard/admins", { state: { branch,company} });
  };
 const handleBackwardClick=()=>{
    navigate("/adminDashboard/companies")
 }
  const handleProject = () => {
    setProjectModal(true);
    setIsEditing(false); // Reset to Add mode
    setBranchData({ branchName: "", branchId: "" });
  };

  const handleEditClick = (branch) => {
    setIsEditing(true);
    setSelectedBranch(branch); // Set the branch to edit
    setBranchData({ branchName: branch.branchName, branchId: branch.branchId });
    setProjectModal(true);
  };

  
  const [page, setPage] = useState(1); // Current page number

  const [itemsPerPage, setItemsPerPage] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(0); // To store total number of pages
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage + 1); // Since pagination is 1-indexed
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setPage(1); // Reset to first page on page size change
  };
  useEffect(() => {
    getAllBranchesByCompany(company.id,page-1,itemsPerPage)
      .then((response) => {
        setBranches(response.data.content);
        setTotalPages(response.data.totalPages)
      })
      .catch((err) => console.log(err));
  }, [company.id,page-1,itemsPerPage]);

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update Branch
      const updatedBranch = {
        id:selectedBranch.id,
        branchName: branchData.branchName,
        branchId: branchData.branchId,
        cmpId: company.cmpId,
      };
      updateBranch( updatedBranch) // Call update API
        .then((response) => {
          if (response.status === 200) {
            setBranches((prev) =>
              prev.map((branch) =>
                branch.id === selectedBranch.id ? response.data : branch
              )
            );
            Swal.fire({
              icon: "success",
              title: "Branch Updated",
              text: "Branch details updated successfully!",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "Could not update branch details.",
          });
        });
    } else {
      // Add Branch
      const data = {
        branchName: branchData.branchName,
        branchId: branchData.branchId,
        cmpId: company.id,
      };
      createBranch(data)
        .then((response) => {
          if (response.status === 201) {
            setBranches((prev) => [...prev, response.data]);
            Swal.fire({
              icon: "success",
              title: "Branch Saved",
              text: "Branch created successfully!",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Add Failed",
            text: "Could not create the branch.",
          });
        });
    }
    setProjectModal(false);
    setBranchData({ branchName: "", branchId: "" });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setBranchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleDeleteClick = (branchId) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "This will delete the branch permanently!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       deleteBranch(branchId)
  //         .then(() => {
  //           setBranches((prev) => prev.filter((branch) => branch.id !== branchId));
  //           Swal.fire("Deleted!", "Branch has been deleted.", "success");
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           Swal.fire("Error!", "Could not delete branch.", "error");
  //         });
  //     }
  //   });
  // };
  const filteredBranches = branches.filter(
    (company) =>
      company.branchName.toLowerCase().includes(searchText.toLowerCase()) ||
      company.branchId.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBranchClear = () => {
    setBranchData({ branchName: "", branchId: "" });
  };
  return (
    <div className="container-fluid">
      <h4 className="text-center" style={{ color: "#4f0e83" }}>
        {location.state?.company?.cmpName} - Branches
      </h4>
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

      <div
          style={{
            maxHeight: "520px",
            overflowY: "auto",
          }}
        >
          <style>
            {`
      /* Scrollbar styling for Webkit browsers (Chrome, Safari, Edge) */
      div::-webkit-scrollbar {
        width: 2px;
       
      }
      div::-webkit-scrollbar-thumb {
        background-color: #4f0e83;
        border-radius: 4px;
      }
      div::-webkit-scrollbar-track {
        background-color: #e0e0e0;
      }

      /* Scrollbar styling for Firefox */
      div {
        scrollbar-width: thin; 
        scrollbar-color: #4f0e83 #e0e0e0;   
      }
    `}
          </style>
        <table className="table  table-hover ">
          <thead>
            <tr>
              <th>Branch ID</th>
              <th>Branch Name</th>
              <th>View Admins</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBranches.map((branch, index) => (
              <tr key={index}>
                <td>{branch.branchId}</td>
                <td>{branch.branchName}</td>
                <td>
                <Tooltip title="View" arrow placement="left" >
                  <VisibilityIcon
                    style={{ cursor: "pointer",color: "#4f0e83"  }}
                    onClick={() => handleBranchClick(branch)}
                  ></VisibilityIcon>
                  </Tooltip>
                </td>
                <td>
                <Tooltip title="Edit" arrow placement="left" >
                  <EditIcon
                    style={{ cursor: "pointer", marginRight: "10px",color: "#4f0e83"  }}
                    onClick={() => handleEditClick(branch)}
                  />
                   </Tooltip>
                   <Tooltip title="Delete" arrow placement="right" >
                  <DeleteIcon
                    style={{ cursor: "pointer", color: "red" }}
                    // onClick={() => handleDeleteClick(branch.id)}
                  />
                   </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
        <Tooltip title="Back" arrow placement="right" >
          <Tab icon={<ArrowBackIcon sx={{ fontSize: "2rem" ,color:"#4f0e83"}}  onClick={handleBackwardClick}/>}  
          ></Tab>
           </Tooltip>
              
          
    
        </div>
      </div>
      <TablePagination
          currentPage={page - 1}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handlePageSizeChange={handlePageSizeChange}
        />


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
            <button
              onClick={() => setProjectModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "35px",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h4>{isEditing ? "Update Branch" : "Add Branch"}</h4>
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
                  onClick={handleBranchClear}
                >
                  Clear
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
                {isEditing ? "Update Branch" : "Add Branch"}
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
