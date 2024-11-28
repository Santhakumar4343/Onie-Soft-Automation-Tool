import { useState } from "react";
import { updateRegister } from "../API/Api";
import Swal from "sweetalert2";

const SuperProfile = () => {
  const userDetails = JSON.parse(sessionStorage.getItem("user")) || {};

  const [formData, setFormData] = useState({
    empDepartment: userDetails.empDepartment || "",
    empEmail: userDetails.empEmail || "",
    empMob: userDetails.empMob || "",
    empName: userDetails.empName || "",
    empRole: userDetails.empRole || "",
    id: userDetails.id || "",
    status: userDetails.status || false,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateRegister(formData);
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been successfully updated.",
        });
        setIsEditing(false); // Exit editing mode after successful update
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "There was an issue updating your profile. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred. Please try again later.",
      });
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-2">
      {!isEditing ? (
        <div className="card text-center" style={{ width: "30rem" }}>
          <div className="card-body">
            <h5 className="card-title mb-4">Profile Details</h5>
            <p className="card-text">
              <strong>Name:</strong> {formData.empName}
            </p>
            <p className="card-text">
              <strong>Email:</strong> {formData.empEmail}
            </p>
            <p className="card-text">
              <strong>Mobile:</strong> {formData.empMob}
            </p>
            <p className="card-text">
              <strong>Department:</strong> {formData.empDepartment}
            </p>
            <p className="card-text">
              <strong>Role:</strong> {formData.empRole}
            </p>
            <p className="card-text">
              <strong>Status:</strong> {formData.status ? "Active" : "Inactive"}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-4" style={{ width: "30rem" }}>
          <h5 className="card-title mb-4 text-center">Edit Profile</h5>
          <div className="mb-3">
            <label className="form-label">Employee Name</label>
            <input
              type="text"
              className="form-control"
              name="empName"
              value={formData.empName}
              onChange={handleInputChange}
              required
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
              required
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
              required
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
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SuperProfile;
