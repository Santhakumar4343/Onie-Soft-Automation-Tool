import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";

import {useEffect, useState} from "react";


import {
    executeTestRun,
  
    testRunConfig,
  
    updateRunConfig,
} from "../API/Api";

import Swal from "sweetalert2";

import {DatePicker, TimePicker} from "@mui/x-date-pickers";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";


const Configurations = ({ testRun, isModalOpen, onClose }) => {
  
  
  
  const [wait, setWait] = useState({
    shortWait: 15,
    customWait: 30,
    retryCount: 0,
});

const [createJiraIssues, setCreateJiraIssues] = useState(true);
// Default: Live Reporting disabled
const [overrideReport, setOverrideReport] = useState(false);
const [browser, setBrowser] = useState("chrome");
const [testType, setTestType] = useState("all");
const [headLess, setHeadLess] = useState(false);
const [traceView, setTraceView] = useState(false);
const [enableRecording, setEnableRecording] = useState(false);
const [enableScheduling, setEnableScheduling] = useState(false);
const [scheduleConfig, setScheduleConfig] = useState({
    scheduleDate: "",
    scheduleTime: "",
});

const [id, setId] = useState(0);



const handleNestedChange = (setter) => (key) => (event) => {
  const newValue = event.target.value; // Extract the value from the event
  setter((prev) => ({
    ...prev,
    [key]: newValue,
  }));
};


useEffect(() => {
  testRunConfig(testRun.id )
      .then((response) => {
          const data = response.data;
          setId(data.id);

          setWait({
              shortWait: data.shortWait,
              customWait: data.customWait,
              retryCount: data.retryCount,
          });
          setBrowser(data.browser);
          setTestType(data.testType);
          setHeadLess(data.headLess);
          setTraceView(data.traceView);
          setEnableRecording(data.enableRecording);

          setOverrideReport(data.overrideReport);

          setCreateJiraIssues(data.createJiraIssues);
          setEnableScheduling(data.scheduleExecution);
          setScheduleConfig({
              scheduleDate: data.scheduledDate,
              scheduleTime: data.scheduledTime,
          });
      })
      .catch((err) => console.log(err));
}, [testRun.id]);
   
const handleSubmit = (startExecution) => {
  const payload = {
      id: id,
      testRunId: testRun.id,
      browser: browser,
      headLess: headLess,
      traceView: traceView,
      enableRecording: enableRecording,
      testType: testType,
      shortWait: wait.shortWait,
      customWait: wait.customWait,
      retryCount: wait.retryCount,
      overrideReport: overrideReport,
      createJiraIssues: createJiraIssues,
      scheduleExecution: enableScheduling,
      scheduledDate: scheduleConfig.scheduleDate,
      scheduledTime: scheduleConfig.scheduleTime,
  };
  console.log(payload);
  updateRunConfig(payload).then((response) => {
      if (response.status === 200 || response.status === 201) {
         
          Swal.fire({
              icon: "success",
              title: "Update Successful",
              text: "Configuration updated successfully!",
          });
          if (startExecution) {
              executeTestRun(testRun.id);
          }
          // navigate("/userDashboard/configpage", {state: {testRun, project}});
      } else {
          Swal.fire({
              icon: "error",
              title: "Update Failed",
              text: "Failed to update configuration. Please try again.",
          });
      }
  });
};

const handleScheduleDateChange = (newValue) => {
  // Convert Dayjs object to LocalDate (in ISO format)
  const formattedDate = newValue
      ? newValue.toISOString().split("T")[0]
      : null;
  handleNestedChange(setScheduleConfig)("scheduleDate")(formattedDate);
};

const handleScheduleTimeChange = (newValue) => {
  // Convert Dayjs object to LocalTime (in ISO format)
  const formattedTime = newValue ? newValue.format("HH:mm") : null;
  handleNestedChange(setScheduleConfig)("scheduleTime")(formattedTime);
};

  return (
 <div> 
    <Dialog open={isModalOpen} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6">
                        {testRun.testRunName} : Configurations
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={onClose}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {/* Runner Configurations */}
                    <Typography variant="h6">Runner Configurations</Typography>
                    <Grid container spacing={2} alignItems="center" className="mt-2">
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

                    <Grid container spacing={2}>
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
                        <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={createJiraIssues}
                                        onChange={() => setCreateJiraIssues(!createJiraIssues)}
                                    />
                                }
                                label="Create JIRA Issues"
                            />
                        </Grid>
                    </Grid>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={enableScheduling}
                                onChange={() => setEnableScheduling(!enableScheduling)}
                            />
                        }
                        label="Enable Scheduling"
                        className="mb-2"
                    />
                    {enableScheduling && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <DatePicker
                                        label="Schedule Date"
                                        value={
                                            scheduleConfig.scheduleDate
                                                ? dayjs(scheduleConfig.scheduleDate)
                                                : null
                                        }
                                        onChange={handleScheduleDateChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TimePicker
                                        label="Schedule Time"
                                        value={
                                            scheduleConfig.scheduleTime
                                                ? dayjs(scheduleConfig.scheduleTime, "HH:mm:ss")
                                                : null
                                        }
                                        onChange={handleScheduleTimeChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </LocalizationProvider>
                    )}
                </DialogContent>
                <DialogActions className="d-flex justify-content-center align-items-center">
                    <Button
                        variant="contained"
                        style={{
                            backgroundColor: "#4f0e83",
                            color: "white",
                            borderRadius: "20px",
                            width: "20%",
                        }}
                        onClick={() => handleSubmit(false)}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        style={{
                            backgroundColor: "#4f0e83",
                            color: "white",
                            borderRadius: "20px",
                            width: "20%",
                        }}
                        onClick={() => handleSubmit(true)}
                    >
                        Save & Execute
                    </Button>
                </DialogActions>
            </Dialog>
 </div>
  );
};

export default Configurations;
