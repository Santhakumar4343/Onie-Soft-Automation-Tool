import { Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../API/Api";
import Swal from "sweetalert2";

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import GroupIcon from '@mui/icons-material/Group';
const Projects = () => {
  const [projectModal, setProjectModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [projectData, setProjectData] = useState({
    projectName: "",
  });
  const [users, setUsers] = useState([]);
  const jwt_token=sessionStorage.getItem("jwt_token")
  useEffect(() => {
    axios
      .get(`${API_URL}/register/v1/getallreg`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  useEffect(() => {
    axios
      .get(`${API_URL}/projects/v1/getAllProjects`,{
        headers:{
          "Authorization":`Bearer ${jwt_token}`
        }
      })
      .then((response) => setProjects(response.data))
      .catch((err) => console.log(err));
  }, []);
  const [projects, setProjects] = useState([]);

  const handleProject = () => {
    setProjectModal(true);
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/projects/v1/save`, projectData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // Show success alert when request is successful
        Swal.fire({
          icon: "success",
          title: "Project Saved",
          text: "Your project has been Created successfully!",
        });
        console.log(response);
      })
      .catch((err) => {
        // Show error alert when request fails
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Could not create the project.",
        });
        console.log(err);
      });
    setProjectModal(false);
    setProjectData({ projectName: "" });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchText.toLowerCase())
  );

  const navigate = useNavigate();
  const handleProjectClick = (project) => {
    navigate(`/dashboard/testcases/${project.id}`, { state: { project } });
  };

  return (
    <div className="container-fluid ">
      <h2 className="text-center" style={{color:"#4f0e83"}}>Projects</h2>
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
          Add Project
        </button>
        <input
          type="text"
          value={searchText}
          placeholder="Search by Project Name"
          className="form-control "
          style={{width:"40%"}}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredProjects.map((project, index) => (
          <div className="col-md-4 mb-5" key={index}>
            <div
              className="card shadow-sm project-card  d-flex"
              style={{ backgroundColor: "rgb(79 103 228)", cursor: "pointer" }}
            >
              <div
                className="card-body"
                onClick={() => handleProjectClick(project)}
              >
                <h5
                  className="card-title text-center"
                  style={{ color: "white" }}
                >
                  {project.projectName}
                </h5>
              </div>
              <div className="card-footer d-flex justify-content-center align-items-center" style={{gap:"20px"}}>
           
               < PersonAddIcon className="w-40 "
                  style={{ color:"white",fontSize:"30"}}
                  onClick={handleShow}/>
                 < PersonRemoveIcon  style={{ color:"white",fontSize:"30" }}/>
                 <GroupIcon   style={{ color:"white",fontSize:"30" }}/>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
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
            <h4 className="modal-title text-center">Assign User</h4>
            <form onSubmit={""} className="mt-4">
              <div className="form-group">
                <select
                  id="userSelect"
                  className="form-control"
                  onChange={(e) => {
                    const selectedUser = users.find(
                      (user) => user.empName === e.target.value
                    );
                    console.log("Selected user:", selectedUser);
                  }}
                >
                  <option value="" disabled selected>
                    -- Select a User --
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.empName}>
                      {user.empName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary mt-3 "
                  style={{
                    borderRadius: "20px",
                    background: "#4f0e83",
                    marginRight: "20px",
                    width: "150px",
                  }}
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary mt-3 w-20"
                  style={{
                    borderRadius: "20px",
                    background: "#4f0e83",
                    width: "150px",
                  }}
                >
                  Assign User
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

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
            <h4 className="modal-title text-center">Add Project</h4>
            <form onSubmit={handleProjectSubmit} className="mt-4">
              <div className="form-group">
                <input
                  type="text"
                  name="projectName"
                  className="form-control w-80 mb-3"
                  placeholder="Project Name"
                  onChange={handleProjectChange}
                  value={projectData.projectName}
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary mt-3 "
                  style={{
                    borderRadius: "20px",
                    background: "#4f0e83",
                    marginRight: "20px",
                    width: "150px",
                  }}
                  onClick={() => {
                    setProjectModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary mt-3 w-20"
                  style={{
                    borderRadius: "20px",
                    background: "#4f0e83",
                    width: "150px",
                  }}
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;
