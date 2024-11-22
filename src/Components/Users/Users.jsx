import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import axios from "axios";
import {
  addRegister,
  API_URL,
  assignProjects,
  assignUser,
  getAllRegister,
  getUnMapProjects,
  updateRegister,
} from "../API/Api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { errorNotify, notify } from "../../NotificationUtil";
import Projects from "../Projects/Projects";
import { useLocation } from "react-router-dom";
import { ConstructionOutlined } from "@mui/icons-material";
const Users = () => {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [projectIds, setProjectIds] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const branchId = user.branchId;
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading,isLoading]=useState(false);
  const [formData, setFormData] = useState({
    empId: "",
    empName: "",
    empEmail: "",
    empMob: "",
    empRole: "User",
    empDepartment: "",
    branchId: branchId,
    status: true,
    password: "",
  });
 const location=useLocation();
 const projectId=location.state||"";
 console.log(projectId)
  useEffect(() => {
    if (userId) {
      getUnMapProjects(userId, branchId).then((response) =>
        setProjects(response.data).catch((err) => console.log(err))
      );
    }
  }, [userId, branchId]);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setEditingUser(null);
    setFormData({
      empId: "",
      empName: "",
      empEmail: "",
      empMob: "",
      empRole: "",
      empDepartment: "",
      status: true,
      password: "",
    });
    setShow(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    getAllRegister()
      .then((response) => setUsers(response.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSaveUser = async () => {
    const data={
      empId: formData.empId,
      empName: formData.empName,
      empEmail: formData.empEmail,
      empMob: formData.empMob,
      empRole: formData.empRole,
      empDepartment: formData.empDepartment,
      status: true,
      password: formData.password,
      branchId: branchId,
    }
    try {
      if (editingUser) {
        // Update user
        isLoading(true)
        await updateRegister(data);
      } else {
        isLoading(true)
        await addRegister(data);
      }
      handleClose();
      // Refresh users list
      const updatedUsers = await getAllRegister();
      setUsers(updatedUsers.data);
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData(user);
    handleShow();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/register/v1/delete/${userId}`);
        // Refresh users list after deletion
        const updatedUsers = await getAllRegister();
        setUsers(updatedUsers.data);
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCancel = () => {
    setShowModal(false);
    setProjectIds([]);
  };
  const handleShowProjectModal = (id) => {
    setUserId(id);
    setShowModal(true);
  };

  const handleRemoveUser = (id) => {
    setProjectIds(projectIds.filter((userId) => userId !== id)); // remove user ID from the array
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare the data to be sent for project assignment
    const formData = {
        registerId: userId,
      projectIds: projectIds,
    };
    console.log("form data",formData)
    try {
      // Call the API to assign projects to the user
      const result = await assignUser(formData);
      notify("Projects Assigned Successfully");
    } catch (error) {
      console.error("Error assigning Projects:", error);
      errorNotify("Something Went Wrong");
    } finally {
      setShowModal(false);
      setProjectIds([]); // Reset project selection
    }
  };

  const handleUserSelect = (e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setProjectIds((prevIds) =>
      Array.from(new Set([...prevIds, ...selectedIds]))
    );
  };
  const onlyUsers=users.filter(user=>user.empRole.toLowerCase()==="user")
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="primary"
          onClick={handleShow}
          style={{
            height: "40px",
            color: "white",
            backgroundColor: "#4f0e83",
            width: "10%",
            borderRadius: "20px",
          }}
        >
          Add User
        </Button>
        <InputGroup className="w-50">
          <FormControl
            placeholder="Search users"
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      <Table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>

            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Role</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {onlyUsers
            .filter((user) =>
              user.empName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>

                <td>{user.empName}</td>
                <td>{user.empEmail}</td>
                <td>{user.empMob}</td>
                <td>{user.empRole}</td>
                <td>{user.empDepartment}</td>
                <td>
                  <AddCircleIcon
                    className=" me-3"
                    style={{ cursor: "pointer", color: "#4f0e83" }}
                    onClick={() => handleShowProjectModal(user.id)}
                  />
                  <EditIcon
                    className=" me-3"
                    style={{ cursor: "pointer", color: "#4f0e83" }}
                    onClick={() => handleEditUser(user)}
                  />
                  <DeleteIcon
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteUser(user.id)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Modal show={showModal} onClose={handleCancel}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <div
            className="modal-content p-4"
            style={{
              maxWidth: "600px",
              height: "500px",
              width: "100%",
              backgroundColor: "white",
            }}
          >
            <h4 className="modal-title text-center">Assign Project</h4>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="form-group">
                <select
                  id="userSelect"
                  className="form-control"
                  multiple
                  value={projectIds} // bind to the selected user IDs
                  onChange={handleUserSelect} // update projectIds on change
                >
                  <option value="" disabled>
                    -- Select Projects --
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.projectName}
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
                  Assign Project
                </button>
              </div>
              {/* Display selected users */}
              <div className="selected-users mt-3">
                <h5>Selected Projects:</h5>
                <ul>
                  {projectIds.map((userId) => {
                    const selectedUser = projects.find(
                      (project) => project.id === Number(userId)
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
                            ? selectedUser.projectName
                            : "Project not found"}
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? "Update  User" : "Add New User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="empName">
              <Form.Control
                type="text"
                name="empName"
                placeholder="Employee Name"
                className="mb-3"
                value={formData.empName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="empEmail">
              <Form.Control
                type="email"
                name="empEmail"
                placeholder="Employee Email"
                className="mb-3"
                value={formData.empEmail}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="empMob">
              <Form.Control
                type="text"
                name="empMob"
                placeholder="Mobile Number"
                className="mb-3"
                value={formData.empMob}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="empDepartment">
              <Form.Control
                type="text"
                name="empDepartment"
                placeholder="Department"
                className="mb-3"
                value={formData.empDepartment}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                className="mb-3"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center align-items-center">
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{
              height: "40px",
              color: "white",
              backgroundColor: "#4f0e83",
              width: "20%",
              borderRadius: "20px",
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveUser}
            disabled={loading}
            style={{
              height: "40px",
              color: "white",
              backgroundColor: "#4f0e83",
              width: "35%",
              borderRadius: "20px",
            }}
          >
            {loading ? (
            <span>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 
              {editingUser ? " Updating..." : " Saving..."}
            </span>
          ) : (
            editingUser ? "Update User" : "Save User"
          )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
