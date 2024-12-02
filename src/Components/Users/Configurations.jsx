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
import { updateConfig } from "../API/Api";
import Swal from "sweetalert2";

const Configurations = () => {
  const [basicAuth, setBasicAuth] = useState(false);
  const [enableLiveReporting, setEnableLiveReporting] = useState(false);
  const [notifyTeams, setNotifyTeams] = useState(false);
  const [sendEmailReport, setSendEmailReport] = useState(false);
  const [createJiraIssues, setCreateJiraIssues] = useState(true);
  // Default: Live Reporting disabled
  const [overrideReport, setOverrideReport] = useState(false);
  const [browser, setBrowser] = useState("chrome");
  const [testType, setTestType] = useState("all");

  const location = useLocation();
  const project = location.state?.project;
  const navigate=useNavigate()
  const [modalData, setModalData] = useState({
  
    projectName: project.projectName,
    projectPath: project.projectPath,
    ipAddress:project.ipAddress
  });



  const handleUpdate = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    
    const data = {
      userId: user.id,
      projectId: project.id,
      projectName: modalData.projectName,
      ipAddress: modalData.ipAddress,
      projectPath: modalData.projectPath,
    };

    // Call updateConfig with the data
    updateConfig(data)
  .then(() => {
    // Success alert after update
    Swal.fire("Success", "Project updated successfully!", "success");
    navigate("/userDashboard/config")
  })
  .catch((err) => {
    // Handle error
    console.error(err);
    Swal.fire("Error", "An error occurred while updating the project.", "error");
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
          onChange={(e) => setModalData({ ...modalData, projectPath: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="IP Address"
          fullWidth
          margin="normal"
          variant="outlined"
          value={modalData.ipAddress}
          onChange={(e) => setModalData({ ...modalData, ipAddress: e.target.value })}
        />
      </Grid>
      
      {/* Update Button */}
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
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
          <TextField label="URL" fullWidth margin="normal" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="API Base URL"
            fullWidth
            margin="normal"
            variant="outlined"
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
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Basic Auth Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
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

        {/* Short Wait */}
        <Grid item xs={4}>
          <TextField
            label="Short Wait"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Grid>

        {/* Custom Wait */}
        <Grid item xs={4}>
          <TextField
            label="Custom Wait"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Grid>

        {/* Retry Count */}
        <Grid item xs={4}>
          <TextField
            label="Retry Count"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
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
                fullWidth
                margin="normal"
                variant="outlined"
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
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Notify Critical Count"
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Notify Major Count"
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
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
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
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
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="JIRA Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="JIRA URL"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="JIRA Project Key"
                fullWidth
                margin="normal"
                variant="outlined"
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
          <Button variant="contained" color="primary" fullWidth>
            Save Configurations
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Configurations;
