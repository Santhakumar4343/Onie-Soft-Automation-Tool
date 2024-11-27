import { Modal } from "@mui/material";

import {
  addProject,
  assignProjects,
  getAllProject,
  getBranchById,
  getProjectsByBranchId,
  getProjectUsers,
  unAssignUsers,
  unMapRegisters,
} from "../API/Api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import GroupIcon from "@mui/icons-material/Group";
import { errorNotify, notify } from "../../NotificationUtil";
const Projects = () => {
  const [projectModal, setProjectModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userIds, setUserIds] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const branchId = user.branchId;
  const [projectData, setProjectData] = useState({
    projectName: "",
    projectDir: "",
    branchId: branchId,
  });
  const [users, setUsers] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);
  const [showRemove, setShowRemove] = useState(false);
  const confirmRemoveUser = (registerId) => {
    setShowRemove(false)
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this user from the project?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveUserFromProject(registerId);
        Swal.fire("Removed!", "The user has been removed.", "success");
      }
    });
  };
  
  const handleRemoveUserFromProject = (registerId) => {
    unAssignUsers(projectId, registerId)
      .then(() => {
        setProjectUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== registerId)
        );
        console.log(`User with ID ${registerId} removed successfully.`);
      })
      .catch((err) => {
        console.error("Error removing user:", err);
        Swal.fire("Error", "Unable to remove the user. Please try again.", "error");
      });
  };
  const handleShowRemove = (id) => {
    setProjectId(id);
    setShowRemove(true);
  };
  useEffect(() => {
    if (projectId) {
      // Fetch users only when a valid projectId is set
      getProjectUsers(projectId)
        .then((response) => setProjectUsers(response.data))
        .catch((err) => console.error("Error fetching project users:", err));
    }
  }, [projectId]); // Add projectId as a dependency

  const [branchName, setBranchName] = useState();
  useEffect(() => {
    getBranchById(user.branchId).then((response) =>
      setBranchName(response.data.branchName)
    );
  }, [user.branchId]);
   
  useEffect(() => {
    if (projectId) {
      unMapRegisters(projectId, branchId)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((err) => console.error(err));
    }
  }, [projectId, branchId]);
  const handleShow = (id) => {
    setProjectId(id);
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  useEffect(() => {
    getProjectsByBranchId(branchId)
      .then((response) => setProjects(response.data))
      .catch((err) => console.log(err));
  }, [branchId]);
  const [projects, setProjects] = useState([]);

  const handleProject = () => {
    setProjectModal(true);
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    addProject(projectData)
      .then((response) => {
        // Show success alert when request is successful
        Swal.fire({
          icon: "success",
          title: "Project Saved",
          text: "Your project has been Created successfully!",
        });
        console.log(response);
        window.location.reload();
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
    setProjectData({ projectName: "", branchId });
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
  const handleUserSelect = (e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setUserIds((prevIds) => Array.from(new Set([...prevIds, ...selectedIds])));
  };

  const handleCancel = () => {
    setProjectId("");
    setUserIds([]); // reset selection on cancel
    setShowModal(false);
  };

  const handleCancelRemove = () => {
    setProjectId("");
    setShowRemove(false);
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
      setProjectId("");
      setUserIds([]); // reset selection on cancel
    }
  };
  return (
    <div className="container-fluid ">
      <h2 className="text-center" style={{ color: "#4f0e83" }}>
        {branchName} - Projects
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
          Add Project
        </button>
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
              <div
                className="card-footer d-flex justify-content-center align-items-center"
                style={{ gap: "20px" }}
              >
                <PersonAddIcon
                  className="w-40 "
                  style={{ color: "white", fontSize: "30" }}
                  onClick={() => handleShow(project.id)}
                />
                <PersonRemoveIcon
                  style={{ color: "white", fontSize: "30" }}
                  onClick={() => handleShowRemove(project.id)}
                />
               
              </div>
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
                  {users
                    .filter((user) => user.empRole.toLowerCase() === "user")
                    .map((user) => (
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
              <div>
                <h5 className="mt-5">Assigned Users:</h5>
                {projectUsers.map((user) => (
                  <li key={user.id}>{user.empName}</li>
                ))}
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <Modal open={showRemove} onClose={handleCancelRemove}>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "90vh",
    }}
  >
    <div
      className="modal-content p-4"
      style={{
        maxWidth: "450px",
        height: "500px",
        width: "100%",
        backgroundColor: "white",
        borderRadius: "20px",
        position: "relative",
      }}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={handleCancelRemove}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        &#10005; {/* X Icon */}
      </button>

      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <h5 className="mt-5">Assigned Users:</h5>
          <ul>
            {projectUsers.map((user) => (
              <li
                key={user.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span>{user.empName}</span>
                <PersonRemoveIcon
                  style={{
                    color: "red",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => confirmRemoveUser(user.id)} // Confirmation popup
                />
              </li>
            ))}
          </ul>
        </div>
        {/* Cancel Button */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            style={{
              borderRadius: "20px",
              width: "150px",
            }}
            onClick={handleCancelRemove}
          >
            Cancel
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
              <div className="form-group">
                <input
                  type="text"
                  name="projectDir"
                  className="form-control w-80 mb-3"
                  placeholder="Project Directory"
                  onChange={handleProjectChange}
                  value={projectData.projectDir}
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
