import { useEffect, useState } from "react";
import {
  getAllBranchesByCompany,
  getAllCompany,
  getProjectsByBranchId,
  getProjectUsers,
  getRegisterForBranch,
} from "../API/Api";
import moment from "moment";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PeopleIcon from "@mui/icons-material/People";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import TablePagination from "../Pagination/TablePagination";
const View = () => {
  const [activeTab, setActiveTab] = useState("companies");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

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

  // Handle tab change
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  useEffect(() => {
    getAllCompany()
      .then((response) => setCompanies(response.data))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    if (selectedProject) {
      getProjectUsers(selectedProject)
        .then((response) => setUsers(response.data))
        .catch((err) => console.log(err));
    } else {
      setBranches([]);
    }
  }, [selectedProject]);
  useEffect(() => {
    if (selectedCompany) {
      getAllBranchesByCompany(selectedCompany, page - 1, itemsPerPage)
        .then((response) => {
          setBranches(response.data.content);
          setTotalPages(response.data.totalPages);
        })
        .catch((err) => console.log(err));
    } else {
      setBranches([]);
    }
  }, [selectedCompany, page - 1, itemsPerPage]);

  useEffect(() => {
    // Fetch admins whenever the selectedBranch changes
    if (selectedBranch) {
      getRegisterForBranch(selectedBranch, page - 1, itemsPerPage)
        .then((response) => {
          setAdmins(response.data.content);
          setTotalPages(response.data.totalPages);
        })
        .catch((err) => console.log(err));
    } else {
      setAdmins([]); // Clear admins if no branch is selected
    }
  }, [selectedBranch, page - 1, itemsPerPage]);
  useEffect(() => {
    // Fetch admins whenever the selectedBranch changes
    if (selectedBranch) {
      getProjectsByBranchId(selectedBranch)
        .then((response) => setProjects(response.data))
        .catch((err) => console.log(err));
    } else {
      setAdmins([]); // Clear admins if no branch is selected
    }
  }, [selectedBranch, getProjectsByBranchId]);
  const renderContent = () => {
    switch (activeTab) {
      case "companies":
        return (
          <div className="container mt-4 text-center">
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
                    <th>Company ID</th>
                    <th>Company Name</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id}>
                      <td>{company.cmpId}</td>
                      <td>{company.cmpName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "branches":
        return (
          <div className="text-center">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Select a Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.cmpName}
                </option>
              ))}
            </select>
            {selectedCompany && (
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
                <table className="table table-hover mt-3">
                  <thead className="">
                    <tr>
                      <th>Branch ID</th>
                      <th>Branch Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.length > 0 ? (
                      branches.map((branch) => (
                        <tr key={branch.id}>
                          <td>{branch.branchId}</td>
                          <td>{branch.branchName}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center">
                          No Branches available for this Company.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
              </div>
            )}
          </div>
        );
      case "admin":
        return (
          <div className="text-center">
            <select
              style={{ marginRight: "20px" }}
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Select a Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.cmpName}
                </option>
              ))}
            </select>
            {selectedCompany && (
              <>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="">Select a Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
                {selectedBranch && (
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
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {admins.length > 0 ? (
                            admins
                              .filter((admin) =>
                                admin.empRole.includes("Admin")
                              )
                              .map((admin) => (
                                <tr key={admin.id}>
                                  <td>{admin.id}</td>
                                  <td>{admin.empName}</td>
                                  <td>{admin.empEmail}</td>
                                  <td>{admin.empMob}</td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center">
                                No admins available for this branch.
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
            )}
          </div>
        );
      case "projects":
        return (
          <div className="text-center">
            <select
              style={{ marginRight: "20px" }}
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Select a Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.cmpName}
                </option>
              ))}
            </select>
            {selectedCompany && (
              <>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="">Select a Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
                {selectedBranch && (
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
                )}
              </>
            )}
          </div>
        );
      case "users":
        return (
          <div className="text-center">
            {/* Company Selection */}
            <select
              style={{ marginRight: "20px" }}
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Select a Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.cmpName}
                </option>
              ))}
            </select>

            {/* Branch Selection */}
            {selectedCompany && (
              <>
                <select
                  style={{ marginRight: "20px" }}
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="">Select a Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>

                {/* Project Selection */}
                {selectedBranch && (
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
                              <th>Name</th>
                              <th>Email</th>
                              <th>Mobile Numer</th>
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
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center">
                                  No users available for this project.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        </div>
                      </div>
                     
                    )}
                  </>
                )}
              </>
            )}
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
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="admin dashboard tabs"
        >
          <Tab
            icon={<ApartmentIcon />}
            iconPosition="start"
            value="companies"
            label="Companies"
          />
          <Tab
            icon={<AccountTreeIcon />}
            iconPosition="start"
            value="branches"
            label="Branches"
          />
          <Tab
            icon={<PeopleAltIcon />}
            iconPosition="start"
            value="admin"
            label="Admins"
          />
          <Tab
            icon={<FactCheckIcon />}
            iconPosition="start"
            value="projects"
            label="Projects"
          />
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            value="users"
            label="Users"
          />
        </Tabs>
      </Box>
      {renderContent()}
    </div>
  );
};

export default View;
