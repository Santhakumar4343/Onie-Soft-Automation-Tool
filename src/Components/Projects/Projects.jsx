import { Modal } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [projectModal, setProjectModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [projectData, setProjectData] = useState({
    projectName: "",
  });

  const projects = [
    { id: 1, projectName: "PixaCart (B2B)" },
    { id: 2, projectName: "Project Management" },
    { id: 3, projectName: "PG Management" },
    { id: 4, projectName: "Customer Service" },
    { id: 5, projectName: "Portfolio" },
    { id: 6, projectName: "To Do" },
  ];

  const handleProject = () => {
    setProjectModal(true);
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    console.log("Project submitted:", projectData);
    setProjectModal(false);
    setProjectData({ projectName: "" });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchText.toLowerCase())
  );

  const navigate = useNavigate();
  const handleProjectClick = () => {
    navigate("/dashboard/testcases");
  };

  return (
    <div className="container-fluid py-5">
      <div className="d-flex justify-content-between mb-4">
        <button
          
          onClick={handleProject}
          style={{ height: "40px",color:"white" ,backgroundColor:"#4f0e83" ,width:"10%",borderRadius:"20px"}}
        >
          Add Project
        </button>
        <input
          type="text"
          value={searchText}
          placeholder="Search by Project Name"
          className="form-control w-50"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredProjects.map((project, index) => (
          <div
            className="col-md-4 mb-3"
            key={index}
            onClick={handleProjectClick}
          >
            <div className="card shadow-sm project-card h-100" style={{backgroundColor:"#118f8d",cursor:"pointer"}}>
              <div className="card-body">
                <h5 className="card-title text-center">{project.projectName}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={projectModal} onClose={() => setProjectModal(false)}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
           
          }}
        >
          <div className="modal-content p-4" style={{ maxWidth: "500px", width: "100%", backgroundColor:"white",borderRadius:"20px" }}>
            <h4 className="modal-title text-center">Add Project</h4>
            <form onSubmit={handleProjectSubmit} className="mt-4">
              <div className="form-group">
                <input
                  type="text"
                  name="projectName"
                  className="form-control w-80 mb-3"
                  placeholder="Project Name"
                  onChange={handleProjectChange}
                  value={projectData.projectName}
                  required
                />
              </div>
              <div className="text-center">
              <button
                  type="submit"
                  className="btn btn-primary mt-3 "
                  style={{ borderRadius: "20px", background: "#4f0e83" ,marginRight:"20px",width:"150px"}}
                  onClick={()=>{setProjectModal(false)}}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary mt-3 w-20"
                  style={{ borderRadius: "20px", background: "#4f0e83",width:"150px" }}
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;
