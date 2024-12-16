import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import {
    executeTestRun,
    getTestCasesByTestRunId,
    testRunConfig,
    updateRunConfig,
} from "../API/Api";
import TablePagination from "../Pagination/TablePagination";
import Swal from "sweetalert2";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Tab,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {DatePicker, TimePicker} from "@mui/x-date-pickers";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function UserTestRunView() {
    const location = useLocation();
    const testRun = location.state?.testRun || {};
    const payload = location.state?.payload || {};
    const project = location.state?.project || {};
   
    const [testCases, setTestCases] = useState([]);
    const pollingInterval = 30000; // Poll every 5 seconds
    const navigate = useNavigate();
    const [page, setPage] = useState(1); // Current page number

    const [itemsPerPage, setItemsPerPage] = useState(10); // Default page size
    const [totalPages, setTotalPages] = useState(0); // To store total number of pages

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage + 1); // Since pagination is 1-indexed
    };

    // Handle previous page
    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };
    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    // Handle page size change
    const handlePageSizeChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setPage(1); // Reset to first page on page size change
    };

    const handleEditTestRun = () => {
        navigate("/userDashboard/testRunDetails", {state: {project, testRun}});
    }

    // Fetch test cases from API
    const fetchTestCases = async () => {
        try {
            const response = await getTestCasesByTestRunId(
                testRun.id || payload.testRunId,
                page - 1,
                itemsPerPage
            );

            setTestCases(response.data.content); // Extract content for the test cases
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching test cases:", error);
        }
    };

    useEffect(() => {
        // Fetch immediately on mount
        fetchTestCases();

        // Set up polling using setInterval
        const intervalId = setInterval(() => {
            fetchTestCases();
        }, pollingInterval);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [testRun.id || payload.id, page, itemsPerPage]);

    const testCaseColors = {
        "In Progress": "blue",
        SKIP: "orange",
        FAIL: "red",
        PASS: "green",
    };

    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchInput = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    };
    const filteredTestCases = testCases.filter(
        (testcase) =>
            testcase.testCaseName.toLowerCase().includes(searchQuery) ||
            testcase.author.toLowerCase().includes(searchQuery) ||
            testcase.feature.toLowerCase().includes(searchQuery) ||
            testcase.automationId.toLowerCase().includes(searchQuery) ||
            testcase.status.toLowerCase().includes(searchQuery)
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleTestRun = () => {
        setIsModalOpen(true);
    };

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

    useEffect(() => {
        testRunConfig(testRun.id || payload.id)
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
    }, [testRun.id || payload.id]);

    const handleNestedChange = (setter) => (key) => (event) => {
      const newValue = event.target.value; // Extract the value from the event
      setter((prev) => ({
        ...prev,
        [key]: newValue,
      }));
    };
    

    const handleSubmit = (startExecution) => {
        const payload = {
            id: id,
            testRunId: testRun.id || payload.id,
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
                setIsModalOpen(false);
                Swal.fire({
                    icon: "success",
                    title: "Update Successful",
                    text: "Configuration updated successfully!",
                });
                if (startExecution) {
                    executeTestRun(testRun.id);
                    Swal.fire({
                      icon: "success",
                      title: "Execution Started Successfully!!",
                      text: "Test Run Execution Started Successfully!!",
                  });
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

    const handleBackwardClick = () => {
        navigate("/userDashboard/testruns", {state: {project}});
    };
    return (
        <div className="container">
            <div className="d-flex align-items-center justify-content-between">
                <Tooltip title="Back" arrow placement="right">
                    <Tab
                        icon={
                            <ArrowBackIcon
                                sx={{fontSize: "2rem", color: "#4f0e83"}}
                                onClick={handleBackwardClick}
                            />
                        }
                    ></Tab>
                </Tooltip>
                <h4 style={{color: "#4f0e83", textAlign: "center"}}>
                    {project.projectName} : {testRun.testRunName || payload.testRunName} :
                    Test Cases in this run
                </h4>
                <h4></h4>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                <div>
                    <button
                        onClick={handleTestRun}
                        style={{
                            height: "40px",
                            color: "white",
                            backgroundColor: "#4f0e83",
                            width: "110px",
                            borderRadius: "20px",
                            marginRight: "10px",
                        }}
                    >
                        Execute
                    </button>
                    <button
                        onClick={handleEditTestRun}
                        style={{
                            color: "white",
                            backgroundColor: "#4f0e83",
                            borderRadius: "20px",
                            padding: "8px 15px",
                            width: "110px",
                            height: "40px",
                        }}
                    >
                        Edit
                    </button>
                </div>

                <input
                    type="text"
                    value={searchQuery}
                    style={{width: "40%"}}
                    onChange={handleSearchInput}
                    placeholder="Search by Test Case Name, Author,Automation ID"
                    className="form-control "
                />
            </div>
            <div style={{maxHeight: "530px", overflowY: "auto"}}>
                <style>
                    {`
>
          div::-webkit-scrollbar {
            width: 2px;
          }
          div::-webkit-scrollbar-thumb {
            background-color: #4f0e83;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-track {
            background-color: #e0e0e0;
          }
          div {
            scrollbar-width: thin;
            scrollbar-color: #4f0e83 #e0e0e0;
          }
        `}
                </style>
                <table className="table table-hover">
                    <thead
                        style={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "#f8f9fa",
                            zIndex: 100,
                            color: "#4f0e83",
                        }}
                    >
                    <tr>
                        <th>Test Case Name</th>
                        <th>Automation ID</th>
                        <th>Status</th>
                        <th>Author</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTestCases.map((testCase, index) => (
                        <tr key={index}>
                            <td>{testCase.testCaseName}</td>
                            <td>{testCase.automationId}</td>
                            <td>
                  <span
                      style={{
                          color: testCaseColors[testCase.status],
                          fontWeight: "bold",
                      }}
                  >
                    {testCase.status}
                  </span>
                            </td>
                            <td>{testCase.author}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div>
                <TablePagination
                    currentPage={page - 1}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    handlePreviousPage={handlePreviousPage}
                    handleNextPage={handleNextPage}
                    handlePageSizeChange={handlePageSizeChange}
                />
            </div>

            <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6">
                        {project.projectName} : {testRun.testRunName} : Configurations
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={handleClose}>
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
}

export default UserTestRunView;
