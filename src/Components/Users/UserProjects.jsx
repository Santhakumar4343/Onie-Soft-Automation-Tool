import { Modal } from "@mui/material";
import axios from "axios";
import { assignProjects, getAssignedUserProjects, getProjectUsers } from "../API/Api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../API/Api";
import Swal from "sweetalert2";
import { getAllRegister } from "../API/Api";

import { errorNotify, notify } from "../../NotificationUtil";
const UserProjects = () => {
  const [projectModal, setProjectModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userIds, setUserIds] = useState([]);
  const [assignedUser,setAssigneUser]=useState([])

  useEffect(()=>{
    getProjectUsers().then(response=>set)
  },[])
  const [projectData, setProjectData] = useState({
    projectName: "",
  });
  const [users, setUsers] = useState([]);
  const [projectId,setProjectId]=useState("");
   const user=JSON.parse(sessionStorage.getItem("user"));
  useEffect(() => {
    getAllRegister()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleShow = (id) => {
   setProjectId(id);
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  useEffect(() => {
    getAssignedUserProjects(user.id)
      .then((response) => setProjects(response.data))
      .catch((err) => console.log(err));
  }, [user.id]);
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
    navigate(`/userDashboard/testcases/${project.id}`, { state: { project } });
  };
  const handleUserSelect = (e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setUserIds(selectedIds); 
  };
  const handleCancel = () => {
    setProjectId("")
    setUserIds([]); 
    setShowModal(false);
  };

  const handleRemoveUser = (id) => {
    setUserIds(userIds.filter((userId) => userId !== id)); // remove user ID from the array
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare the data to be sent
    const formData = {
      projectId: projectId,
      registerIds: userIds, // Ensure `userIds` is an array of selected IDs
    };
  
    try {
      const result = await assignProjects(formData);
      notify("Users Assigned SuccessFully");
    } catch (error) {
      console.error("Error assigning users:", error);
      errorNotify("Something Went Wrong");
    } finally {
      setShowModal(false);
      setProjectId("")
      setUserIds([]); // reset selection on cancel
    }
  };
  return (
    <div className="container-fluid ">
      <h2 className="text-center" style={{ color: "#4f0e83" }}>
        Projects
      </h2>
      <div className="d-flex justify-content-end mb-4">
        {/* <button
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
        </button> */}
        <input
          type="text"
          value={searchText}
          placeholder="Search by Project Name"
          className="form-control "
          style={{ width: "40%" }}
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
              {/* <div
                className="card-footer d-flex justify-content-center align-items-center"
                style={{ gap: "20px" }}
              >
                <PersonAddIcon
                  className="w-40 "
                  style={{ color: "white", fontSize: "30" }}
                  onClick={()=>handleShow(project.id)}
                />
                <PersonRemoveIcon style={{ color: "white", fontSize: "30" }} />
                <GroupIcon style={{ color: "white", fontSize: "30" }} />
              </div> */}
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={handleCancel}>
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
              height: "600px",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "20px",
            }}
          >
            <h4 className="modal-title text-center">Assign User</h4>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="form-group">
                <select
                  id="userSelect"
                  className="form-control"
                  multiple
                  value={userIds} // bind to the selected user IDs
                  onChange={handleUserSelect} // update userIds on change
                >
                  <option value="" disabled>
                    -- Select Users --
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.empName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-primary mt-3"
                  style={{
                    borderRadius: "20px",
                    background: "#4f0e83",
                    marginRight: "20px",
                    width: "150px",
                  }}
                  onClick={handleCancel} // reset and close modal
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
              {/* Display selected users */}
              <div className="selected-users mt-3">
                <h5>Selected Users:</h5>
                <ul>
                  {userIds.map((userId) => {
                    const selectedUser = users.find(
                      (user) => user.id === Number(userId)
                     
                    );
                    return (
                      <li
                        key={userId}
                        style={{
                          display: "flex",
                          justifyContent: "flex-start", // Align the content to the left
                          alignItems: "center",
                          gap: "8px", // Add a small gap between the username and the delete button
                        }}
                      >
                        <span>
                          {selectedUser
                            ? selectedUser.empName
                            : "User not found"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveUser(userId)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "red",
                            cursor: "pointer",
                          }}
                        >
                          &#10005; {/* 'X' symbol */}
                        </button>
                      </li>
                    );
                  })}
                </ul>
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

export default UserProjects;
