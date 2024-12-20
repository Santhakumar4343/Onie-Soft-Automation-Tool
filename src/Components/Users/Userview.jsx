import { useEffect, useState } from "react";
import {
  getAssignedUserProjects,
  getProjectUsers,
  getTestcaseByProjectId,
  getTestRunByProjectId,
} from "../API/Api";
import moment from "moment";

import FactCheckIcon from "@mui/icons-material/FactCheck";
import PermDataSettingIcon from "@mui/icons-material/PermDataSetting";
import { Box, Tab, Tabs } from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import TablePagination from "../Pagination/TablePagination";
const UserView = () => {
  const [activeTab, setActiveTab] = useState("projects");

  const [selectedProject, setSelectedProject] = useState("");

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [testcases, setTestcases] = useState([]);
  const [testruns, setTestRuns] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const branchId = user.branchId;

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    getAssignedUserProjects(user.id)
      .then((response) => setProjects(response.data))
      .catch((err) => console.log(err));
  }, [user.id]);
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
    getTestRunByProjectId(selectedProject, page - 1, itemsPerPage)
      .then((response) => {
        setTestRuns(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => console.log(err));
  }, [selectedProject, page - 1, itemsPerPage]);

  useEffect(() => {
    if (selectedProject) {
      getTestcaseByProjectId(selectedProject,page-1,itemsPerPage)
        .then((response) => {setTestcases(response.data.content)
          setTotalPages(response.data.totalPages)
        })
        .catch((err) => console.log(err));
    } else {
      setTestcases([]);
    }
  }, [selectedProject,page-1,itemsPerPage]);

  useEffect(() => {
    if (selectedProject) {
      getProjectUsers(selectedProject)
        .then((response) => setUsers(response.data))
        .catch((err) => console.log(err));
    } else {
      setUsers([]);
    }
  }, [selectedProject]);

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <div className="text-center">
            <div className="container mt-4">
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
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Project Name</th>
                    <th>Created Date</th>
                    <th>Updated Date</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.id}</td>
                        <td>{project.projectName}</td>
                        <td>
                          {moment(project.createAt).format(
                            "DD-MMM-YYYY HH:MM:SS"
                          )}
                        </td>
                        <td>
                          {moment(project.updateAt).format(
                            "DD-MMM-YYYY HH:MM:SS"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No Project available for this branch.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        );

      case "testcases":
        return (
          <div className="text-center">
            <>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Select a Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectName}
                  </option>
                ))}
              </select>

              {/* Users Table */}
              {selectedProject && (
                <div className="container mt-4">
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
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Automation ID</th>
                          <th>Test Case Name</th>
                          <th>Author</th>
                          <th>Feature</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testcases.length > 0 ? (
                          testcases.map((testCase) => (
                            <tr key={testCase.id}>
                              <td>{testCase.id}</td>
                              <td>{testCase.automationId}</td>
                              <td>{testCase.testCaseName}</td>
                              <td>{testCase.author}</td>
                              <td>{testCase.feature}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No Test Cases available for this project.
                            </td>
                          </tr>
                        )}
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
                </div>
              )}
            </>
          </div>
        );

      case "testruns":
        return (
          <div className="text-center">
            <>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Select a Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectName}
                  </option>
                ))}
              </select>

              {/* Users Table */}
              {selectedProject && (
                <div className="container mt-4">
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
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>

                        <th>Test Run Name</th>
                        <th>Status</th>
                       
                      </tr>
                    </thead>
                    <tbody>
                      {testruns.length > 0 ? (
                        testruns.map((testrun) => (
                          <tr key={testrun.id}>
                            <td>{testrun.id}</td>
                            <td>{testrun.testRunName}</td>
                            <td>{testrun.status}</td>
                            
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No Test Runs available for this project.
                          </td>
                        </tr>
                      )}
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
                </div>
              )}
            </>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Box sx={{ width: "100%", marginBottom: "20px", marginTop: "20px" }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#037999", // Indicator color (green)
            },
          }}
          aria-label="admin dashboard tabs"
        >
          <Tab
            icon={<FactCheckIcon />}
            iconPosition="start"
            value="projects"
            label="Projects"
            sx={{
              color: activeTab === "projects" ? "#037999" : "inherit", // Set green color for active tab text
              "&.Mui-selected": {
                color: "#037999", // Ensure green color is applied when the tab is selected
              },
            }}
          />

          <Tab
            icon={<PermDataSettingIcon />}
            iconPosition="start"
            value="testcases"
            label="Testcases"
            sx={{
              color: activeTab === "testcases" ? "#037999" : "inherit", // Set green color for active tab text
              "&.Mui-selected": {
                color: "#037999", // Ensure green color is applied when the tab is selected
              },
            }}
          />
          <Tab
            icon={<BugReportIcon />}
            iconPosition="start"
            value="testruns"
            label="TestRuns"
            sx={{
              color: activeTab === "testruns" ? "#037999" : "inherit", // Set green color for active tab text
              "&.Mui-selected": {
                color: "#037999", // Ensure green color is applied when the tab is selected
              },
            }}
          />
        </Tabs>
      </Box>
      {renderContent()}
    </div>
  );
};

export default UserView;
