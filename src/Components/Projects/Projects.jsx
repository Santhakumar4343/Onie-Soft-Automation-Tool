import { Modal, Tooltip } from "@mui/material";

import {
  addProject,
  assignProjects,
  getBranchById,
  getProjectsByBranchId,
  getProjectUsers,
  unAssignUsers,
  unMapRegisters,
  updateProject,
} from "../API/Api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

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
    branchId: branchId,
    url: "",
    apiBaseURL: "",
    basicAuth: false,
    basicAuthUser: "",
    basicAuthPassword: "",
    enableLiveReporting: false,
    elasticSearchURL: "",
    notifyTeams: false,
    notifyBlockerCount: 0,
    notifyCriticalCount: 0,
    notifyMajorCount: 0,
    sendEmailReport: false,
    emailReportTo: "",
    jiraUserName: "",
    jiraPassword: "",
    jiraURL: "",
    jiraProjectKey: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const handleClearProject = () => {
    setProjectData({
      projectName: "",
    });
  };

  const [users, setUsers] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);
  const [showRemove, setShowRemove] = useState(false);
  const confirmRemoveUser = (registerId) => {
    setShowRemove(false);
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
        Swal.fire(
          "Error",
          "Unable to remove the user. Please try again.",
          "error"
        );
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
    setIsEditMode(false); // Reset to Add mode
    setProjectData({ projectName: "", branchId: "" });
  };

  const handleEditClick = (projectId = null) => {
    if (projectId) {
      const projectToEdit = filteredProjects.find((p) => p.id === projectId);
      if (projectToEdit) {
        setProjectData({
          ...projectData,
          ...projectToEdit, // Populate all fields from the project to edit
        });
        setIsEditMode(true);
        setProjectModal(true);
      }
    }
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      // Update existing project
      const updateData = {
        id: projectData.id,
        projectName: projectData.projectName,
        branchId: branchId,
        url: projectData.url,
        apiBaseURL: projectData.apiBaseURL,
        basicAuth: projectData.basicAuth,
        basicAuthUser: projectData.basicAuthUser,
        basicAuthPassword: projectData.basicAuthPassword,
        enableLiveReporting: projectData.enableLiveReporting,
        elasticSearchURL: projectData.elasticSearchURL,
        notifyTeams: projectData.notifyTeams,
        notifyBlockerCount: projectData.notifyBlockerCount,
        notifyCriticalCount: projectData.notifyCriticalCount,
        notifyMajorCount: projectData.notifyMajorCount,
        sendEmailReport: projectData.sendEmailReport,
        emailReportTo: projectData.emailReportTo,
        jiraUserName: projectData.jiraUserName,
        jiraPassword: projectData.jiraPassword,
        jiraURL: projectData.jiraURL,
        jiraProjectKey: projectData.jiraProjectKey,
      };
      updateProject(updateData)
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Project Updated",
            text: "Your project has been updated successfully!",
          });
          setProjects((prev) =>
            prev.map((project) =>
              project.id === response.data.id ? response.data : project
            )
          ); // Update the project in the state
          console.log(response);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! Could not update the project.",
          });
          console.log(err);
        });
    } else {
      // Add new project
      const addData = {
        projectName: projectData.projectName,
        branchId: branchId,
      };
      addProject(addData)
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Project Saved",
            text: "Your project has been created successfully!",
          });
          setProjects((prev) => [...prev, response.data]); // Add the new project to the state
          console.log(response);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! Could not create the project.",
          });
          console.log(err);
        });
    }

    setProjectModal(false);
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
  const handleCancelProject = () => {
    setProjectId("");
    setProjectModal(false);
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
      <h4 className="text-center" style={{ color: "#4f0e83" }}>
        {branchName} - Projects
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
                <Tooltip title="Add User" arrow placement="bottom">
                  <PersonAddIcon
                    className="w-40 "
                    style={{ color: "white", fontSize: "30" }}
                    onClick={() => handleShow(project.id)}
                  />
                </Tooltip>
                <Tooltip title="Remove User" arrow placement="bottom">
                  <PersonRemoveIcon
                    style={{ color: "white", fontSize: "30" }}
                    onClick={() => handleShowRemove(project.id)}
                  />
                </Tooltip>
                <Tooltip title="Edit" arrow placement="bottom">
                  <EditIcon
                    style={{ color: "white", fontSize: "28" }}
                    onClick={() => handleEditClick(project.id)}
                  />
                </Tooltip>
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
                <h4 className="text-center">Remove User from Project</h4>
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
              maxWidth: "700px",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "20px",
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCancelProject}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "25px",
                cursor: "pointer",
              }}
            >
              &#10005;
            </button>
            <h4> {isEditMode ? "Update Project" : "Add Project"}</h4>
            <form onSubmit={handleProjectSubmit} className="mt-4">
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {/* Project Name */}
                <div className="form-group" style={{ flex: "1 1 45%" }}>
                  <input
                    type="text"
                    name="projectName"
                    className="form-control"
                    placeholder="Project Name"
                    onChange={handleProjectChange}
                    value={projectData.projectName}
                    required
                  />
                </div>
              </div>
              {/* URL */}
             
                <div style={{ display: "flex", gap: "20px" }}>
                  <div className="form-group mt-3" style={{ flex: "1 1 45%" }}>
                    <input
                      type="text"
                      name="url"
                      className="form-control"
                      placeholder="Project URL"
                      onChange={handleProjectChange}
                      value={projectData.url}
                    />
                  </div>
                  <div className="form-group mt-3" style={{ flex: "1 1 45%" }}>
                    <input
                      type="text"
                      name="apiBaseURL"
                      className="form-control"
                      placeholder="Project API Base URL"
                      onChange={handleProjectChange}
                      value={projectData.apiBaseURL}
                    />
                  </div>
                </div>
              

              {/* Basic Auth Configuration */}
              
                <div style={{ marginTop: "20px" }}>
                  <div
                    className="form-group"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      name="basicAuth"
                      checked={projectData.basicAuth}
                      onChange={(e) =>
                        handleProjectChange({
                          target: {
                            name: "basicAuth",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <label style={{ marginLeft: "10px" }}>
                      Basic Auth
                    </label>
                  </div>

                  {projectData.basicAuth && (
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap",
                        marginTop: "10px",
                      }}
                    >
                      <div className="form-group" style={{ flex: "1 1 45%" }}>
                        <input
                          type="text"
                          name="basicAuthUser"
                          className="form-control"
                          placeholder="Basic Auth User"
                          onChange={handleProjectChange}
                          value={projectData.basicAuthUser}
                        />
                      </div>
                      <div className="form-group" style={{ flex: "1 1 45%" }}>
                        <input
                          type="password"
                          name="basicAuthPassword"
                          className="form-control"
                          placeholder="Basic Auth Password"
                          onChange={handleProjectChange}
                          value={projectData.basicAuthPassword}
                        />
                      </div>
                    </div>
                  )}
                </div>
              

              {/* Enable Live Reporting */}
             
                <div style={{ marginTop: "20px" }}>
                  <div
                    className="form-group"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      name="enableLiveReporting"
                      checked={projectData.enableLiveReporting}
                      onChange={(e) =>
                        handleProjectChange({
                          target: {
                            name: "enableLiveReporting",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <label style={{ marginLeft: "10px" }}>
                     Live Reporting
                    </label>
                  </div>

                  {projectData.enableLiveReporting && (
                    <div className="form-group" style={{ marginTop: "10px" }}>
                      <input
                        type="text"
                        name="elasticSearchURL"
                        className="form-control"
                        placeholder="Elastic Search URL"
                        onChange={handleProjectChange}
                        value={projectData.elasticSearchURL}
                      />
                    </div>
                  )}
                </div>
              

              {/* Notify Teams */}
             
                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                  <div
                    className="form-group"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      name="notifyTeams"
                      checked={projectData.notifyTeams}
                      onChange={(e) =>
                        handleProjectChange({
                          target: {
                            name: "notifyTeams",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <label style={{ marginLeft: "10px" }}>Notify Via Teams</label>
                  </div>

                  {projectData.notifyTeams && (
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap",
                        marginTop: "10px",
                      }}
                    >
                      <div className="form-group" style={{ flex: "1 1 30%" }}>
                        <input
                          type="number"
                          name="notifyBlockerCount"
                          className="form-control"
                          placeholder="Notify Blocker Count"
                          onChange={handleProjectChange}
                          value={projectData.notifyBlockerCount}
                        />
                      </div>

                      <div className="form-group" style={{ flex: "1 1 30%" }}>
                        <input
                          type="number"
                          name="notifyCriticalCount"
                          className="form-control"
                          placeholder="Notify Critical Count"
                          onChange={handleProjectChange}
                          value={projectData.notifyCriticalCount}
                        />
                      </div>

                      <div className="form-group" style={{ flex: "1 1 30%" }}>
                        <input
                          type="number"
                          name="notifyMajorCount"
                          className="form-control"
                          placeholder="Notify Major Count"
                          onChange={handleProjectChange}
                          value={projectData.notifyMajorCount}
                        />
                      </div>
                    </div>
                  )}
                </div>
              

             
                <div>
                  <div className="form-group d-flex align-items-center">
                    <input
                      type="checkbox"
                      name="sendEmailReport"
                      onChange={(e) =>
                        handleProjectChange({
                          target: {
                            name: "sendEmailReport",
                            value: e.target.checked,
                          },
                        })
                      }
                      checked={projectData.sendEmailReport}
                    />
                    <label style={{ marginRight: "20px", marginLeft: "10px" }}>
                      Email Report
                    </label>
                  </div>

                  {projectData.sendEmailReport && (
                    <div className="form-group" style={{ marginTop: "10px" }}>
                      <input
                        type="text"
                        name="emailReportTo"
                        className="form-control"
                        placeholder="Email Addresses (comma-separated)"
                        onChange={handleProjectChange}
                        value={projectData.emailReportTo}
                      />
                    </div>
                  )}
                </div>
              

              
                <div className="mt-4">
                  {/* JIRA Configuration */}
                 

                  
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap",
                        marginTop: "5px",
                      }}
                    >
                      <div className="form-group" style={{ flex: "1 1 45%" }}>
                        <input
                          type="text"
                          name="jiraUserName"
                          className="form-control mb-2"
                          placeholder="JIRA Username"
                          onChange={handleProjectChange}
                          value={projectData.jiraUserName}
                        />
                      </div>
                      <div className="form-group" style={{ flex: "1 1 45%" }}>
                        <input
                          type="password"
                          name="jiraPassword"
                          className="form-control mb-2"
                          placeholder="JIRA Password"
                          onChange={handleProjectChange}
                          value={projectData.jiraPassword}
                        />
                      </div>
                      <div className="form-group" style={{ flex: "1 1 45%" }}>
                        <input
                          type="text"
                          name="jiraURL"
                          className="form-control mb-2"
                          placeholder="JIRA URL"
                          onChange={handleProjectChange}
                          value={projectData.jiraURL}
                        />
                      </div>
                      <div className="form-group" style={{ flex: "1 1 45%" }}>
                        <input
                          type="text"
                          name="jiraProjectKey"
                          className="form-control"
                          placeholder="JIRA Project Key"
                          onChange={handleProjectChange}
                          value={projectData.jiraProjectKey}
                        />
                      </div>
                    </div>
                  
                </div>
              
              <div className="text-center">
                <button
                  className="btn btn-secondary mt-3"
                  style={{
                    borderRadius: "20px",
                    marginRight: "20px",
                    width: "150px",
                  }}
                  onClick={handleClearProject}
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
                  {isEditMode ? "Update Project" : "Add Project"}
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
