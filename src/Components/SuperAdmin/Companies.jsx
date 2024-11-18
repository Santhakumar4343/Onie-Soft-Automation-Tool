import { Modal } from "@mui/material";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { CreateCompany, getAllCompany } from "../API/Api";

const Companies = () => {
  const [projectModal, setProjectModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [companies, setCompanies] = useState([]);
  const [companyData, setCompanyData] = useState({
    cmpName: "",
    cmpId: "",
  });

  const handleProject = () => {
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
    CreateCompany(companyData)
      .then((response) => {
        // Add the new company to the list and show success alert
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
    setProjectModal(false);
    setCompanyData({ cmpName: "", cmpId: "" });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const filteredCompanies = companies.filter((company) =>
    company.cmpName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <h2 className="text-center" style={{ color: "#4f0e83" }}>
        Companies
      </h2>
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
              <div className="card-body">
                <h5
                  className="card-title text-center"
                  style={{ color: "white" }}
                >
                  {company.cmpName}
                </h5>
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
          <div
            className="modal-content p-4"
            style={{
              maxWidth: "500px",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "20px",
            }}
          >
            <h4 className="modal-title text-center">Add Company</h4>
            <form onSubmit={handleProjectSubmit} className="mt-4">
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
                  type="button"
                  className="btn btn-secondary mt-3"
                  style={{
                    borderRadius: "20px",
                    marginRight: "20px",
                    width: "150px",
                  }}
                  onClick={() => setProjectModal(false)}
                >
                  Cancel
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
                  Add Company
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
