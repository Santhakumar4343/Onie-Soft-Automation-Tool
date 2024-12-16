import { useEffect, useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getProjectsByProjectId,
  updateConfig,
  updateProject,
} from "../API/Api";
import Swal from "sweetalert2";

const Configurations = () => {
  const location = useLocation();
  const project = location.state?.project;
  const navigate = useNavigate();

  
  useEffect(() => {
    getProjectsByProjectId(project.projectId)
      .then((response) => {
        const data=response.data;
      })
      .catch((err) => console.log(err));
  }, [project.projectId]);
 
  const [basicAuth, setBasicAuth] = useState(false);

  const [authentication, setAuthentication] = useState({
    basicAuthUser: "",
    basicAuthPassword: "",
  });

  const [url, setUrl] = useState({
    url: "",
    apiBaseURL: "",
  });

  const [wait, setWait] = useState({
    shortWait: 15,
    customWait: 30,
    retryCount: 0,
  });

  const [count, setCount] = useState({
    notifyBlockerCount: 0,
    notifyCriticalCount: 0,
    notifyMajorCount: 0,
  });
  const [jiraConfig, setJiraConfig] = useState({
    jiraUserName: "",
    jiraPassword: "",
    jiraURL: "",
    jiraProjectKey: "",
  });
  const [emailReportTo, setEmailReportTo] = useState("");
  const [elasticSearchURL, setElasticSearchURL] = useState("");
  const [enableLiveReporting, setEnableLiveReporting] = useState(false);
  const [notifyTeams, setNotifyTeams] = useState(false);
  const [sendEmailReport, setSendEmailReport] = useState(false);
  const [createJiraIssues, setCreateJiraIssues] = useState(true);
  // Default: Live Reporting disabled
  const [overrideReport, setOverrideReport] = useState(false);
  const [browser, setBrowser] = useState("chrome");
  const [testType, setTestType] = useState("all");
  const [headLess, setHeadLess] = useState(false);
  const [traceView, setTraceView] = useState(false);
  const [enableRecording, setEnableRecording] = useState(false);

  const [modalData, setModalData] = useState({
    projectName: project.projectName,
    projectPath: project.projectPath,
    ipAddress: project.ipAddress,
  });
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    getProjectsByProjectId(project.projectId)
      .then((response) => {
        const data=response.data;
        setBasicAuth(data.basicAuth)
        setUrl({ url: data.url, apiBaseURL: data.apiBaseURL });
        setAuthentication({
            basicAuthUser: data.basicAuthUser,
            basicAuthPassword: data.basicAuthPassword
          });
          setWait({
            shortWait: data.shortWait,
            customWait: data.customWait,
            retryCount: data.retryCount,
          })
          setBrowser(data.browser)
          setTestType(data.testType)
          setHeadLess(data.headLess);
          setTraceView(data.traceView);
          setEnableRecording(data.enableRecording)
          setEnableLiveReporting(data.enableLiveReporting)
          setOverrideReport(data.overrideReport);
          setNotifyTeams(data.notifyTeams);
          setCount({
            notifyBlockerCount: data.notifyBlockerCount,
            notifyCriticalCount: data.notifyCriticalCount,
            notifyMajorCount: data.notifyMajorCount,
          })
          setSendEmailReport(data.sendEmailReport)
          setEmailReportTo(data.emailReportTo)
          setElasticSearchURL(data.elasticSearchURL)
          setCreateJiraIssues(data.createJiraIssues)
         setJiraConfig({
            jiraUserName: data.jiraUserName,
            jiraPassword: data.jiraPassword,
            jiraURL: data.jiraURL,
            jiraProjectKey: data.jiraProjectKey,
          })
          
      })
      .catch((err) => console.log(err));
  }, [project.projectId]);

  const handleNestedChange = (setter) => (key) => (e) => {
    setter((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleUpdate = () => {
    const data = {
    id:project.id,
      userId: user.id,
      projectId: project.projectId,
      projectName: modalData.projectName,
      ipAddress: modalData.ipAddress,
      projectPath: modalData.projectPath,
    };

    // Call updateConfig with the data
    updateConfig(data)
      .then(() => {
        // Success alert after update
        Swal.fire("Success", "Project updated successfully!", "success");
        navigate("/userDashboard/config");
      })
      .catch((err) => {
        // Handle error
        console.error(err);
        Swal.fire(
          "Error",
          "An error occurred while updating the project.",
          "error"
        );
      });
  };

  const handleSubmit = () => {
    const payload = {
      id: project.projectId,
      projectName: modalData.projectName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      branchId: user.branchId,
      url: url.url,
      apiBaseURL: url.apiBaseURL,
      basicAuth,
      basicAuthUser: authentication.basicAuthUser,
      basicAuthPassword: authentication.basicAuthPassword,
      browser,
      headLess,
      traceView,
      enableRecording,
      testType,
      shortWait: wait.shortWait,
      customWait: wait.customWait,
      retryCount: wait.retryCount,
      enableLiveReporting,
      elasticSearchURL,
      overrideReport,
      notifyTeams,
      notifyBlockerCount: count.notifyBlockerCount,
      notifyCriticalCount: count.notifyCriticalCount,
      notifyMajorCount: count.notifyMajorCount,
      sendEmailReport,
      emailReportTo,
      createJiraIssues,
      jiraUserName: jiraConfig.jiraUserName,
      jiraPassword: jiraConfig.jiraPassword,
      jiraURL: jiraConfig.jiraURL,
      jiraProjectKey: jiraConfig.jiraProjectKey,
    };

    updateProject(payload).then((response) => {
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Update Successful",
          text: "Configuration updated successfully!",
        });
        navigate("/userDashboard/config");
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update configuration. Please try again.",
        });
      }
    });
  };
  return (
    <Grid container spacing={1} style={{ padding: "20px" }}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" color="#4f0e83">
          Configurations
        </Typography>
      </Grid>

      {/* App Configurations */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h6">Device Configurations</Typography>
        </Grid>
        {/* First Row */}
        <Grid item xs={6}>
          <TextField
            label="Project Directory"
            fullWidth
            margin="normal"
            value={modalData.projectPath}
            onChange={(e) =>
              setModalData({ ...modalData, projectPath: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="IP Address"
            fullWidth
            margin="normal"
            variant="outlined"
            value={modalData.ipAddress}
            onChange={(e) =>
              setModalData({ ...modalData, ipAddress: e.target.value })
            }
          />
        </Grid>

        {/* Update Button */}
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            variant="contained"
            style={{
              backgroundColor: "#4f0e83",
              color: "white",
              borderRadius: "20px",
            }}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={1} alignItems="center" className="mt-2">
        <Grid item xs={12}>
          <Typography variant="h6">Project Configurations</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="www.qiker.com"
            fullWidth
            margin="normal"
            variant="outlined"
            value={url.url}
            name="url"
            onChange={handleNestedChange(setUrl)("url")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="apiBaseURL"
            value={url.apiBaseURL}
            label="www.qiker/api"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleNestedChange(setUrl)("apiBaseURL")}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center" className="mt-2">
        <Grid item xs={12}>
          <Typography variant="h6">Basic Auth Configurations</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={basicAuth}
                onChange={() => setBasicAuth(!basicAuth)}
              />
            }
            label="Enable Basic Auth"
          />
        </Grid>
        {basicAuth && (
          <>
            {/* Input Fields Side by Side */}
            <Grid item xs={6}>
              <TextField
                label="Basic Auth User"
                fullWidth
                name="basicAuthUser"
                margin="normal"
                variant="outlined"
                onChange={handleNestedChange(setAuthentication)(
                  "basicAuthUser"
                )}
                value={authentication.basicAuthUser}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Basic Auth Password"
                type="password"
                fullWidth
                name="basicAuthPassword"
                margin="normal"
                variant="outlined"
                value={authentication.basicAuthPassword}
                onChange={handleNestedChange(setAuthentication)(
                  "basicAuthPassword"
                )}
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Runner Configurations */}
      <Grid container spacing={2} alignItems="center" className="mt-2">
        <Grid item xs={12}>
          <Typography variant="h6">Runner Configurations</Typography>
        </Grid>

        {/* Browser Select */}
        <Grid item xs={6}>
          <Select
            value={browser}
            onChange={(e) => setBrowser(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          >
            <MenuItem value="chrome">Chrome</MenuItem>
            <MenuItem value="firefox">Firefox</MenuItem>
            <MenuItem value="edge">Edge</MenuItem>
          </Select>
        </Grid>

        {/* Test Type Select */}
        <Grid item xs={6}>
          <Select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="api">API</MenuItem>
            <MenuItem value="web">Web</MenuItem>
            <MenuItem value="mobile">Mobile</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={headLess}
                onChange={(e) => setHeadLess(e.target.checked)}
                color="primary"
              />
            }
            label="Headless Mode"
          />
        </Grid>

        {/* Trace View Option */}
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={traceView}
                onChange={(e) => setTraceView(e.target.checked)}
                color="primary"
              />
            }
            label="Trace View"
          />
        </Grid>

        {/* Enable Recording Option */}
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={enableRecording}
                onChange={(e) => setEnableRecording(e.target.checked)}
                color="primary"
              />
            }
            label="Enable Recording"
          />
        </Grid>
        {/* Short Wait */}
        <Grid item xs={4}>
          <TextField
            label="Short Wait"
            value={wait.shortWait}
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleNestedChange(setWait)("shortWait")}
          />
        </Grid>

        {/* Custom Wait */}
        <Grid item xs={4}>
          <TextField
            label="Custom Wait"
            value={wait.customWait}
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleNestedChange(setWait)("customWait")}
          />
        </Grid>

        {/* Retry Count */}
        <Grid item xs={4}>
          <TextField
            label="Retry Count"
            value={wait.retryCount}
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleNestedChange(setWait)("retryCount")}
          />
        </Grid>
      </Grid>

      {/* Report Configurations */}
      <Grid item xs={12}>
        <Typography variant="h6">Report Configurations</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={enableLiveReporting}
                  onChange={() => setEnableLiveReporting(!enableLiveReporting)}
                />
              }
              label="Enable Live Reporting"
            />
            {enableLiveReporting && (
              <TextField
                label="Elastic Search URL"
                value={elasticSearchURL}
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={(e) => setElasticSearchURL(e.target.value)}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={overrideReport}
                  onChange={() => setOverrideReport(!overrideReport)}
                />
              }
              label="Override Report"
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Teams Notification */}
      <Grid item xs={12}>
        <Typography variant="h6">Teams Notification</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={notifyTeams}
              onChange={() => setNotifyTeams(!notifyTeams)}
            />
          }
          label="Enable Teams Notification"
        />
        {notifyTeams && (
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Notify Blocker Count"
                value={count.notifyBlockerCount}
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={handleNestedChange(setCount)("notifyBlockerCount")}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Notify Critical Count"
                value={count.notifyCriticalCount}
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={handleNestedChange(setCount)("notifyCriticalCount")}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={count.notifyMajorCount}
                label="Notify Major Count"
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={handleNestedChange(setCount)("notifyMajorCount")}
              />
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* Email Notification */}
      <Grid item xs={12}>
        <Typography variant="h6">Email Notification</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={sendEmailReport}
              onChange={() => setSendEmailReport(!sendEmailReport)}
            />
          }
          label="Send Email Report"
        />
        {sendEmailReport && (
          <TextField
            label="Email Report To"
            value={emailReportTo}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            onChange={(e) => setEmailReportTo(e.target.value)}
          />
        )}
      </Grid>

      {/* JIRA Configurations */}
      <Grid item xs={12}>
        <Typography variant="h6">JIRA Configurations</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={createJiraIssues}
              onChange={() => setCreateJiraIssues(!createJiraIssues)}
            />
          }
          label="Create JIRA Issues"
        />
        {createJiraIssues && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="JIRA Username"
                value={jiraConfig.jiraUserName}
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={handleNestedChange(setJiraConfig)("jiraUserName")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="JIRA Password"
                value={jiraConfig.jiraPassword}
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={handleNestedChange(setJiraConfig)("jiraPassword")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="JIRA URL"
                value={jiraConfig.jiraURL}
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={handleNestedChange(setJiraConfig)("jiraURL")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={jiraConfig.jiraProjectKey}
                label="JIRA Project Key"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={handleNestedChange(setJiraConfig)("jiraProjectKey")}
              />
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* Submit Button */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className="mt-3"
      >
        <Grid item xs={3}>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#4f0e83",
              color: "white",
              borderRadius: "20px",
            }}
            fullWidth
            onClick={handleSubmit}
          >
            Save Configurations
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Configurations;
