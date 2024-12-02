import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  InputGroup,
  FormControl,
} from "react-bootstrap";

import {
  addRegister,
  deleteRegister,
  getAllRegister,
  getRegisterForBranch,
  updateRegister,
} from "../API/Api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Tab, Tooltip } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const Admins = () => {
  const [show, setShow] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAdmin, setEditingAdmin] = useState(null);

  const [loading, isLoading] = useState(false);
  const location = useLocation();
  const branchId = location.state?.branch?.id || {};
  const cmpName = location.state?.company?.cmpName || {};
  const navigate=useNavigate()
  console.log(branchId);

  const [formData, setFormData] = useState({
    empId: "",
    empName: "",
    empEmail: "",
    empMob: "",

    empDepartment: "",
    status: true,
    password: "",
  });

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setEditingAdmin(null);
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

  const handleClear = () => {
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
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Update status only during edit
    if (name === "status") {
      if (editingAdmin) {
        setFormData({ ...formData, status: checked });
      }
      return; // Skip further processing for "status" in creation flow
    }

    // Update other fields
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  useEffect(() => {
    getRegisterForBranch(branchId)
      .then((response) => setAdmins(response.data))
      .catch((err) => console.log(err));
  }, [branchId]);

  const handleSaveUser = async () => {
    try {
      isLoading(true); // Show loading indicator

      let payload;

      if (editingAdmin) {
        // Exclude password if not provided
        const { password, ...updatedData } = formData;

        // Use updatedData which doesn't include password
        payload = updatedData;

        await updateRegister(payload); // Update user details
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User details have been updated successfully!",
        });
      } else {
        // Creating a new admin
        payload = {
          empId: formData.empId,
          empName: formData.empName,
          empEmail: formData.empEmail,
          empMob: formData.empMob,
          empRole: "Admin",
          empDepartment: formData.empDepartment,
          status: formData.status,
          password: formData.password,
          branchId: branchId,
        };

        await addRegister(payload); // Save new user
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "New admin has been added successfully!",
        });
      }

      isLoading(false); // Hide loading indicator
      handleClose(); // Close modal or form
      const updatedAdmins = await getRegisterForBranch(branchId); // Refresh the list
      setAdmins(updatedAdmins.data);
    } catch (error) {
      isLoading(false); // Hide loading indicator in case of an error
      console.error("Failed to save user", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save user. Please try again later!",
      });
    }
  };

  const handleEditUser = (user) => {
    setEditingAdmin(user);
    setFormData(user);
    handleShow();
  };

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the user. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRegister(userId); // Delete the user
          // Refresh the list after deletion
          const updatedAdmins = await getAllRegister();
          setAdmins(updatedAdmins.data);

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The user has been deleted successfully.",
          });
        } catch (error) {
          console.error("Failed to delete user", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete the user. Please try again later!",
          });
        }
      }
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const onlyAdmins = admins.filter(
    (admin) => admin.empRole.toLowerCase() === "admin"
  );

  const handleBackwardClick=()=>{
    navigate("/adminDashboard/departments")
 }
  return (
    <div className="container">
      <h4 className="mb-3" style={{ color: "#4f0890", textAlign: "center" }}>
        {cmpName} - {location.state?.branch?.branchName} - Admins
      </h4>
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
          Add Admin
        </Button>
        <InputGroup style={{width:"40%"}}>
          <FormControl
            placeholder="Search admins"
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
          {onlyAdmins
            .filter(
              (user) =>
                user.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.empEmail
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                user.empMob.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.empDepartment
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
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
                <Tooltip title="Edit"  placement="left" arrow>
                  <EditIcon
                    className=" me-3"
                    style={{ cursor: "pointer", color: "#4f0e83" }}
                    onClick={() => handleEditUser(user)}
                  />
                  </Tooltip>
                  <Tooltip title="Delete" placement="right" arrow>
                  <DeleteIcon
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteUser(user.id)}
                  />
                  </Tooltip>
                </td>
              </tr>
            ))}
        </tbody>
      
      </Table>
      <div>
      <Tooltip title="Back" arrow placement="right" >
          <Tab icon={<ArrowBackIcon sx={{ fontSize: "2rem" ,color:"#4f0e83"}}  onClick={handleBackwardClick}/>}  
          ></Tab>
          
          </Tooltip> 
          
    
        </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAdmin ? "Update  Admin" : "Add New Admin"}
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
            {editingAdmin && (
              <Form.Group controlId="empStatus" className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="status"
                  label="Status"
                  checked={formData.status}
                  onChange={handleInputChange}
                />
              </Form.Group>
            )}

            {!editingAdmin && (
              <Form.Group controlId="password">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="mb-3"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center align-items-center">
          <Button
            className="btn-secondary"
            onClick={handleClear}
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
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <span>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                {editingAdmin ? " Updating..." : " Saving..."}
              </span>
            ) : editingAdmin ? (
              "Update Admin"
            ) : (
              "Save Admin"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Admins;
