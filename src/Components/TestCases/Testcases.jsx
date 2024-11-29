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
const Testcases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = location.state || {};

  const [testCases, setTestCases] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal state

  useEffect(() => {
    getTestcaseByProjectId(project.id)
      .then((response) => {
        setTestCases(response.data);
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  }, []);
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

            {/* <button
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
            </button> */}

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
                <th>Status</th>
                <th>Feature</th>
                <th>Author</th>
                <th>Created Date</th>
                <th>Updated Date</th>
                {/* <th>Actions</th> */}
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
