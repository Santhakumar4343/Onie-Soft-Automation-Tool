import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  XAxis,
  Line,
  LineChart,
} from "recharts";
import { getTestCasesByTestRunId, TestRunSummaryApi } from "../API/Api";

import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Modal,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TablePagination from "../Pagination/TablePagination";
import BarChartComponent from "../Charts/BarChartComponent";
import PieChartComponent from "../Charts/PieChartComponent";
import TestResultsChart from "../Charts/TestResultsChart";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TestRunSummary = () => {
  const location = useLocation();
  const testRun = location.state?.testRun || {};
  const project = location.state?.project || {};
  const [summaryData, setSummaryData] = useState(null);
  const navigate = useNavigate();
  const [testCases, setTestCases] = useState([]);

  const [expandedRow, setExpandedRow] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [testCaseSummaryData, setTestCaseSummaryData] = useState(null);

  const dummyData = {
    totalRuns: {
      Completed: 1,
     
    },
    totalPassed: 1,
    totalFailed: 2,
    totalSkipped: 1,
    executionTimes: [833, 760, 1024, 902],
  };
  const handleTestRunClick = async () => {
    try {
      const response = dummyData;

      setTestCaseSummaryData(response);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching test run summary:", error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(0); // To store total number of pages
  const [page, setPage] = useState(1);

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

  // Fetch test cases from API
  const fetchTestCases = async () => {
    try {
      const response = await getTestCasesByTestRunId(
        testRun.id,
        page - 1,
        itemsPerPage
      );

      setTestCases(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching test cases:", error);
    }
  };

  useEffect(() => {
    fetchTestCases();
  }, [testRun.id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TestRunSummaryApi(testRun.id);
        setSummaryData(response.data);
      } catch (error) {
        console.error("Error fetching test run summary:", error);
      }
    };

    fetchData();
  }, [testRun.id]);
  const testCaseColors = {
    "In Progress": "blue",
    SKIP: "orange",
    FAIL: "red",
    PASS: "green",
  };
  if (!summaryData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const barChartData = [
    { name: "Pass", value: summaryData.pass, color: "#09ed92" },
    { name: "Fail", value: summaryData.fail, color: "#FF0000" },
    { name: "Skip", value: summaryData.skip, color: "#FFA500" },
  ];

  const pieChartData = Object.entries(summaryData.featureOfPassPercent).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  const testTypeBarData = Object.keys(summaryData.resultsByTestType).map(
    (key) => ({
      name: key,
      PASS: summaryData.resultsByTestType[key]?.PASS || 0,
      FAIL: summaryData.resultsByTestType[key]?.FAIL || 0,
      SKIP: summaryData.resultsByTestType[key]?.SKIP || 0,
    })
  );
  const handleBackwardClick = () => {
    navigate(`/userDashboard/testRunsSummary/${project.id}`);
  };

  const convertToMinutes = (executeTime) => {
    const milliseconds = parseInt(executeTime, 10);
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes} min ${seconds} sec`;
  };

  const sortedTestCases = [...testCases].sort((a, b) => {
    const statusOrder = { FAIL: 0, SKIP: 1, PASS: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div>
      <Box p={3}>
        <div className="d-flex">
          <Tooltip title="Back" arrow placement="right">
            <IconButton onClick={handleBackwardClick}>
              <ArrowBackIcon sx={{ fontSize: "2rem", color: "#4f0e83" }} />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" gutterBottom>
            {testRun.testRunName} : Summary
          </Typography>
        </div>

        <Box display="flex" justifyContent="space-between">
       
          <Paper elevation={3} sx={{ padding: 2, margin: 1, flex: "1 1 30%" }}>
          <BarChartComponent
            data={barChartData}
            colors={barChartData.map((item) => item.color)}
            dataKey="value"
            title="Overall Status Report"
            totalCases={summaryData.totalTestCases}
          />
        </Paper>
        
          <Paper elevation={3} sx={{ padding: 2, margin: 1, flex: "1 1 30%" }}>
          <PieChartComponent
            data={pieChartData}
            
            title="Feature of Pass Percentage"
          />
        </Paper>
          

         

          <TestResultsChart data={testTypeBarData}  title="Test Results By Test Type"/>
         
       
        </Box>
      </Box>
      <h4 className="mb-2">Test Cases</h4>
      <div>
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

              <th>Execution Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedTestCases.map((testCase, index) => (
              <React.Fragment key={index}>
                <tr key={index}>
                  <td onClick={() => handleTestRunClick(testCase.id)}>
                    {testCase.testCaseName}
                  </td>
                  <td>{testCase.automationId}</td>
                  <td>
                    <span
                      style={{
                        color: testCaseColors[testCase.status],
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      onClick={() => handleRowClick(index)}
                    >
                      {testCase.status}
                    </span>
                  </td>

                  <td>{convertToMinutes(testCase.executeTime)}</td>
                </tr>

                {expandedRow === index && (
                  <tr>
                    <td colSpan="4">
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: "#fff",
                          borderRadius: "5px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {/* Render for FAIL: Both image and stack trace */}
                        {testCase.status === "FAIL" && (
                          <>
                            {testCase.image && (
                              <img
                                src={testCase.image}
                                alt="Test Case Screenshot"
                                style={{
                                  maxWidth: "100%",
                                  borderRadius: "5px",
                                  marginBottom: "10px",
                                  display: "block",
                                }}
                              />
                            )}
                            {testCase.traceStack && (
                              <pre
                                style={{
                                  backgroundColor: "#f4f4f4",
                                  padding: "10px",
                                  borderRadius: "5px",
                                  overflowX: "auto",
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                  maxHeight: "500px",
                                  overflowY: "auto",
                                  fontSize: "14px",
                                  lineHeight: "1.5",
                                }}
                              >
                                {testCase.traceStack}
                              </pre>
                            )}
                          </>
                        )}

                        {/* Render for SKIP: Only stack trace */}
                        {testCase.status === "SKIP" && testCase.traceStack && (
                          <pre
                            style={{
                              backgroundColor: "#f4f4f4",
                              padding: "10px",
                              borderRadius: "5px",
                              overflowX: "auto",
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              maxHeight: "500px",
                              overflowY: "auto",
                              fontSize: "14px",
                              lineHeight: "1.5",
                            }}
                          >
                            {testCase.traceStack}
                          </pre>
                        )}

                        {/* Render for PASS: No image or stack trace */}
                        {testCase.status === "PASS" && (
                          <p
                            style={{
                              color: "#09ed92",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            This test case passed successfully. No further
                            details available.
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        style={{
          content: {},
        }}
      >
        {testCaseSummaryData ? (
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
                maxWidth: "520px",
                width: "100%",
                backgroundColor: "white",
                borderRadius: "20px",
              }}
            >
              <h4 className="text-center">Test Case Summary</h4>
              <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "30px",
                background: "none",
                border: "none",
                fontSize: "35px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              ×
            </button>
              <div
                className="d-flex justify-content-between"
                style={{ gap: "5px" }}
              >
                <p style={{ color: "blue" }}>
                  Total Test Runs:{" "}
                  {testCaseSummaryData.totalRuns.Completed +
                    testCaseSummaryData.totalRuns.completed}
                </p>

                <p style={{ color: "green" }}>
                  Total Passed: {testCaseSummaryData.totalPassed}
                </p>
                <p style={{ color: "red" }}>
                  Total Failed: {testCaseSummaryData.totalFailed}
                </p>
                <p style={{ color: "orange" }}>
                  Total Skipped: {testCaseSummaryData.totalSkipped}
                </p>
              </div>

              {/* Line Chart for Execution Times */}
              <LineChart
                width={400}
                height={300}
                data={testCaseSummaryData.executionTimes.map((time, index) => ({
                  index: index + 1,
                  executionTime: time,
                }))}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="index"
                  label={{ value: "Runs", position: "insideBottom" }}
                />
                <YAxis
                  label={{
                    value: "Execution Time (ms)",
                    angle: -90, // Rotate the label to vertical
                    position: "insideLeft", // Align it inside and left of the chart
                    textAnchor: "middle", // Center the text horizontally
                    offset: 0, // No extra spacing
                    dy: 50, // Adjust vertical position explicitly
                  }}
                />

                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="executionTime"
                  stroke="#090de3"
                />
              </LineChart>
            </div>
            
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
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
    </div>
  );
};

export default TestRunSummary;
