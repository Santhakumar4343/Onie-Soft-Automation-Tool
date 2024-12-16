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
        setIsEditing(false);
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
    <div> <h4 className="text-center" style={{color:"#4f0e83"}}>Profile</h4>
    <div className="d-flex justify-content-center align-items-center mt-2">
     
      {!isEditing ? (
        <table className="table table-hover " style={{ width: "80%" }}>
          <thead>
           
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{formData.empName}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{formData.empEmail}</td>
            </tr>
            <tr>
              <td>Mobile</td>
              <td>{formData.empMob}</td>
            </tr>
            <tr>
              <td>Department</td>
              <td>{formData.empDepartment}</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>{formData.empRole}</td>
            </tr>
            
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="text-center"  style={{border:"none"}}>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                  style={{
                    height: "40px",
                    color: "white",
                    backgroundColor: "#4f0e83",
                    width: "15%",
                    borderRadius: "20px",
                    marginTop:"20px"
                  }}
                >
                  Edit Profile
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <form onSubmit={handleSubmit} style={{ width: "80%" }}>
          <table className="table table-hover ">
            <thead>
             
            </thead>
            <tbody>
              <tr>
                <td>Name</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="empName"
                    value={formData.empName}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td>
                  <input
                    type="email"
                    className="form-control"
                    name="empEmail"
                    value={formData.empEmail}
                    onChange={handleInputChange}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td>Mobile</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="empMob"
                    value={formData.empMob}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Department</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="empDepartment"
                    value={formData.empDepartment}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Role</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="empRole"
                    value={formData.empRole}
                    onChange={handleInputChange}
                    readOnly
                  />
                </td>
              </tr>
             <tr></tr>
            </tbody>
          
             
           
          </table>
          <div className="d-flex justify-content-center align-items-center mt-4">
            
          <button 
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setIsEditing(false)}
                    style={{
                      height: "40px",
                      color: "white", 
                      width: "10%",
                      borderRadius: "20px",
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success"
                    style={{
                      height: "40px",
                      color: "white",
                      backgroundColor: "#4f0e83",
                      width: "15%",
                      borderRadius: "20px",
                    }}>
                    Save Changes
                  </button>
          </div>
        </form>
      )}
    </div>
    </div>
  );
};

export default SuperProfile;
