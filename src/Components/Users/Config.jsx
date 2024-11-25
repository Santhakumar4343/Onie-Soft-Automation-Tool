import { useEffect, useState } from "react";

import { Button, Modal, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import swal from "sweetalert2";
import {
  addProject,
  deleteProjectById,
  getAssignedUserProjects,
  updateProject,
} from "../API/Api";

const Config = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [modalData, setModalData] = useState({
    projectName: "",
    ipAddress: "",
    projectDir: "",
  });
  const [isEditMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [user.id]);

  const fetchProjects = () => {
    getAssignedUserProjects(user.id)
      .then((response) => setProjects(response.data))
      .catch((err) => console.log(err));
  };

  const openModal = (project = null) => {
    if (project) {
      setModalData(project);
      setEditMode(true);
    } else {
      setModalData({ projectName: "", ipAddress: "", projectDir: "" });
      setEditMode(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData({ projectName: "", ipAddress: "", projectDir: "" });
  };

  const clearModal = () => {
    setModalData({ projectName: "", ipAddress: "", projectDir: "" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Update Project
      const data={
        id:modalData.id,
        projectName:modalData.projectName,
        ipAddress:modalData.ipAddress,
        projectDir:modalData.projectDir
      }
      updateProject( data)
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
        <h3>Project Configurations</h3>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openModal()}
          style={{
            height: "40px",
            color: "white",
            backgroundColor: "#4f0e83",
            width: "13%",
            borderRadius: "20px",
          }}
        >
          Add Project
        </Button>
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
                <td>{project.projectDir}</td>
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
                  value={modalData.projectDir}
                  onChange={(e) =>
                    setModalData({ ...modalData, projectDir: e.target.value })
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
