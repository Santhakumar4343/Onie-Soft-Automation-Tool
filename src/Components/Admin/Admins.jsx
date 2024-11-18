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
  getAllBranches,
  getAllRegister,
  updateRegister,
} from "../API/Api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Admins = () => {
  const [show, setShow] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    getAllBranches()
      .then((response) => setBranches(response.data))
      .catch((err) => console.log(err));
  }, []);
  const [formData, setFormData] = useState({
    empId: "",
    empName: "",
    empEmail: "",
    empMob: "",
    empRole: "Admin",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    getAllRegister()
      .then((response) => setAdmins(response.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSaveUser = async () => {
    try {
      if (editingAdmin) {
        const { password, ...updatedData } = formData;
        await updateRegister(password ? formData : updatedData);
      } else {
        await addRegister(formData);
      }
      handleClose();
      const updatedadmins = await getAllRegister();
      setAdmins(updatedadmins.data);
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };

  const handleEditUser = (user) => {
    setEditingAdmin(user);
    setFormData(user);
    handleShow();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/register/v1/delete/${userId}`);
        // Refresh admins list after deletion
        const updatedadmins = await getAllRegister();
        setAdmins(updatedadmins.data);
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container">
      <h2 className="mb-3" style={{color:"#4f0890", textAlign:"center" }}>Admins</h2>
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
        <InputGroup className="w-50">
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
          {admins
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

      {/* Modal for Adding/Editing User */}
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
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                name="password"
                placeholder={
                  editingAdmin ? "Enter new password (optional)" : "Password"
                }
                className="mb-3"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingAdmin}
              />
            </Form.Group>
            
            <div className="form-group">
              <select
                className="form-control"
                name="branchId"
                value={formData.branchId || ""}
                onChange={handleInputChange}
                required
              >
                <option>---select Branch---</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
            </div>
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
            style={{
              height: "40px",
              color: "white",
              backgroundColor: "#4f0e83",
              width: "25%",
              borderRadius: "20px",
            }}
          >
            {editingAdmin ? "Update Admin" : "Save Admin"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Admins;
