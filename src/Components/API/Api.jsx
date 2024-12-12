export const API_URL = "http://localhost:8088";

import axios from "axios";

export const API_BASE_URL = "http://localhost:8088";

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

//company Apis

export const CreateCompany = (data) => {
    const headers = getApiHeaders();
    return Api.post("/cmp/v1/addcompany", data, headers);
};

// Register Api's
export const addRegister = (data) => {
    const headers = getApiHeaders();
    return Api.post("/register/v1/addregister", data, headers);
};
export const updateRegister = (data) => {
    const headers = getApiHeaders();
    return Api.post("/register/v1/updateregister", data, headers);
};
export const getAllPageRegister = (page = 0, size = 10) => {
    const headers = getApiHeaders(); // Dynamically get headers when making the request
    return Api.get(
        `/register/v1/getallpageregister?page=${page}&size=${size}`,
        headers
    );
};
export const getAllRegister = () => {
    const headers = getApiHeaders(); // Dynamically get headers when making the request
    return Api.get(`/register/v1/getallreg`, headers);
};
export const getRegisterForBranch = (branchId, page, itemsPerPage) => {
    const headers = getApiHeaders(); // Dynamically get headers when making the request
    return Api.get(`/adminview/v1/registersbybranchId?branchId=${branchId}&page=${page}&size=${itemsPerPage}`, headers);
};
export const getProfiles = (empId) => {
    const headers = getApiHeaders(); // Dynamically get headers when making the request
    return Api.get(`/register/v1/getreg?empId=${empId}`, headers);
};
export const deleteRegister = (id) => {
    const headers = getApiHeaders();
    return Api.delete(`/register/v1/deleteregister?id=${id}`, headers);
};
//   Forget Password Api
export const fogetAccountByEmpIdEmail = (data) => {
    return Api.post("/forgetaccount/v1/forgetaccount", data);
};
export const verifyOtpAndSaveNewPwd = (data) => {
    return Api.put("/forgetaccount/v1/verifyforgetotp", data);
};

export const unMapRegisters = (projectId, branchId) => {
    const headers = getApiHeaders();
    return Api.get(
        `/projectusers/v1/getunmapregister?projectId=${projectId}&branchId=${branchId}`,
        headers
    );
};
//   Project Api's
export const getUnMapProjects = (registerId, branchId) => {
    const headers = getApiHeaders();
    return Api.get(
        `/projectusers/v1/getunmapproject?registerId=${registerId}&branchId=${branchId}`,
        headers
    );
};
export const addProject = (data) => {
    const headers = getApiHeaders();
    return Api.post("/projects/v1/save", data, headers);
};
export const updateProject = (data) => {
    const headers = getApiHeaders();
    return Api.put(`/projects/v1/update`, data, headers);
};

export const updateConfig =(data) =>{
  const headers = getApiHeaders();
  return Api.post(`/userconfig/v1/save`, data, headers);

};
export const getProjectById = (id) => {
    const headers = getApiHeaders();
    return Api.get(`/projects/v1/update/${id}`, headers);
};
export const getAllProject = () => {
    const headers = getApiHeaders();
    return Api.get(`/projects/v1/getAllProjects`, headers);
};

export const getAllUserProjects = () => {
    const headers = getApiHeaders();
    return Api.get(`/projects/v1/getAllProjects`, headers);
};
export const getAssignedUserProjects = (usedId) => {
    const headers = getApiHeaders();
    return Api.get(`/projectusers/v1/getassignprojects/${usedId}`, headers);
};


export const getConfigDetailsForUser = (userId,page,itemsPerPage) => {
  const headers = getApiHeaders();
  return Api.get(`/userconfig/v1/getconfigsbyuid/${userId}?page=${page}&size=${itemsPerPage}`, headers);
};

export const getProjectsByProjectId= (projectId) => {
  const headers = getApiHeaders();
  return Api.get(`/projects/v1/getProject/${projectId}`, headers);
};

export const getConfigsByUseId = (usedId) => {
    const headers = getApiHeaders();
    return Api.get(`/userconfig/v1/getconfigsbyuid/${usedId}`, headers);
};
export const deleteProjectById = (id) => {
    const headers = getApiHeaders();
    return Api.delete(`/projects/v1/delete/${id}`, headers);
};
// Test Case Api's
export const addTestcase = (id, data) => {
    const headers = getApiHeaders();
    return Api.post(`/testcases/v1/save/${id}`, data, headers);
};
export const updateTestcase = (data) => {
    const headers = getApiHeaders();
    return Api.put(`/testcases/v1/update`, data, headers);
};
export const getTestcaseById = (id) => {
    const headers = getApiHeaders();
    return Api.get(`/testcases/v1/get/${id}`, headers);
};
export const getTestcaseByProjectId = (id, page, itemsPerPage) => {
    const headers = getApiHeaders();
    return Api.get(`/testcases/v1/getForProject?id=${id}&page=${page}&size=${itemsPerPage}`, headers);
};
export const edittestrun = (testRunId, projectId) => {
    const headers = getApiHeaders();
    return Api.get(
        `/testrun/v1/edittestrun?testRunId=${testRunId}&projectId=${projectId}`,
        headers
    );
};

export const getAllTestcase = () => {
    const headers = getApiHeaders();
    return Api.get(`/testcases/v1/getAll`, headers);
};
export const deleteTestcase = (id) => {
    const headers = getApiHeaders();
    return Api.delete(`/testcases/v1/delete/${id}`, headers);
};

