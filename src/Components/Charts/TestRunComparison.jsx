// ComparisonPage.js
import { useEffect, useState } from "react";

import { TestRunSummaryApi } from "../API/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress, Tab } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BarChartComponent from "../Charts/BarChartComponent";
import PieChartComponent from "../Charts/PieChartComponent";
import TestResultsChart from "../Charts/TestResultsChart";

const TestRuncomparison = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project || {};
  const runOne = location.state?.runOne || {};
  const runTwo = location.state?.runTwo || {};

  const [summaryDataOne, setSummaryDataOne] = useState(null);
  const [summaryDataTwo, setSummaryDataTwo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseOne, responseTwo] = await Promise.all([
          TestRunSummaryApi(runOne.id),
          TestRunSummaryApi(runTwo.id),
        ]);

        setSummaryDataOne(responseOne.data);
        setSummaryDataTwo(responseTwo.data);
      } catch (error) {
        console.error("Error fetching test run summaries:", error);
      }
    };

    fetchData();
  }, [runOne.id, runTwo.id]);

  if (!summaryDataOne || !summaryDataTwo) {
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

  const prepareChartData = (summaryData) => {
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

    return { barChartData, pieChartData, testTypeBarData };
  };

  const dataOne = prepareChartData(summaryDataOne);
  const dataTwo = prepareChartData(summaryDataTwo);
  
  const handleBackwardClick = () => {
    navigate(`/userDashboard/testRunsSummary/${project.id}`,{ state: { project } });
  };
  return (
    <Box p={3}>
      <div className="d-flex align-items-center justify-contnet-center">
        <Tab
          icon={
            <ArrowBackIcon
              sx={{ fontSize: "2rem", color: "#4f0e83" }}
              onClick={handleBackwardClick}
            />
          }
        ></Tab>

        <Typography variant="h5" className="mb-2" gutterBottom>
          Comparing Test Runs: ({runOne.testRunName}) vs ({runTwo.testRunName})
        </Typography>
      </div>

      {[
        {
          name: runOne.testRunName,
          data: dataOne,
          summaryData: summaryDataOne,
        },
        {
          name: runTwo.testRunName,
          data: dataTwo,
          summaryData: summaryDataTwo,
        },
      ].map((run, index) => (
        <Box key={index} mb={5}>
          <Typography variant="h6" gutterBottom>
            Test Run: {run.name}
          </Typography>
          <Box display="flex" justifyContent="space-between" marginBottom={3}>
            <Paper
              elevation={3}
              sx={{ padding: 2, margin: 1, flex: "1 1 30%" }}
            >
              <Typography variant="h6" className="mb-2">
                Overall Status Report
              </Typography>
              <BarChartComponent
                data={run.data.barChartData}
                colors={run.data.barChartData.map((item) => item.color)}
                dataKey="value"
                totalCases={run.summaryData.totalTestCases}
              />
            </Paper>

            <Paper
              elevation={3}
              sx={{ padding: 2, margin: 1, flex: "1 1 30%" }}
            >
              <Typography variant="h6" className="mb-2">
                Feature of Pass Percentage
              </Typography>
              <PieChartComponent data={run.data.pieChartData} />
            </Paper>

            <Paper
              elevation={3}
              sx={{ padding: 2, margin: 1, flex: "1 1 30%" }}
            >
              <Typography variant="h6" className="mb-2">
                Test Results By Test Type
              </Typography>
              <TestResultsChart data={run.data.testTypeBarData} />
            </Paper>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TestRuncomparison;
