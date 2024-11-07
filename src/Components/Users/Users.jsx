import  { useEffect, useState } from 'react';
import { Modal, Button, Form, Table, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../API/Api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Users = () => {
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        empId: '',
        empName: '',
        empEmail: '',
        empMob: '',
        empRole: '',
        empDepartment: '',
        status: true,
        password: ''
    });

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setEditingUser(null);
        setFormData({
            empId: '',
            empName: '',
            empEmail: '',
            empMob: '',
            empRole: '',
            empDepartment: '',
            status: true,
            password: ''
        });
        setShow(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        axios.get(`${API_URL}/register/v1/getallreg`)
            .then(response => setUsers(response.data))
            .catch(err => console.log(err));
    }, []);

    const handleSaveUser = async () => {
        try {
            if (editingUser) {
                // Update user
                await axios.post(`${API_URL}/register/v1/updateregister`, formData);
            } else {
                // Add new user
                await axios.post(`${API_URL}/register/v1/addregister`, formData);
            }
            handleClose();
            // Refresh users list
            const updatedUsers = await axios.get(`${API_URL}/register/v1/getallreg`);
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
                const updatedUsers = await axios.get(`${API_URL}/register/v1/getallreg`);
                setUsers(updatedUsers.data);
            } catch (error) {
                console.error("Failed to delete user", error);
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-3">
                <Button variant="primary" onClick={handleShow} style={{ height: "40px", color: "white", backgroundColor: "#4f0e83", width: "10%", borderRadius: "20px" }}>Add User</Button>
                <InputGroup className="w-50">
                    <FormControl
                        placeholder="Search users"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </InputGroup>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.filter(user => user.empName.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((user, index) => (
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.empId}</td>
                                <td>{user.empName}</td>
                                <td>{user.empEmail}</td>
                                <td>{user.empMob}</td>
                                <td>{user.empRole}</td>
                                <td>{user.empDepartment}</td>
                                <td>
                                    <EditIcon className="text-primary me-3" style={{ cursor: 'pointer' }} onClick={() => handleEditUser(user)} />
                                    <DeleteIcon className="text-danger" style={{ cursor: 'pointer' }} onClick={() => handleDeleteUser(user.id)} />
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>

            {/* Modal for Adding/Editing User */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingUser ? "Edit User" : "Add New User"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="empId">
                            <Form.Control
                                type="text"
                                name="empId"
                                placeholder='Employee ID'
                                className='mb-3'
                                value={formData.empId}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="empName">
                            <Form.Control
                                type="text"
                                name="empName"
                                placeholder='Employee Name'
                                className='mb-3'
                                value={formData.empName}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="empEmail">
                            <Form.Control
                                type="email"
                                name="empEmail"
                                placeholder='Employee Email'
                                className='mb-3'
                                value={formData.empEmail}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="empMob">
                            <Form.Control
                                type="text"
                                name="empMob"
                                placeholder='Mobile Number'
                                className='mb-3'
                                value={formData.empMob}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="empRole">
                            <Form.Control
                                type="text"
                                name="empRole"
                                placeholder='Role'
                                className='mb-3'
                                value={formData.empRole}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="empDepartment">
                            <Form.Control
                                type="text"
                                name="empDepartment"
                                placeholder='Department'
                                className='mb-3'
                                value={formData.empDepartment}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder='Password'
                                className='mb-3'
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center align-items-center'>
                    <Button variant="secondary" onClick={handleClose} style={{ height: "40px", color: "white", backgroundColor: "#4f0e83", width: "20%", borderRadius: "20px" }}>Close</Button>
                    <Button variant="primary" onClick={handleSaveUser} style={{ height: "40px", color: "white", backgroundColor: "#4f0e83", width: "25%", borderRadius: "20px" }}>{editingUser ? "Update User" : "Save User"}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Users;
