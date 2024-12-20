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
  deleteRegister,
  getAllRegister,
  getAssignedUserProjects,
  getRegisterForBranch,
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
import Swal from "sweetalert2";
import { Tooltip } from "@mui/material";
import TablePagination from "../Pagination/TablePagination";
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
  const [userProjects,setUserProjects]=useState([]);
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

 const handllClear=()=>{
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
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [page, setPage] = useState(1); // Current page number

  const [itemsPerPage, setItemsPerPage] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(0); // To store total number of pages

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
    getRegisterForBranch(branchId,page-1,itemsPerPage)
      .then((response) => {
        setUsers(response.data.content)
      setTotalPages(response.data.totalPages)}).catch((err) => console.log(err));
  }, [branchId,page,itemsPerPage]);

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
      isLoading(true); // Show loading indicator
    
      if (editingUser) {
        // Update user
        await updateRegister(data)
          .then((response) => {
            if (response.status === 200 || response.status === 201) {
              Swal.fire("Success!", "User updated successfully.", "success");
              setUsers(prev=>[...prev,response.data])
              isLoading(false)
            } else {
              Swal.fire("Error!", "Failed to update user.", "error");
            }
          })
          .catch((error) => {
            console.error("Error updating user:", error);
            Swal.fire("Error!", "An unexpected error occurred.", "error");
          });
      } else {
        // Add new user
        await addRegister(data)
          .then((response) => {
            if (response.status === 200 || response.status === 201) {
              Swal.fire("Success!", "User added successfully.", "success");
              setUsers(prev=>[...prev,response.data])
              isLoading(false)
            } else {
              Swal.fire("Error!", "Failed to add user.", "error");
            }
          })
          .catch((error) => {
            console.error("Error adding user:", error);
            Swal.fire("Error!", "An unexpected error occurred.", "error");
          });
      }
    
      handleClose(); // Close modal or reset form
    
    
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire("Error!", "An unexpected error occurred. Please try again.", "error");
    } finally {
      isLoading(false); // Hide loading indicator
    }
  }    

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData(user);
    handleShow();
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this user? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  
    if (result.isConfirmed) {
      try {
        await deleteRegister(userId);
        // Refresh users list after deletion
        const updatedUsers = await getAllRegister();
        setUsers(updatedUsers.data);
  
        // Success alert
        Swal.fire("Deleted!", "The user has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete user", error);
        // Error alert
        Swal.fire("Error!", "Failed to delete the user. Please try again.", "error");
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
   useEffect(()=>{
    getAssignedUserProjects(userId).then(response=>setUserProjects(response.data)).catch(err=>console.log(err))
   },[userId])
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
  const onlyUsers=users.filter(user=>user.empRole.toLowerCase()==="user"&&user.branchId===branchId)
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
        <InputGroup style={{width:"40%"}}>
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
            <th>Add Project</th>
          </tr>
        </thead>
        <tbody>
          {onlyUsers
            .filter((user) =>
              user.empName.toLowerCase().includes(searchTerm.toLowerCase())||
            user.empEmail.toLowerCase().includes(searchTerm.toLowerCase())||
            user.empMob.toLowerCase().includes(searchTerm.toLowerCase())||
            user.empDepartment.toLowerCase().includes(searchTerm.toLowerCase())

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
                <Tooltip title="Edit" arrow placement="bottom">
                  <EditIcon
                    className=" me-3"
                    style={{ cursor: "pointer", color: "#4f0e83" }}
                    onClick={() => handleEditUser(user)}
                  />
                  </Tooltip>
                  <Tooltip title="Delete" arrow placement="bottom">
                  <DeleteIcon
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteUser(user.id)}
                  />
                  </Tooltip>
                </td>
                <td>
                <Tooltip title="Assign Project" arrow placement="bottom">
                   <AddCircleIcon
                    className=" me-3"
                    style={{ cursor: "pointer", color: "#4f0e83" }}
                    onClick={() => handleShowProjectModal(user.id)}
                  />
                  </Tooltip></td>
              </tr>
            ))}
        </tbody>
      </Table>
      <TablePagination
          currentPage={page - 1}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handlePageSizeChange={handlePageSizeChange}
        />
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
              <div  className="mt-3">
                <h5 >Assigned Projects</h5>
                {
                  userProjects.map(project=>(
                    <li style={{listStyle:"none"}} key={project.id}>{project.projectName}</li>
                  ))
                }
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
            onClick={handllClear}
            style={{
              height: "40px",
              color: "white",
            
              width: "20%",
              borderRadius: "20px",
            }}
          >
            Clear
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
