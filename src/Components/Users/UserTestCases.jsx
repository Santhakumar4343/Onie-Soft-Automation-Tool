import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Modal, Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import "../TestCases/Testcases.css";

import {
  addTestcase,
  getTestcaseByProjectId,
  updateTestcase,
} from "../API/Api";
import Swal from "sweetalert2";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import TablePagination from "../Pagination/TablePagination";
const UserTestcases = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [editTestCase, setEditTestCase] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = location.state || {};

  const [testCases, setTestCases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // useEffect(() => {
  //   getTestcaseByProjectId(project.id)
  //     .then((response) => {
  //       setTestCases(response.data);
  //       console.log(response.data);
  //     })
  //     .catch((err) => console.log(err));
  // }, [project.id]);
  const formik = useFormik({
    initialValues: {
      projectId: project.id,
      testCaseName: "",
      automationId: "",
      author: "",
      feature: "",
    },
    validationSchema: Yup.object({
      testCaseName: Yup.string().required("Test Case Name is required"),
      automationId: Yup.string().required("Custom ID is required"),
      author: Yup.string().required("Author is required"),

      feature: Yup.string().required("Feature is required"),
    }),
    onSubmit: async (values) => {
      if (editTestCase) {
        // Edit mode
        try {
          const response = updateTestcase(values);
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Updated",
              text: "Test case updated successfully!",
            });
          }
          window.location.reload();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: "Could not update the test case!",
          });
        }
      } else {
        try {
          const response = await addTestcase(project.id, values);
          if (response.status === 200 || response.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Created",
              text: "Test case created successfully!",
            });
          }
          window.location.reload();
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: "Could not create the test case!",
          });
        }
      }

      // Refresh and close modal
      formik.resetForm();
      setShowModal(false);
      setEditTestCase(false);
    },
  });

  const handleClose = () => {
    setShowModal(false);
    formik.resetForm();
  };
  const handleAddTestCase = () => {
    setEditTestCase(null);
    setShowModal(true);
  };
  const handleClear = () => {
    formik.resetForm();
  };
  const handleEdit = (testCase) => {
    setEditTestCase(testCase);
    formik.setValues({
      id: testCase.id,
      testCaseName: testCase.testCaseName,
      automationId: testCase.automationId,
      author: testCase.author,
      feature: testCase.feature,
    });
    setShowModal(true);
  };

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setPage(1);
    setSearchQuery(query);
  };
  const filteredTestCases = testCases.filter(
    (testcase) =>
      testcase.testCaseName.toLowerCase().includes(searchQuery) ||
      testcase.author.toLowerCase().includes(searchQuery) ||
      testcase.feature.toLowerCase().includes(searchQuery) ||
      testcase.automationId.toLowerCase().includes(searchQuery)
  );
  const handleTestRun = () => {
    navigate("/userDashboard/testruns", { state: { project } });
  };

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
  return (
    <div className=" container-fluid ">
      <div className="content">
        <div style={{ position: "sticky", top: "0", zIndex: "100" }}>
          <h4
            className="text-center mb-4"
            style={{ color: "#4f0e83", boxShadow: "grey" }}
          >
            Test Cases for - {project.projectName}
          </h4>
        </div>

        <div
          style={{
            position: "sticky",
            top: "0",
            zIndex: "100",
            backgroundColor: "white",
            padding: "10px 15px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <button
                onClick={handleAddTestCase}
                style={{
                  color: "white",
                  backgroundColor: "#4f0e83",
                  borderRadius: "20px",
                  padding: "8px 15px",
                  fontSize: "14px",
                  marginRight: "10px",
                  width: "130px",
                  height: "40px",
                }}
                className="btn"
              >
                Add Test Case
              </button>

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
            </div>

            <input
              type="text"
              value={searchQuery}
              style={{ width: "40%" }}
              onChange={handleSearchInput}
              placeholder="Search by Test Case Name, Author......"
              className="form-control "
            />
          </div>
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
          <table className="table  table-hover mt-3">
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
                <th>Automation ID</th>
                <th>Test Case Name</th>

                <th>Feature</th>
                <th>Author</th>
                <th>Created Date</th>
                <th>Updated Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestCases.map((testCase, index) => (
                <tr key={index}>
                  <td>{testCase.automationId}</td>
                  <td>{testCase.testCaseName}</td>

                  <td>{testCase.feature}</td>
                  <td>{testCase.author}</td>

                  <td>
                    {moment(testCase.createdAt).format("DD-MM-YYYY (HH:mm:ss)")}
                  </td>
                  <td>
                    {moment(testCase.updatedAt).format("DD-MM-YYYY (HH:mm:ss)")}
                  </td>

                  <td>
                    <EditIcon
                      onClick={() => handleEdit(testCase)}
                      style={{ cursor: "pointer", color: "#4f0e83" }}
                      title="Edit TestCase"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={page - 1}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handlePageSizeChange={handlePageSizeChange}
        />

        {/* Modal Popup */}
        <Modal show={showModal} onHide={handleClose} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>
              {editTestCase ? "Edit Test Case" : "Add Test Case"}
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
              <div className="d-flex align-items-center justify-content-center">
                <Button
                  className="btn btn-secondary"
                  onClick={handleClear}
                  style={{
                    borderRadius: "20px",
                    width: "20%",
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  style={{
                    color: "white",
                    backgroundColor: "#4f0e83",
                    borderRadius: "20px",
                    width: "20%",
                    marginLeft: "15px",
                  }}
                >
                  Submit
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default UserTestcases;
