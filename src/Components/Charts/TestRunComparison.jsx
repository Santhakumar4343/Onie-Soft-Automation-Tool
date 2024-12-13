// ComparisonPage.js
import { useEffect, useState } from "react";
import { Tooltip } from "recharts";
import { TestRunSummaryApi } from "../API/Api";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BarChartComponent from "../Charts/BarChartComponent";
import PieChartComponent from "../Charts/PieChartComponent";
import TestResultsChart from "../Charts/TestResultsChart";

const TestRuncomparison = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    navigate(`/userDashboard/testRunsSummary/${runOne.projectId}`);
  };

  return (
    <Box p={3}>
      <div className="d-flex">
        <Tooltip title="Back" arrow placement="right">
          <IconButton onClick={handleBackwardClick}>
            <ArrowBackIcon sx={{ fontSize: "2rem", color: "#4f0e83" }} />
          </IconButton>
        </Tooltip>
        <Typography variant="h5" gutterBottom>
          Comparing Test Runs: {runOne.testRunName} vs {runTwo.testRunName}
        </Typography>
      </div>

      {[dataOne, dataTwo].map((data, index) => (
        <Box
          key={index}
          display="flex"
          justifyContent="space-between"
          marginBottom={3}
        >
          <Paper elevation={3} sx={{ padding: 2, margin: 1, flex: "1 1 30%" }}>
            <BarChartComponent
              data={data.barChartData}
              colors={data.barChartData.map((item) => item.color)}
              dataKey="value"
              title={
                index === 0
                  ? `Overall Status Report`
                  : `Overall Status Report`
              }
              totalCases={index === 0 ? summaryDataOne.totalTestCases : summaryDataTwo.totalTestCases}
            />
          </Paper>

          <Paper elevation={3} sx={{ padding: 2, margin: 1, flex: "1 1 30%" }}>
            <PieChartComponent
              data={data.pieChartData}
              title={
                index === 0
                  ? `Feature of Pass Percentage`
                  : `Feature of Pass Percentage`
              }
            />
          </Paper>

          <TestResultsChart
            data={data.testTypeBarData}
            title={
              index === 0
                ? `Test Results By Test Type`
                : `Test Results By Test Type`
            }
          />
        </Box>
      ))}
    </Box>
  );
};

export default TestRuncomparison;
