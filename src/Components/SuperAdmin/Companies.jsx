import Swal from "sweetalert2";
import { CreateCompany, getAllCompany, updateCompany } from "../API/Api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { Modal, Tooltip } from "@mui/material";

const Companies = () => {
  const [projectModal, setProjectModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // To differentiate between add and edit
  const [searchText, setSearchText] = useState("");
  const [companies, setCompanies] = useState([]);
  const [companyData, setCompanyData] = useState({
    cmpName: "",
    cmpId: "",
  });

  const navigate = useNavigate();

  const handleCompanyClick = (company) => {
    navigate("/adminDashboard/departments", { state: { company } });
  };

  const handleProject = () => {
    setIsEdit(false); // Set to false for add functionality
    setCompanyData({ cmpName: "", cmpId: "" }); // Clear the data for adding new company
    setProjectModal(true);
  };

  useEffect(() => {
    getAllCompany()
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      // Call update API
      const data = {
        id: companyData.id,
        cmpId: companyData.cmpId,
        cmpName: companyData.cmpName,
      };
      updateCompany(data)
        .then((response) => {
          // Update the list and show success alert
          setCompanies((prev) =>
            prev.map((comp) =>
              comp.cmpId === response.data.cmpId ? response.data : comp
            )
          );
          Swal.fire({
            icon: "success",
            title: "Company Updated",
            text: "Your Company has been updated successfully!",
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! Could not update the Company.",
          });
          console.log(err);
        });
    } else {
      // Call create API
      CreateCompany(companyData)
        .then((response) => {
          setCompanies((prev) => [...prev, response.data]);
          Swal.fire({
            icon: "success",
            title: "Company Saved",
            text: "Your Company has been Created successfully!",
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! Could not create the Company.",
          });
          console.log(err);
        });
    }

    setProjectModal(false);
    setCompanyData({ cmpName: "", cmpId: "" });
  };
  const clearCompany = () => {
    setCompanyData({ cmpName: "", cmpId: "" });
  };
  const handleEdit = (company) => {
    setIsEdit(true); // Set to true for edit functionality
    setCompanyData({id:company.id, cmpName: company.cmpName, cmpId: company.cmpId }); // Populate modal with company details
    setProjectModal(true);
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.cmpName.toLowerCase().includes(searchText.toLowerCase()) ||
      company.cmpId.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <h4 className="text-center" style={{ color: "#4f0e83" }}>
        Companies
      </h4>
      <div className="d-flex justify-content-between mb-4">
        <button
          onClick={handleProject}
          style={{
            height: "40px",
            color: "white",
            backgroundColor: "#4f0e83",
            width: "10%",
            borderRadius: "20px",
          }}
        >
          Add Company
        </button>
        <input
          type="text"
          value={searchText}
          placeholder="Search by Company Name"
          className="form-control"
          style={{ width: "40%" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredCompanies.map((company, index) => (
          <div className="col-md-4 mb-5" key={index}>
            <div
              className="card shadow-sm project-card d-flex"
              style={{ backgroundColor: "rgb(79 103 228)", cursor: "pointer" }}
            >
              <div
                className="card-body"
                onClick={() => handleCompanyClick(company)}
              >
                <h5
                  className="card-title text-center"
                  style={{ color: "white" }}
                >
                  {company.cmpId}
                </h5>
                <h5
                  className="card-title text-center"
                  style={{ color: "white" }}
                >
                  {company.cmpName}
                </h5>
              </div>
              <Tooltip title="Edit" arrow placement="bottom" >
              <div
                className="card-footer d-flex justify-content-center"
                style={{ color: "white" }}
                onClick={() => handleEdit(company)}
              >
                <EditIcon />
              </div>
              </Tooltip>
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
          <div
            className="modal-content p-4"
            style={{
              maxWidth: "500px",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "20px",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setProjectModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "35px",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              &times;
            </button>

            <h4 className="modal-title text-center">
              {isEdit ? "Update Company" : "Add Company"}
            </h4>
            <form onSubmit={handleProjectSubmit} className="mt-4">
              <div className="form-group">
                <input
                  type="text"
                  name="cmpId"
                  className="form-control w-80 mb-3"
                  placeholder="Company Id"
                  onChange={handleProjectChange}
                  value={companyData.cmpId}
                  required
                  readOnly={isEdit}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="cmpName"
                  className="form-control w-80 mb-3"
                  placeholder="Company Name"
                  onChange={handleProjectChange}
                  value={companyData.cmpName}
                  required
                />
              </div>
              <div className="text-center">
                <button
                  onClick={clearCompany}
                  className="btn btn-secondary mt-3"
                  style={{
                    borderRadius: "20px",

                    width: "150px",
                    marginRight: "10px",
                  }}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  style={{
                    borderRadius: "20px",
                    background: "#4f0e83",
                    width: "150px",
                  }}
                >
                  {isEdit ? "Update Company" : "Add Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Companies;
