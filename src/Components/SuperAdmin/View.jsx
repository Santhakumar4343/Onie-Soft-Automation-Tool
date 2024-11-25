import  { useEffect, useState } from "react";
import {  getAllBranchesByCompany, getAllCompany,getBranchById,getProjectsByBranchId,getRegisterForBranch } from "../API/Api";

const View = () => {
  const [activeTab, setActiveTab] = useState("companies");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const [companies,setCompanies]=useState([]);
  const [ branches,setBranches]=useState([]);
  const [admins,setAdmins] =useState([]);
  const [ projects,setProjects] = useState([]);
  const users = ["User 1", "User 2", "User 3"];
   useEffect(()=>{
    getAllCompany().then(response=>setCompanies(response.data)).catch(err=>console.log(err))
   },[])
   useEffect(()=>{
    if(selectedCompany){
    getAllBranchesByCompany(selectedCompany).then(response=>setBranches(response.data)).catch(err=>console.log(err))
    }else{
      setBranches([])
    }
   },[selectedCompany])
  
   useEffect(() => {
    // Fetch admins whenever the selectedBranch changes
    if (selectedBranch) {
      getRegisterForBranch(selectedBranch)
        .then((response) => setAdmins(response.data))
        .catch((err) => console.log(err));
    } else {
      setAdmins([]); // Clear admins if no branch is selected
    }
  }, [selectedBranch, getRegisterForBranch]);
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
          <div className="container mt-4">
      <h2>Companies</h2>
      <table className="table table-hover">
        <thead className="">
          <tr>
            <th>ID</th>
            <th>Company Name</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.id}</td>
              <td>{company.cmpName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        
        );
      case "branches":
        return (
          <div>
            <h2>Branches</h2>
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
              <table className="table table-hover mt-3">
              <thead className="">
                <tr>
                  <th>ID</th>
                  <th>Branch Name</th>
                </tr>
              </thead>
              <tbody>
                {branches.length>0? (branches.map((branch) => (
                  <tr key={branch.id}>
                    <td>{branch.id}</td>
                    <td>{branch.branchName}</td>
                  </tr>
                ))):
                <tr>
                <td colSpan="2" className="text-center">
                  No Branches available for this Company.
                </td>
              </tr>}
              </tbody>
            </table>
            )}
          </div>
        );
      case "admin":
        return (
          <div>
            <h2>Admins</h2>
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
            
                  <table className="table table-hover">
                    <thead >
                      <tr>
                        <th>ID</th>
                        <th>Admin Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.length > 0 ? (
                        admins.map((admin) => (
                          <tr key={admin.id}>
                            <td>{admin.id}</td>
                            <td>{admin.empName}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">
                            No admins available for this branch.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                )}
              </>
            )}
          </div>
        );
      case "projects":
        return (
          <div>
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
            
                  <table className="table table-hover">
                    <thead >
                      <tr>
                        <th>ID</th>
                        <th>Project Name Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>{project.projectName}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">
                            No Project available for this branch.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                )}
              </>
            )}
          
          </div>
        );
      case "users":
        return (
          <div>
            <h2>Users</h2>
            <ul>
              {users.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h3 className="text-center">Super Admin-Dashboard</h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {[ "companies", "branches", "admin","projects", "users"].map((tab) => (
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

export default View;
