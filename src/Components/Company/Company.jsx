import { useEffect, useState } from 'react';
import { Modal, Button, Form, Table, InputGroup, FormControl } from 'react-bootstrap';
import { addCompany, updateCompany, getAllCompany,deleteCompanyById } from '../API/Api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Company = () => {
    const [show, setShow] = useState(false);
    const [companyData, setCompanyData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState({
        cmpName: "",
        cmpId: "",
        cmpBranch: "",
    });

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setEditingCompany(null);
        setFormData({
            cmpName: "",
            cmpId: "",
            cmpBranch: "",
        });
        setShow(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = () => {
        getAllCompany()
            .then(response => setCompanyData(response.data))
            .catch(err => console.log(err));
    };

    const handleSaveCompany = async () => {
        try {
            if (editingCompany) {
                // Update company
                await updateCompany(formData);
            } else {
                // Add new company
                await addCompany(formData);
            }
            handleClose();
            fetchCompanyData();
        } catch (error) {
            console.error("Failed to save company", error);
        }
    };

    const handleEditCompany = (company) => {
        setEditingCompany(company);
        setFormData(company);
        handleShow();
    };
    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteCompanyById(id);
              fetchCompanyData();
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
                <Button variant="primary" onClick={handleShow} style={{ height: "40px", color: "white", backgroundColor: "#4f0e83", width: "10%", borderRadius: "20px" }}>Add Company</Button>
                <InputGroup className="w-50">
                    <FormControl
                        placeholder="Search Company"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </InputGroup>
            </div>

            <Table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ID</th>
                        <th>Branch</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companyData
                        .filter(company => company.cmpName.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((company, index) => (
                            <tr key={index}>
                                <td>{company.cmpName}</td>
                                <td>{company.cmpId}</td>
                                <td>{company.cmpBranch}</td>
                                <td>
                                    <EditIcon className="me-3" style={{ cursor: 'pointer', color: "#4f0e83" }} onClick={() => handleEditCompany(company)} />
                                </td>
                                <td>
                                <DeleteIcon className="text-danger" style={{ cursor: 'pointer' }} onClick={() => handleDeleteUser(company.id)} />
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>

            {/* Modal for Adding/Editing Company */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingCompany ? "Update Company" : "Add New Company"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="cmpId">
                            <Form.Control
                                type="text"
                                name="cmpId"
                                placeholder='Company ID'
                                className='mb-3'
                                value={formData.cmpId}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="cmpName">
                            <Form.Control
                                type="text"
                                name="cmpName"
                                placeholder='Company Name'
                                className='mb-3'
                                value={formData.cmpName}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="cmpBranch">
                            <Form.Control
                                type="text"
                                name="cmpBranch"
                                placeholder='Branch'
                                className='mb-3'
                                value={formData.cmpBranch}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center align-items-center'>
                    <Button variant="secondary" onClick={handleClose} style={{ height: "40px", color: "white", backgroundColor: "#4f0e83", width: "20%", borderRadius: "20px" }}>Close</Button>
                    <Button variant="primary" onClick={handleSaveCompany} style={{ height: "40px", color: "white", backgroundColor: "#4f0e83", width: "25%", borderRadius: "20px" }}>{editingCompany ? "Update Company" : "Save Company"}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Company;
