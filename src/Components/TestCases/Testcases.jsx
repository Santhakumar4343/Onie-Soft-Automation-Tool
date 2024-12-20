import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Modal, Button } from "react-bootstrap";


import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import "./Testcases.css";

import { addTestcase, getTestcaseByProjectId } from "../API/Api";
import Swal from "sweetalert2";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import TablePagination from "../Pagination/TablePagination";
const Testcases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = location.state || {};

  const [testCases, setTestCases] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal state

  const [page, setPage] = useState(1); // Current page number

  const [itemsPerPage, setItemsPerPage] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(0); // To store total number of pages

  useEffect(() => {
    getTestcaseByProjectId(project.id, page - 1, itemsPerPage)
      .then((response) => {
        setTestCases(response.data.content); // Extract content for the test cases
        setTotalPages(response.data.totalPages); // Set the total pages
      })
      .catch((err) => console.log(err));
  }, [project.id, page, itemsPerPage]);

  

  // Handle page change
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
  const formik = useFormik({
    initialValues: {
      projectId: project.id,
      testCaseName: "",
      automationId: "",
      author: "",
      status: "",
      feature: "",
    },
    validationSchema: Yup.object({
      testCaseName: Yup.string().required("Test Case Name is required"),
      automationId: Yup.string().required("Custom ID is required"),
      author: Yup.string().required("Author is required"),
      status: Yup.string().required("Status is required"),
      feature: Yup.string().required("Feature is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await addTestcase(project.id, values);

        Swal.fire({
          icon: "success",
          title: "Test Case Saved",
          text: "Your Test Case was created successfully!",
        });

        formik.resetForm();
        setShowModal(false);

        console.log(response);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Could not create the Test Case.",
        });
      }
    },
  });

  const handleClose = () => {
    setShowModal(false);
    formik.resetForm();
  };
  
  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };
  const filteredTestCases = testCases.filter(
    (testcase) =>
      testcase.testCaseName.toLowerCase().includes(searchQuery) ||
      testcase.author.toLowerCase().includes(searchQuery)
  );
  const handleTestRun = () => {
    navigate("/dashboard/testruns", { state: { project } });
  };
  return (
    <div className=" container-fluid ">
      <div className="content">
        <div style={{ position: "sticky", top: "0", zIndex: "100" }}>
          <h4
            className="text-center mb-4"
            style={{ color: "#4f0e83", boxShadow: "grey" }}
          >
            {project.projectName} - Test Cases 
          </h4>
        </div>

        
          <div className="d-flex justify-content-between align-items-center">
           

          <button
              onClick={handleTestRun}
              style={{
                color: "white",
                backgroundColor: "#4f0e83",
                borderRadius: "20px",
                padding: "8px 15px",
                fontSize: "14px",
                width: "130px",
                height: "40px",
              }}
              className="btn"
            >
              View Test Runs
            </button>
           
              <input
                style={{width:"40%"}}
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search by Test Case Name, Author......"
                className="form-control "
              />
            

            

            
          </div>
      

        <div
          style={{
            maxHeight: "520px",
            overflowY: "auto",
          }}
        >
          <style>
            {`
      /* Scrollbar styling for Webkit browsers (Chrome, Safari, Edge) */
      div::-webkit-scrollbar {
        width: 2px;
       
      }
      div::-webkit-scrollbar-thumb {
        background-color: #4f0e83;
        border-radius: 4px;
      }
      div::-webkit-scrollbar-track {
        background-color: #e0e0e0;
      }

      /* Scrollbar styling for Firefox */
      div {
        scrollbar-width: thin; 
        scrollbar-color: #4f0e83 #e0e0e0;   
      }
    `}
          </style>
          <table
            className="table  table-hover mt-3"
            style={{ textAlign: "center" }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#f8f9fa",
                zIndex: 100,
                color: "#4f0e83",
              }}
            >
              <tr>
                <th>Test Case ID</th>
                <th>Automation ID</th>
                <th>Test Case Name</th>
                <th>Status</th>
                <th>Feature</th>
                <th>Author</th>
                <th>Created Date</th>
                <th>Updated Date</th>
              
              </tr>
            </thead>
            <tbody>
              {filteredTestCases.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.automationId}</td>
                  <td>{item.testCaseName}</td>
                  <td>{item.status}</td>
                  <td>{item.feature}</td>
                  <td>{item.author}</td>

                  <td>
                    {moment(item.createdAt).format("DD-MM-YYYY (HH:mm:ss)")}
                  </td>
                  <td>
                    {moment(item.updatedAt).format("DD-MM-YYYY (HH:mm:ss)")}
                  </td>

                  {/* <td>
                    <EditIcon
                      onClick={() => handleEdit(item.testCaseId)}
                      title="Edit TestCase"
                    />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
         
        </div>
        <div>
          <TablePagination
          currentPage={page - 1}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handlePageSizeChange={handlePageSizeChange}
        />
          </div>
        {/* Modal Popup */}
        <Modal show={showModal} onHide={handleClose} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title style={{ textAlign: "center" }}>
              Add Test Case
            </Modal.Title>
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
                  placeholder="Test Case Name"
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
                  name="automationId"
                  value={formik.values.automationId}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.automationId && formik.errors.automationId
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Automation ID"
                />
                {formik.touched.automationId && formik.errors.automationId && (
                  <div className="invalid-feedback">
                    {formik.errors.automationId}
                  </div>
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
                  placeholder="Author Name"
                />
                {formik.touched.author && formik.errors.author && (
                  <div className="invalid-feedback">{formik.errors.author}</div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.status && formik.errors.status
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Status"
                />
                {formik.touched.status && formik.errors.status && (
                  <div className="invalid-feedback">{formik.errors.status}</div>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="feature"
                  value={formik.values.feature}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.touched.feature && formik.errors.feature
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Feature"
                />
                {formik.touched.feature && formik.errors.feature && (
                  <div className="invalid-feedback">
                    {formik.errors.feature}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                style={{
                  color: "white",
                  backgroundColor: "#4f0e83",
                  borderRadius: "20px",
                  width: "50%",
                  marginLeft: "120px",
                }}
              >
                Submit
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Testcases;
