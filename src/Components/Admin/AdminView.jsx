import { useEffect, useState } from "react";
import {
  getAssignedUserProjects,
  getProjectsByBranchId,
  getProjectUsers,
  getTestcaseByProjectId,
  getTestRunByProjectId,
} from "../API/Api";
import moment from "moment";

import PeopleIcon from "@mui/icons-material/People";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PermDataSettingIcon from "@mui/icons-material/PermDataSetting";
import { Box, Tab, Tabs } from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import TablePagination from "../Pagination/TablePagination";
const AdminView = () => {
  const [activeTab, setActiveTab] = useState("projects");

  const [selectedProject, setSelectedProject] = useState("");

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [testcases, setTestcases] = useState([]);
  const [testruns, setTestRuns] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const branchId = user.branchId;

  const [projectCounts, setProjectCounts] = useState({});

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

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  // Fetch the number of projects for each user
  useEffect(() => {
    async function fetchProjectCounts() {
      const counts = {};
      for (const user of users) {
        try {
          const userProjects = await getAssignedUserProjects(user.id);
          counts[user.id] = userProjects.length; // Assuming it returns an array
        } catch (error) {
          console.error(`Failed to fetch projects for user ${user.id}:`, error);
          counts[user.id] = 0; // Default to 0 if there's an error
        }
      }
      setProjectCounts(counts);
    }

    if (users.length > 0) {
      fetchProjectCounts();
    }
  }, [users, getAssignedUserProjects]);
  useEffect(() => {
    getProjectsByBranchId(branchId)
      .then((response) => setProjects(response.data))
      .catch((err) => console.log(err));
  }, [branchId]);

  useEffect(() => {
    if (selectedProject) {
      getTestRunByProjectId(selectedProject, page - 1, itemsPerPage)
        .then((response) => {
          setTestRuns(response.data.content);
          setTotalPages(response.data.totalPages);
        })
        .catch((err) => console.log(err));
    } else {
      setTestRuns([]);
    }
  }, [selectedProject, page - 1, itemsPerPage]);
  useEffect(() => {
    if (selectedProject) {
      getTestcaseByProjectId(selectedProject, page - 1, itemsPerPage)
        .then((response) => {
          setTestcases(response.data.content);
          setTotalPages(response.data.totalPages);
        })
        .catch((err) => console.log(err));
    } else {
      setTestcases([]);
    }
  }, [selectedProject, page - 1, itemsPerPage]);

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
        );
      case "users":
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
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile Numer</th>
                        <th>Number of Projects</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.empName}</td>
                            <td>{user.empEmail}</td>
                            <td>{user.empMob}</td>
                            <td>{projectCounts[user.id] || 0}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No users available for this project.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
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
                          <th>Created Date </th>
                          <th>Update Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testruns.length > 0 ? (
                          testruns.map((testrun) => (
                            <tr key={testrun.id}>
                              <td>{testrun.id}</td>
                              <td>{testrun.testRunName}</td>
                              <td>{testrun.status}</td>
                              <td>{testrun.createdAt}</td>
                              <td>{testrun.updatedAt}</td>
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
              backgroundColor: "#048f5c", // Indicator color (green)
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
              color: activeTab === "projects" ? "#048f5c" : "inherit", // Set green color for active tab text
              "&.Mui-selected": {
                color: "#048f5c", // Ensure green color is applied when the tab is selected
              },
            }}
          />
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            value="users"
            label="Users"
            sx={{
              color: activeTab === "users" ? "#048f5c" : "inherit", // Set green color for active tab text
              "&.Mui-selected": {
                color: "#048f5c", // Ensure green color is applied when the tab is selected
              },
            }}
          />
          <Tab
            icon={<PermDataSettingIcon />}
            iconPosition="start"
            value="testcases"
            label="Testcases"
            sx={{
              color: activeTab === "testcases" ? "#048f5c" : "inherit", // Set green color for active tab text
              "&.Mui-selected": {
                color: "#048f5c", // Ensure green color is applied when the tab is selected
              },
            }}
          />
          <Tab
            icon={<BugReportIcon />}
            iconPosition="start"
            value="testruns"
            label="TestRuns"
            sx={{
              color: activeTab === "testruns" ? "#048f5c" : "inherit", // Set green color for active tab text
              "&.Mui-selected": {
                color: "#048f5c", // Ensure green color is applied when the tab is selected
              },
            }}
          />
        </Tabs>
      </Box>
      {renderContent()}
    </div>
  );
};

export default AdminView;
