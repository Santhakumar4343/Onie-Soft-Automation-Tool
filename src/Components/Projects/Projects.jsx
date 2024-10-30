
import { Modal } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Projects=()=> {

  const [projectModal, setProjectModal] = useState(false);
  const [searchText,setSearchText] =useState("")

  const [projectData, setProjectData] = useState({
    projectName: "",
  });

  const projects = [
    {
      id: 1,
      projectName: "PixaCart(B2B)",
    },
    {
      id: 2,
      projectName: "Project Management",
    },
    {
      id: 3,
      projectName: "PG Management",
    },
    {
      id: 4,
      projectName: "Customer Service",
    },
    {
      id: 5,
      projectName: "Portfolio",
    },
    {
      id: 6,
      projectName: "To Do",
    },
  ];
  const handleProject = () => {
    setProjectModal(true);
  };
  
  const handleProjectSubmit = (e) => {
    e.preventDefault();
    console.log("Project submitted:", projectData);
    setProjectModal(false);

    setProjectData({
      ProjectName: "",
    });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

   const filteredProjects=projects.filter(project=> 
    project.projectName.toLowerCase().includes(searchText)
   )

   const navigate=useNavigate();
  
   const handleProjectClick=()=>{
     navigate("/testcases")
   }
  return (
    <div>
    <div className="body-container">
    <div className="search-container">
      <button className="project-btn" onClick={handleProject} style={{height:"35px"}}>
        Add Project
      </button>
      <input
        type="text"
        value={searchText}
        placeholder="Search by Project Name"
        className="search-input"
        onChange={(e)=>{setSearchText(e.target.value)}}
      />
    </div>
    <div className="cards-container">
      {filteredProjects.map((project, index) => (
        <div className="project-card" key={index} onClick={handleProjectClick}>
          <h3 className="project-name" >{project.projectName}</h3>
        </div>
      ))}
    </div>
  </div>

  
<Modal open={projectModal} onClose={() => setProjectModal(false)}>
<div className="modal-content">
  <h2 style={{ textAlign: "center" }}>Add Project</h2>
  <form onSubmit={handleProjectSubmit} className="property-form">
    <input
      type="text"
      name="projectName"
      placeholder="Project Name"
      onChange={handleProjectChange}
      value={projectData.projectName}
      required
    />
    <button type="submit" className="submit-button" style={{marginTop:"10px",borderRadius:"20px",background:"#4f0e83"}}>
      Add Project
    </button>
  </form>
</div>
</Modal>
</div>
  )
}
export default Projects;
