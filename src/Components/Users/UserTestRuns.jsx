import { Modal, Tab, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createTestRun, getTestRunByProjectId, TestRunClone } from "../API/Api";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TablePagination from "../Pagination/TablePagination";
import {PlayArrow} from "@mui/icons-material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const UserTestRuns = () => {
        const [searchText, setSearchText] = useState("");
        const [testRunModal, setTestRunModal] = useState(false);
        const [testRunCloneModal, setTestRunCloneModal] = useState(false);
        const navigate = useNavigate();
        const user = JSON.parse(sessionStorage.getItem("user"));
        console.log(user.id);
        const location = useLocation();

        const {project} = location.state || {};

        const [testRunData, setTestData] = useState({
            testRunName: "",
        });
        const [testRuns, setTestRuns] = useState([]);

        const [page, setPage] = useState(1); // Current page number

        const [itemsPerPage, setItemsPerPage] = useState(10); // Default page size
        const [totalPages, setTotalPages] = useState(0); // To store total number of pages

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
  useEffect(() => {
    const query='all';
    getTestRunByProjectId(project.id,query, page - 1, itemsPerPage)
      .then((response) => {
        setTestRuns(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => console.log(err));
  }, [project.id,page - 1, itemsPerPage]);

        const handleTestRun = () => {
            setTestRunModal(true)
        };

  const handleViewAllTestCasesClick = () => {
    navigate(`/userDashboard/testcases/${project.id}`, { state: { project } });
  };

  const handleTestRunsSummaryClick = () => {
    navigate(`/userDashboard/testRunsSummary/${project.id}`, { state: { project } });
  };
  const filteredTestRuns = testRuns.filter(
    (testRun) =>
      testRun.testRunName.toLowerCase().includes(searchText.toLowerCase()) ||
      testRun.createdBy.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleTestRunClick = (testRun) =>
    navigate("/userDashboard/testRunDetails", { state: { project, testRun } });
  const handleTestRunView = (testRun) =>
    navigate("/userDashboard/testRunView", { state: { project, testRun } });

        const [testRun, setTestRun] = useState({});

        const handleCloneTestcases = (testRun) => {
            setTestRunCloneModal(true);
            setTestRun(testRun)
        }

        const handleCloneFormSubmit = (e) => {
            e.preventDefault();
            const data = {
                testRunName: testRun.testRunName,
            }
            TestRunClone(testRun.id, project.id, data)
                .then(() => {
                    Swal.fire("Success", "Test cases cloned successfully!", "success");
                    setTestRunCloneModal(false);
                    getTestRunByProjectId(project.id, "", page - 1, itemsPerPage).then(
                        response => {
                            setTestRuns(response.data.content)
                            setTotalPages(response.data.totalPages)
                        }
                    ).catch(err => console.log(err))
                })
                .catch((err) => {
                    console.error(err);
                    Swal.fire("Error", "Failed to clone test cases.", "error");
                });
        };

  const handleTestRunSubmit = (e) => {
    e.preventDefault();
    const data = {
      testRunName: testRunData.testRunName,
      createdBy: user.empName,
      projectId: project.id,
    };
    createTestRun(data)
      .then((response) => {
        const testRun = response.data;
        navigate("/userDashboard/testRunDetails", {
          state: { project, testRun },
        });

        Swal.fire({
          icon: "success",
          title: "Test Run Saved",
          text: "Test Run Created Successfully!",
        });
        console.log(response);

        setTestRunModal(false);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "something went wrong could not create Test Run!!",
        });
        console.log(err);
        setTestRunModal(false);
      });
  };

        const handleRunExecute = (testRun) => {
            const id = testRun.id;
            navigate("/userDashboard/configpage", {state: {id, testRun, project}});
        };

        const handleTestRunChange = (e) => {
            const {name, value} = e.target;
            setTestData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };

  const handleBackwardClick = () => {
    navigate("/userDashboard/projects");
  };
  return (
    <div className="container ">
        <div className="d-flex align-items-center justify-content-between">
      <Tooltip title="Back" arrow placement="right">
        <Tab
          icon={
            <ArrowBackIcon
              sx={{ fontSize: "2rem", color: "#4f0e83" }}
              onClick={handleBackwardClick}
            />
          }
        ></Tab>
      </Tooltip>
   
      <h4 className="text-center mb-2" style={{ color: "#4f0e83" ,marginRight:"70px"}}>
        {project.projectName} : Test Runs
      </h4>
      <h1></h1>
      </div>
      <div className="d-flex justify-content-between mb-3 align-items-center">
          <div>
              <button
                  className="btn btn-primary"
                  style={{
                      height: "40px",
                      color: "white",
                      backgroundColor: "#4f0e83",
                      width: "100px",
                      borderRadius: "20px",
                      marginRight: "10px",
                  }}
                  onClick={handleTestRun}
              >
                  Create
              </button>
              <button
                  onClick={handleTestRunsSummaryClick}
                  style={{
                      color: "white",
                      backgroundColor: "#4f0e83",
                      borderRadius: "20px",
                      padding: "8px 15px",
                      width: "100px",
                      height: "40px",
                      marginRight: "10px",
                  }}
                  className="btn"
              >
                  Summary
              </button>
              <button
                  onClick={handleViewAllTestCasesClick}
                  style={{
                      color: "white",
                      backgroundColor: "#4f0e83",
                      borderRadius: "20px",
                      padding: "8px 15px",
                      width: "130px",
                      height: "40px",
                  }}
                  className="btn"
              >
                  All Test Cases
              </button>

          </div>
          <input
              type="text"
              value={searchText}
              placeholder="Search by Test Run Name,Created By"
              className="form-control "
              style={{width: "30%"}}
              onChange={(e) => setSearchText(e.target.value)}
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
                    <table className="table  table-hover">
                        <thead
                            className="thead-dark"
                            style={{
                                position: "sticky",
                                top: 0,
                                backgroundColor: "#f8f9fa",
                                zIndex: 100,
                                color: "#4f0e83",
                            }}
                        >
                        <tr>

                            <th>Test Run Name</th>
                            <th>Created By</th>
                            <th>No. of Test Cases</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTestRuns.map((testRun, index) => (
                            <tr
                                key={index}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: "rgb(79, 103, 228)",
                                    color: "white",
                                }}
                            >

                                <td>{testRun.testRunName}</td>
                                <td>{testRun.createdBy}</td>
                                <td>{testRun.testCaseCount}</td>
                                <div>
                                    <td>
                                        <EditIcon
                                            className="me-2"
                                            style={{cursor: "pointer", color: "#4f0e83", marginRight: "5px"}}
                                            onClick={() => handleTestRunClick(testRun)}
                                        />
                                    </td>
                                    <td>
                                        <RemoveRedEyeIcon
                                            className="me-2"
                                            style={{
                                                cursor: testRun.testCaseCount === 0 ? "not-allowed" : "pointer",
                                                color: "#4f0e83",
                                                opacity: testRun.testCaseCount === 0 ? 0.5 : 1,
                                                marginRight: "5px",
                                            }}
                                            onClick={() => testRun.testCaseCount !== 0 && handleTestRunView(testRun)}
                                        />
                                    </td>
                                    <td>
                                        <ContentCopyIcon
                                            style={{
                                                cursor: testRun.testCaseCount === 0 ? "not-allowed" : "pointer",
                                                color: "#4f0e83",
                                                opacity: testRun.testCaseCount === 0 ? 0.5 : 1,
                                                marginRight: "5px",
                                            }}
                                            onClick={() => testRun.testCaseCount !== 0 && handleCloneTestcases(testRun)}
                                        />
                                    </td>
                                    <td>
                                        <PlayArrow
                                            style={{
                                                cursor: testRun.testCaseCount === 0 ? "not-allowed" : "pointer",
                                                color: "#4f0e83",
                                                opacity: testRun.testCaseCount === 0 ? 0.5 : 1,
                                                fontSize: "28px",
                                            }}
                                            onClick={() => testRun.testCaseCount !== 0 && handleRunExecute(testRun)}
                                       />
                                    </td>
                                </div>
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

                <Modal open={testRunModal} onClose={() => setTestRunModal(false)}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                        }}
                    >
                        <div
                            className="modal-content p-4"
                            style={{
                                maxWidth: "500px",
                                width: "100%",
                                backgroundColor: "white",
                                borderRadius: "20px",
                            }}
                        >
                            <h4 className="modal-title text-center">Add Test Run</h4>
                            <form onSubmit={handleTestRunSubmit} className="mt-4">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="testRunName"
                                        className="form-control w-80 mb-3"
                                        placeholder="Test Run Name"
                                        onChange={handleTestRunChange}
                                        value={testRuns.testRunName}
                                        required
                                    />
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-primary mt-3 "
                                        style={{
                                            borderRadius: "20px",
                                            background: "#4f0e83",
                                            marginRight: "20px",
                                            width: "150px",
                                        }}
                                        onClick={() => {
                                            setTestRunModal(false);
                                        }}
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
                                        Add Test Run
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>

                <Modal open={testRunCloneModal} onClose={() => setTestRunCloneModal(false)}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                        }}
                    >
                        <div
                            className="modal-content p-4"
                            style={{
                                maxWidth: "500px",
                                width: "100%",
                                backgroundColor: "white",
                                borderRadius: "20px",
                            }}
                        >
                            <h4 className="modal-title text-center">Clone Test Run</h4>
                            <form
                                className="mt-4"
                                onSubmit={handleCloneFormSubmit}
                            >
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="testRunName"
                                        className="form-control w-80 mb-3"
                                        placeholder="Test Run Name"
                                        onChange={(e) => setTestRun(
                                            (prevTestRun) => ({...prevTestRun, testRunName: e.target.value}))}
                                        value={testRun.testRunName}
                                        required
                                    />
                                </div>
                                <div className="text-center">
                                    <button
                                        className="btn btn-primary mt-3 "
                                        style={{
                                            borderRadius: "20px",
                                            background: "#4f0e83",
                                            marginRight: "20px",
                                            width: "150px",
                                        }}
                                        onClick={() => {
                                            setTestRunCloneModal(false);
                                        }}
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
                                        Clone Test Run
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal></div>
        );
    }
;


export default UserTestRuns;
