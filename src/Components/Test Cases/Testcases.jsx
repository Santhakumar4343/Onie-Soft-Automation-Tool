import  { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Modal, Button } from "react-bootstrap";
import PaginationComponent from "../../PaginationComponent";
import { RiPencilFill } from "react-icons/ri";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import "./TestCases.css"
const Testcases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate=useNavigate();
  const [testCases, setTestCases] = useState([
    {
      projectId: "4",
      testCaseId: "TC001",
      testCaseName: "Password Reset Test",
      customId: "TC03",
      author: "Alice",
      createdBy: "29/10/24",
      updatedAt: "29/10/24",
    },
    {
      projectId: "4",
      testCaseId: "TC002",
      testCaseName: "Login Functionality Test",
      customId: "TC04",
      author: "Bob",
      createdBy: "28/10/24",
      updatedAt: "28/10/24",
    },
    {
      projectId: "4",
      testCaseId: "TC003",
      testCaseName: "Signup Functionality Test",
      customId: "TC05",
      author: "Charlie",
      createdBy: "27/10/24",
      updatedAt: "27/10/24",
    },
    {
      projectId: "4",
      testCaseId: "TC001",
      testCaseName: "Password Reset Test",
      customId: "TC03",
      author: "Alice",
      createdBy: "29/10/24",
      updatedAt: "29/10/24",
    },
    {
      projectId: "4",
      testCaseId: "TC002",
      testCaseName: "Login Functionality Test",
      customId: "TC04",
      author: "Bob",
      createdBy: "28/10/24",
      updatedAt: "28/10/24",
    },
    {
      projectId: "4",
      testCaseId: "TC003",
      testCaseName: "Signup Functionality Test",
      customId: "TC05",
      author: "Charlie",
      createdBy: "27/10/24",
      updatedAt: "27/10/24",
    },
    {
      projectId: "1",
      testCaseId: "1",
      testCaseName: "Login Test",
      customId: "TC01",
      author: "Alice",
      createdBy: "29/10/24",
      updatedAt: "29/10/28",
    },
    {
      projectId: "2",
      testCaseId: "2",
      testCaseName: "Signup Test",
      customId: "TC02",
      author: "Bob",
      createdBy: "29/10/24",
      updatedAt: "29/10/28",
    },
    {
      projectId: "3",
      testCaseId: "3",
      testCaseName: "Password Reset Test",
      customId: "TC03",
      author: "Charlie",
      createdBy: "29/10/24",
      updatedAt: "29/10/28",
    },
    {
      projectId: "1",
      testCaseId: "4",
      testCaseName: "Login Test",
      customId: "TC01",
      author: "Alice",
      createdBy: "29/10/24",
      updatedAt: "29/10/28",
    },
    {
      projectId: "2",
      testCaseId: "5",
      testCaseName: "Signup Test",
      customId: "TC02",
      author: "Bob",
      createdBy: "29/10/24",
      updatedAt: "29/10/28",
    },
    {
      projectId: "3",
      testCaseId: "6",
      testCaseName: "Password Reset Test",
      customId: "TC03",
      author: "Charlie",
      createdBy: "29/10/24",
      updatedAt: "29/10/28",
    },
    {
      projectId: "1",
      testCaseId: "7",
      testCaseName: "Login Test",
      customId: "TC01",
      author: "Alice",
      createdBy: "29/10/24",
      updatedAt: "29/10/28",
    },
    {
      projectId: "2",
      testCaseId: "8",
      testCaseName: "Signup Test",
      customId: "TC02",
      author: "Bob",
      createdBy: "29/10/24",
      updatedAt: "29/10/28",
    },
    {
      projectId: "3",
      testCaseId: "9",
      testCaseName: "Password Reset Test",
      customId: "TC03",
      author: "Charlie",
      createdBy: "29/10/24",
      updatedAt: "29/10/28",
    },
    {
      projectId: "1",
      testCaseId: "10",
      testCaseName: "Login Test",
      customId: "TC01",
      author: "Alice",
      createdBy: "29/10/24",
      updatedAt: "29/10/28",
    },
    {
      projectId: "2",
      testCaseId: "11",
      testCaseName: "Signup Test",
      customId: "TC02",
      author: "Bob",
      createdBy: "29/10/24",
      updatedAt: "29/10/28",
    },
  ]);
  const [showModal, setShowModal] = useState(false); // Modal state
  const projectName = "Pixacart";
  const projectId = 4;
  const formik = useFormik({
    initialValues: {
      projectId: projectId,
      testCaseName: "",
      customId: "",
      author: "",
    },
    validationSchema: Yup.object({
      testCaseName: Yup.string().required("Test Case Name is required"),
      customId: Yup.string().required("Custom ID is required"),
      author: Yup.string().required("Author is required"),
    }),
    onSubmit: (values) => {
      setTestCases((prevCases) => [
        ...prevCases,
        { ...values, testCaseId: `TC00${prevCases.length + 1}` },
      ]); // Add new test case
      formik.resetForm(); // Reset form fields
      setShowModal(false); // Close the modal
    },
  });

  const handleClose = () => {
    setShowModal(false);
    formik.resetForm();
  };
  const handleEdit = (id) => {
    const filterData = testCases.filter((ele) => ele.testCaseId === id);
    console.log(filterData);
  };
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };
  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };
  const filteredTestCases = testCases.filter(
    (ele) =>
      ele.testCaseId.toLowerCase().includes(searchQuery) ||
      ele.testCaseName.toLowerCase().includes(searchQuery) ||
      ele.author.toLowerCase().includes(searchQuery) ||
      ele.createdBy.includes(searchQuery) ||
      ele.updatedAt.includes(searchQuery)
  );
  const handleTestRun=()=>{
    navigate("/testRuns");
  }
  return (
    <div className="container mt-4">
      <div  style={{ position: "sticky", top: "0", zIndex: "100" }}>
      <h3
        className="text-center mb-4"
      >
        Test Cases for {projectName}
      </h3>
      </div>
      <div className="testCase-btn mb-3">
      <button onClick={handleTestRun} 
         style={{color:"white",backgroundColor:"#4f0e83",borderRadius:"20px",width:"10%",}}
        className="mt-3 " >
         Test Runs
        </button>
        <button
          style={{color:"white",backgroundColor:"#4f0e83",borderRadius:"20px",width:"12%",}}
          onClick={() => setShowModal(true)}
          className="mt-3"
        >
          Add Test Case
        </button>
       
      </div>
      <div
        style={{
          position: "sticky",
          top: "0",
          zIndex: "100",
          backgroundColor: "#f8f9fa",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <select
            className="form-control"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: "150px", appearance: "auto" }}
          >
            {[5, 10, 15, 20].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>

          <div className="d-flex flex-grow-1 mx-3">
            <input
              type="text"
              className="form-control"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="Search by Ticket Number, Employee, or Status..."
            />
            {/* <button
              type="button"
              className="btn btn-outline-secondary ml-2"
              onClick={() => handleSearchInput({ target: { value: "" } })}
            >
              Clear
            </button> */}
          </div>
        </div>
      </div>

      
     

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      <table className="table table-bordered table-hover mt-3"  style={{textAlign:"center"}}>
        <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8f9fa", zIndex: 100 ,color:"#4f0e83"}}>
          <tr>
            <th>Test Case Id</th>
            <th>Test Case Name</th>
            <th>Custom ID</th>
            <th>Author</th>
            <th>Created By</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTestCases.map((item, index) => (
            <tr key={index}>
              <td>{item.testCaseId}</td>
              <td>{item.testCaseName}</td>
              <td>{item.customId}</td>
              <td>{item.author}</td>
              <td>{item.createdBy}</td>
              <td>{item.updatedAt}</td>
              <td>
                <RiPencilFill onClick={() => handleEdit(item.testCaseId)} title="Edit TestCase" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {/* Modal Popup */}
      <Modal show={showModal} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title style={{textAlign:"center"}}>Add Test Case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
           
              <input
                type="text"
                name="testCaseName"
                value={formik.values.testCaseName}
                onChange={formik.handleChange}
                className={`form-control ${
                  formik.touched.testCaseName && formik.errors.testCaseName
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Enter Test Case Name"
              />
              {formik.touched.testCaseName && formik.errors.testCaseName && (
                <div className="invalid-feedback">
                  {formik.errors.testCaseName}
                </div>
              )}
            </div>

            <div className="mb-3">
            
              <input
                type="text"
                name="customId"
                value={formik.values.customId}
                onChange={formik.handleChange}
                className={`form-control ${
                  formik.touched.customId && formik.errors.customId
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Enter Custom ID"
              />
              {formik.touched.customId && formik.errors.customId && (
                <div className="invalid-feedback">{formik.errors.customId}</div>
              )}
            </div>

            <div className="mb-3">
            
              <input
                type="text"
                name="author"
                value={formik.values.author}
                onChange={formik.handleChange}
                className={`form-control ${
                  formik.touched.author && formik.errors.author
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Enter Author Name"
              />
              {formik.touched.author && formik.errors.author && (
                <div className="invalid-feedback">{formik.errors.author}</div>
              )}
            </div>

            <Button type="submit"   style={{color:"white",backgroundColor:"#4f0e83",borderRadius:"20px",width:"50%",marginLeft:"70px"}}>
              Submit
            </Button>
          </form>
        </Modal.Body>
      </Modal>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
};

export default Testcases;
