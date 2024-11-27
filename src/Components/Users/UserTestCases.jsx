import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Modal, Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import "../TestCases/Testcases.css";

import axios from "axios";
import {
  addTestcase,
  API_URL,
  getTestcaseByProjectId,
  updateTestcase,
} from "../API/Api";
import Swal from "sweetalert2";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
const UserTestcases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editTestCase, setEditTestCase] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = location.state || {};

  const [testCases, setTestCases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    getTestcaseByProjectId(project.id)
      .then((response) => {
        setTestCases(response.data);
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  }, [project.id]);
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
          const response = updateTestcase();
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
      setEditTestCase(null);
    },
  });

  const handleClose = () => {
    setShowModal(false);
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
    (testcase) =>
      testcase.testCaseName.toLowerCase().includes(searchQuery) ||
      testcase.author.toLowerCase().includes(searchQuery)
  );
  const handleTestRun = () => {
    navigate("/userDashboard/testruns", { state: { project } });
  };
  return (
    <div className=" container-fluid ">
      <div className="content">
        <div style={{ position: "sticky", top: "0", zIndex: "100" }}>
          <h2
            className="text-center mb-4"
            style={{ color: "#4f0e83", boxShadow: "grey" }}
          >
            Test Cases for - {project.projectName}
          </h2>
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
            <select
              className="form-control"
              value={pageSize}
              onChange={handlePageSizeChange}
              style={{
                width: "150px",
                appearance: "auto",
                marginRight: "10px",
                fontSize: "14px",
              }}
            >
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>

            <div
              className="flex-grow-1 mx-3"
              style={{ position: "relative", borderRadius: "20px" }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search by Test Case Name, Author......"
                className="form-control w-50"
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
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
        </div>

        <div
          style={{
            maxHeight: "550px",
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
                  <td>{testCase.id}</td>
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

export default UserTestcases;
