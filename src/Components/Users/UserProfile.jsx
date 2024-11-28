import  { useState } from "react";
import { updateRegister } from "../API/Api";
import Swal from "sweetalert2";

const UserProfile = () => {
  // Parse user details from session storage
  const userDetails = JSON.parse(sessionStorage.getItem("user")) || {};

  // Initialize state with user details
  const [formData, setFormData] = useState({
    empDepartment: userDetails.empDepartment || "",
    empEmail: userDetails.empEmail || "",
    empMob: userDetails.empMob || "",
    empName: userDetails.empName || "",
    empRole: userDetails.empRole || "",
    id: userDetails.id || "",
    password: userDetails.password || "",
    status: userDetails.status || false,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulated API call for updating details
    updateRegister(formData)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          // Show success alert
          Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your profile has been successfully updated.",
            confirmButtonText: "OK",
          });
        } else {
          // Show error alert
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "There was an issue updating your profile. Please try again.",
            confirmButtonText: "Retry",
          });
        }
      })
      .catch((error) => {
        // Show error alert for unexpected issues
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unexpected error occurred. Please try again later.",
          confirmButtonText: "Close",
        });
        console.log(error)
      });

    console.log("Updated User Details:", formData);
  };
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Employee Name</label>
          <input
            type="text"
            className="form-control"
            name="empName"
            value={formData.empName}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="empEmail"
            value={formData.empEmail}
            onChange={handleInputChange}
            readOnly

          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile</label>
          <input
            type="text"
            className="form-control"
            name="empMob"
            value={formData.empMob}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <input
            type="text"
            className="form-control"
            name="empDepartment"
            value={formData.empDepartment}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <input
            type="text"
            className="form-control"
            name="empRole"
            value={formData.empRole}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="status"
              checked={formData.status}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Active</label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
