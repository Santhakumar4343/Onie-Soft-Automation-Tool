

export const API_URL='http://localhost:8088'

import axios from "axios";
 
const API_BASE_URL = "http://localhost:8088";
 
const Api = axios.create({
  baseURL: API_BASE_URL,
});
const getJwtToken = () => {
  return sessionStorage.getItem("jwt_token");
  // Replace 'yourJwtTokenKey' with the actual key you used for storing the JWT token
};

const getApiHeaders = () => {
  const jwtToken = getJwtToken();
  return {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
};
// Login Api
export const postUserLogin = (data) => {
  return Api.post("/login/v1/authenticate", data);
};
// Register Api's
export const addRegister=(data)=>{
    const headers=getApiHeaders();
    return Api.post("/register/v1/addregister",data,headers)
}
export const updateRegister=(data)=>{
    const headers=getApiHeaders();
    return Api.post("/register/v1/updateregister",data,headers)
}
export const getAllPageRegister = (page = 0, size = 10) => {
    const headers = getApiHeaders(); // Dynamically get headers when making the request
    return Api.get(`/register/v1/getallpageregister?page=${page}&size=${size}`, headers);
  };
  export const getAllRegister = () => {
    const headers = getApiHeaders(); // Dynamically get headers when making the request
    return Api.get(`/register/v1/getallreg`,headers);
  };
  export const getProfiles = (empId) => {
    const headers = getApiHeaders(); // Dynamically get headers when making the request
    return Api.get(`/register/v1/getreg?empId=${empId}`, headers);
  };
  export const deleteRegister=(id)=>{
    const headers=getApiHeaders();
    return Api.delete(`/register/v1/deleteregister?id=${id}`,headers)
  }
//   Forget Password Api
export const fogetAccountByEmpIdEmail=(data)=>{
    return Api.post("/forgetaccount/v1/forgetaccount",data)
}
export const verifyOtpAndSaveNewPwd=(data)=>{
    return Api.put("/forgetaccount/v1/verifyforgetotp",data)
}

//   Project Api's
export const addProject=(data)=>{
    const headers=getApiHeaders();
    return Api.post("/projects/v1/save",data,headers)
}
export const updateProject=(id,data)=>{
    const headers=getApiHeaders();
    return Api.put(`/projects/v1/update/${id}`,data,headers)
}
export const getProjectById=(id)=>{
    const headers=getApiHeaders();
    return Api.get(`/projects/v1/update/${id}`,headers)
}
export const getAllProject=()=>{
    const headers=getApiHeaders();
    return Api.get(`/projects/v1/getAllProjects`,headers)
}
export const deleteProjectById=(id)=>{
    const headers=getApiHeaders();
    return Api.delete(`/projects/v1/delete/${id}`,headers)
}
// Test Case Api's
export const addTestcase=(id,data)=>{
    const headers=getApiHeaders();
    return Api.post(`/testcases/v1/save/${id}`,data,headers)
}
export const updateTestcase=(id)=>{
    const headers=getApiHeaders();
    return Api.put(`/testcases/v1/update/${id}`,headers)
}
export const getTestcaseById=(id)=>{
    const headers=getApiHeaders();
    return Api.get(`/testcases/v1/get/${id}`,headers)
}
export const getAllTestcase=()=>{
    const headers=getApiHeaders();
    return Api.get(`/testcases/v1/getAll`,headers)
}
export const deleteTestcase=(id)=>{
    const headers=getApiHeaders();
    return Api.delete(`/testcases/v1/delete/${id}`,headers)
}
// Test Run Api's
export const createTestRun=(data)=>{
    const headers=getApiHeaders();
    return Api.post(`/testrun/v1/createtestrun`,data,headers)
}
export const addTestCasestoTestRun=(data)=>{
    const headers=getApiHeaders();
    return Api.post(`/testrun/v1/addtestrun`,data,headers)
}
export const getTestRunByProjectId=(id)=>{
    const headers=getApiHeaders();
    return Api.get(`/testrun/v1/gettestrunbyid?projectId=${id}`,headers)
}

export const getTestCasesByTestRunId=(id)=>{
    const headers=getApiHeaders();
    return Api.get(`/testrun/v1/testcases/${id}`,headers)
}
export const getUnmapedTestCasesByTestRunId=(id)=>{
    const headers=getApiHeaders();
    return Api.get(`/testrun/v1/testrun/v1/edittestrun/${id}`,headers)
}
// Company Api's

export const addCompany=(data)=>{
    const headers=getApiHeaders();
    return Api.post(`/cmp/v1/addcompany`,data,headers)
}
export const updateCompany=(data)=>{
    const headers=getApiHeaders();
    return Api.put(`/cmp/v1/updatecompany`,data,headers)
}
export const getCompanyById=(id)=>{
    const headers=getApiHeaders();
    return Api.get(`/cmp/v1/getcmpbyid?id=${id}`,headers)
}
export const getAllCompany=()=>{
    const headers=getApiHeaders();
    return Api.get(`/cmp/v1/getallcmp`,headers)
}
// Assign Projects to the Uses Api's
export const assignProjects=(data)=>{
    const headers=getApiHeaders();
    return Api.post(`/projectusers/v1/assignproject`,data,headers)
}
export const getAssignProjectsByRegId=(id)=>{
    const headers=getApiHeaders();
    return Api.post(`/projectusers/v1/getassignprojects/${id}`,headers)
}
export const getUnmapedProjectsByRegisterId=(id)=>{
    const headers=getApiHeaders();
    return Api.get(`/projectusers/v1/editassignproject/${id}`,headers)
}
export const deleteCompanyById=(id)=>{
    const headers=getApiHeaders();
    return Api.delete(`/cmp/v1/delete/${id}`,headers)
}


