import { useEffect, useState } from "react";

import { Button, MenuItem, Modal, Select, TextField, Tooltip } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from "@mui/icons-material/Delete";
import swal from "sweetalert2";
import {
  deleteProjectById,
  getAssignProjectsByRegId,
  getConfigsByUseId,
  updateConfig,
} from "../API/Api";
import { useNavigate } from "react-router-dom";

const Config = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [modalData, setModalData] = useState({
    projectName: "",
    ipAddress: "",
    projectPath: "",
    id: "",
  });
  const [isEditMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPorjects();
  }, [user.id]);

  useEffect(() => {
    userConfigs();
  }, [user.id]);
  const userConfigs = () => {
    getConfigsByUseId(user.id)
      .then((response) => setConfigs(response.data))
      .catch((err) => console.log(err));
  };

  const fetchPorjects = () => {
    getAssignProjectsByRegId(user.id)
      .then((response) => setProjects(response.data))
      .catch((err) => console.log(err));
  };

  const handleProjectConfig = (project) => {
    navigate("/userDashboard/configpage", { state: { project } });
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

    // Prepare the data for submission
    const data = {
      userId: user.id,
      projectId: modalData.id, // Make sure projectId is set correctly
      projectName: modalData.projectName,
      ipAddress: modalData.ipAddress,
      projectPath: modalData.projectPath,
    };

    console.log(modalData); // Log the modalData to verify

    // Call the updateConfig function with the data
    updateConfig(data)
      .then(() => {
        userConfigs();
        closeModal();
        swal.fire("Success", "Project Config added successfully!", "success");
      })
      .catch((err) => console.log(err));
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
            userConfigs();
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
      <div className="">
        {/* <Button
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
        </Button> */}
        <h4 style={{ color: "#4f0e83" ,textAlign:"center"}}>Device Configurations</h4>
        <h1></h1>
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
            {configs.map((project, index) => (
              <tr key={index}>
                <td>{project.projectName}</td>
                <td>{project.ipAddress}</td>
                <td>{project.projectPath}</td>
                <td>
                  <Tooltip title="Add Configurations"  arrow>
                  <AddCircleIcon
                    style={{ cursor: "pointer", color: "#4f0e83" }}
                    onClick={() => handleProjectConfig(project)}
                  />
                  </Tooltip>
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
                <Select
                  fullWidth
                  margin="dense"
                  value={modalData.projectName}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      projectName: e.target.value,
                      id: projects.find((p) => p.projectName === e.target.value)
                        ?.id, // Save project ID
                    })
                  }
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select a Project
                  </MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.projectName}>
                      {project.projectName}
                    </MenuItem>
                  ))}
                </Select>
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
