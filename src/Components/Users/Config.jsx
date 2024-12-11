import { useEffect, useState } from "react";

import { Button, Modal, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import swal from "sweetalert2";
import {
  addProject,
  deleteProjectById,
  getAssignedUserProjects,
  getConfigDetailsForUser,
  updateConfig,
  
} from "../API/Api";
import TablePagination from "../Pagination/TablePagination";

const Config = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [modalData, setModalData] = useState({
    projectName: "",
    ipAddress: "",
    projectPath: "",
  });
  const [isEditMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [user.id]);



  const [page, setPage] = useState(1); // Current page number

  const [itemsPerPage, setItemsPerPage] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(0); // To store total number of pages


  const fetchProjects = () => {
    getConfigDetailsForUser(user.id,page-1,itemsPerPage)
      .then((response) => {setProjects(response.data.content)
    setTotalPages(response.data.totalPages)})
      .catch((err) => console.log(err));
  };


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

  const openModal = (project = null) => {
    if (project) {
      setModalData(project);
      setEditMode(true);
    } else {
      setModalData({ projectName: "", ipAddress: "", projectPath: "" });
      setEditMode(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData({ projectName: "", ipAddress: "", projectPath: "" });
  };

  const clearModal = () => {
    setModalData({ projectName: "", ipAddress: "", projectPath: "" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      
      const data={
        id:modalData.id,
        userId:user.id,
        projectId:modalData.id,
        ipAddress:modalData.ipAddress,
        projectPath:modalData.projectPath
      }
      updateConfig( data)
        .then(() => {
          fetchProjects();
          closeModal();
          swal("Success", "Project updated successfully!", "success");
        })
        .catch((err) => console.log(err));
    } else {
      // Add Project
      addProject(modalData)
        .then(() => {
          fetchProjects();
          closeModal();
          swal("Success", "Project added successfully!", "success");
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = (projectId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this project!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteProjectById(projectId)
          .then(() => {
            fetchProjects();
            swal(
              "Deleted!",
              "Project has been deleted successfully!",
              "success"
            );
          })
          .catch((err) => console.log(err));
      }
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-3">
        <h4 style={{color:"#4f0e83"}}>Device Configurations</h4>
       
      </div>
      <div
        style={{
          maxHeight: "620px",
          overflowY: "auto",
        }}
      >
        <table
          className="table table-hover mt-4"
          style={{ textAlign: "center" }}
        >
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#f8f9fa",
              zIndex: 100,
              color: "#4f0e83",
            }}
          >
            <tr>
              <th>Project Name</th>
              <th>IP Address</th>
              <th>Project Path</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <td>{project.projectName}</td>
                <td>{project.ipAddress}</td>
                <td>{project.projectPath}</td>
                <td>
                  <EditIcon
                    style={{ cursor: "pointer", color: "#4f0e83" }}
                    onClick={() => openModal(project)}
                  />
                  &nbsp;
                  <DeleteIcon
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDelete(project.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div> <TablePagination
          currentPage={page - 1}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handlePageSizeChange={handlePageSizeChange}
        /></div>
      {/* Modal */}
      <Modal open={showModal} onClose={closeModal}>
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
              maxWidth: "600px",
              height: "auto",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "20px",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "30px",
                background: "none",
                border: "none",
                fontSize: "35px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              ×
            </button>

            {/* Modal Header */}
            <h4 className="modal-title text-center">
              {isEditMode ? "Edit Project" : "Add Project"}
            </h4>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="form-group">
                <TextField
                  fullWidth
                  margin="dense"
                  label="Project Name"
                  value={modalData.projectName}
                  onChange={(e) =>
                    setModalData({ ...modalData, projectName: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <TextField
                  fullWidth
                  margin="dense"
                  label="IP Address"
                  value={modalData.ipAddress}
                  onChange={(e) =>
                    setModalData({ ...modalData, ipAddress: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <TextField
                  fullWidth
                  margin="dense"
                  label="Project Path"
                  value={modalData.projectPath}
                  onChange={(e) =>
                    setModalData({ ...modalData, projectPath: e.target.value })
                  }
                />
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Button
                  onClick={clearModal}
                  variant="outlined"
                  color="secondary"
                  style={{
                    height: "40px",
                    color: "white",
                    backgroundColor: "#4f0e83",
                    width: "20%",
                    borderRadius: "20px",
                    marginRight: "20px",
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    height: "40px",
                    color: "white",
                    backgroundColor: "#4f0e83",
                    width: "20%",
                    borderRadius: "20px",
                  }}
                >
                  {isEditMode ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Config;