// Test Run Api's

export const createTestRun = (data) => {
    const headers = getApiHeaders();
    return Api.post(`/testrun/v1/createtestrun`, data, headers);
};
export const TestRunsSummaryApi = (id) => {
  const headers = getApiHeaders();
  return Api.get(`/chart/v1/gettestrunresultsbyprojectid/${id}`, headers);
};

export const TestRunSummaryApi = (id) => {
    const headers = getApiHeaders();
    return Api.get(`/chart/v1/gettestcaseresults/${id}`, headers);
  };
export const addTestCasestoTestRun = (data) => {
    const headers = getApiHeaders();
    return Api.post(`/testrun/v1/addtestrun`, data, headers);
};

export const getTestRunByProjectId = (id,status,page,itemsPerPage) => {
  const headers = getApiHeaders();
  return Api.get(`/testrun/v1/gettestrunbyid?projectId=${id}&query=${status}&page=${page}&size=${itemsPerPage}`, headers);

};

export const getTestCasesByTestRunId = (id, page, itemsPerPage) => {
    const headers = getApiHeaders();
    return Api.get(`/testrun/v1/testcases?testRunId=${id}&size=${itemsPerPage}&page=${page}`, headers);
};
export const getTestCasesByTestRunIdVthout = (id) => {
    const headers = getApiHeaders();
    return Api.get(`/testrun/v1/listoftestcases?testRunId=${id}`, headers);
};
export const getTestCasesToEditTestRun = (id, projectId, page, itemsPerPage) => {
    const headers = getApiHeaders();
    return Api.get(`/testrun/v1/edittestrun/${id}/${projectId}?page=${page}&size=${itemsPerPage}`, headers);
};
export const executeTestRun = (id) => {
    return Api.post(`/testrun/v1/run/${id}`);
};

export const testRunResult = (id) => {
    return Api.get(`/testrun/v1/testcases/${id}`);
};

export const testRunConfig = (id) => {
    return Api.get(`/runconfig/v1/getrunconfig/${id}`);
};
export const updateRunConfig = (data) => {
    return Api.put(`/runconfig/v1/update`, data);
};
// Company Api's

export const addCompany = (data) => {
    const headers = getApiHeaders();
    return Api.post(`/cmp/v1/addcompany`, data, headers);
};
export const updateCompany = (data) => {
    const headers = getApiHeaders();
    return Api.put(`/cmp/v1/updatecompany`, data, headers);
};
export const getCompanyById = (id) => {
    const headers = getApiHeaders();
    return Api.get(`/cmp/v1/getcmpbyid?id=${id}`, headers);
};
export const getAllCompany = () => {
    const headers = getApiHeaders();
    return Api.get(`/cmp/v1/getallcmp`, headers);
};

//Branch APIS
export const createBranch = (data) => {
    const headers = getApiHeaders();
    return Api.post("/branch/v1/save", data, headers);
};
export const updateBranch = (data) => {
    const headers = getApiHeaders();
    return Api.put("/branch/v1/update", data, headers);
};

export const getAllBranches = () => {
    const headers = getApiHeaders();
    return Api.get("/branch/v1/getallbranch", headers);
};
export const getAllBranchesByCompany = (cmpId, page, itemsPerPage) => {
    const headers = getApiHeaders();
    return Api.get(`/adminview/v1/branchsbycmpid?cmpId=${cmpId}&page=${page}&size=${itemsPerPage}`, headers);
};
export const getBranchById = (branchId) => {
    const headers = getApiHeaders();
    return Api.get(`branch/v1/getbranchbyid/${branchId}`, headers);
};
// Assign Projects to the Uses Api's
export const assignProjects = (data) => {
    const headers = getApiHeaders();
    return Api.post(`/projectusers/v1/assignproject`, data, headers);
};
export const assignUser = (data) => {
    const headers = getApiHeaders();
    return Api.post(`/projectusers/v1/assignuser`, data, headers);
};
export const getAssignProjectsByRegId = (id) => {
    const headers = getApiHeaders();
    return Api.get(`/projectusers/v1/getassignprojects/${id}`, headers);
};
export const getUnmapedProjectsByRegisterId = (id) => {
    const headers = getApiHeaders();
    return Api.get(`/projectusers/v1/editassignproject/${id}`, headers);
};

export const getProjectUsers = (id) => {
    const headers = getApiHeaders();
    return Api.get(`/projectusers/v1/getassignregisters/${id}`, headers);
};
export const unAssignUsers = (projectId, registerId) => {
    const headers = getApiHeaders();
    return Api.delete(
        `/projectusers/v1/unassign?projectId=${projectId}&registerId=${registerId}`,
        headers
    );
};
export const getProjectsByBranchId = (id) => {
    const headers = getApiHeaders();
    return Api.get(`/projects/v1/getprojectsbybranchid/${id}`, headers);
};
export const deleteCompanyById = (id) => {
    const headers = getApiHeaders();
    return Api.delete(`/cmp/v1/delete/${id}`, headers);
};

export const TestuRunDetails = () => {
    const headers = getApiHeaders();
    return Api.put(`/testrun/v1/addtestresults`, headers);
};


export const TestRunClone = (testRunId, projectId, data) => {
    const headers = getApiHeaders();
    return Api.post(`/testrun/v1/cloneTestRun/${testRunId}?projectId=${projectId}`,data, headers);
}