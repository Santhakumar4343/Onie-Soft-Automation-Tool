import { useEffect, useState } from "react";
import {

  getAllCompany,
  getAssignedUserProjects,
  getProjectsByBranchId,
  getProjectUsers,
 
  getTestcaseByProjectId,
  getTestRunByProjectId,
} from "../API/Api";
import moment from "moment";

const AdminView = () => {
  const [activeTab, setActiveTab] = useState("projects");
  
  const [selectedProject, setSelectedProject] = useState("");
  
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [testcases,setTestcases]=useState([])
  const [testruns,setTestRuns]=useState([])
  const user = JSON.parse(sessionStorage.getItem("user"));
  const branchId = user.branchId;

  const [projectCounts, setProjectCounts] = useState({});

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
      getTestRunByProjectId(selectedProject)
        .then((response) => setTestRuns(response.data))
        .catch((err) => console.log(err));
    } else {
      setTestRuns([]);
    }
  }, [selectedProject]);
  useEffect(() => {
    if (selectedProject) {
      getTestcaseByProjectId(selectedProject)
        .then((response) => setTestcases(response.data))
        .catch((err) => console.log(err));
    } else {
      setTestcases([]);
    }
  }, [selectedProject]);
 
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
     
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {[ "projects", "users","testcases","testruns"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "5px 20px",
              backgroundColor: activeTab === tab ? "#4f0e83" : "#f0f0f0",
              color: activeTab === tab ? "#fff" : "#000",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default AdminView;
