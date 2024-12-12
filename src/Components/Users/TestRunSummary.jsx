import { useEffect, useState } from "react";
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
} from "recharts";
import { TestRunSummaryApi } from "../API/Api";
import { useLocation } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TestRunSummary = () => {
  const location = useLocation();
  const testRun = location.state?.testRun || {};
  const [summaryData, setSummaryData] = useState(null);

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
    { name: "Pass", value: summaryData.pass, color: "#00C49F" },
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

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Test Run Summary
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <Paper elevation={3} sx={{ padding: 2, margin: 1, flex: "1 1 30%" }}>
          <Typography variant="h6" gutterBottom>
            Overall Status Report
          </Typography>
          <BarChart width={300} height={300} data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis />

            <XAxis dataKey="name" />
            <Tooltip />

            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => {
                const item = barChartData.find((data) => data.name === value);
                console.log("the item is", item);
                if (item) {
                  return (
                    <span style={{ color: item.color }}>
                      {item.name} ({item.value})
                    </span>
                  );
                }
                return value;
              }}
            />

            <Bar dataKey="value" name="Overall Status">
              {barChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </Paper>

        <Paper elevation={3} sx={{ padding: 2, margin: 1, flex: "1 1 30%" }}>
          <Typography variant="h6" gutterBottom>
            Feature of Pass Percentage
          </Typography>
          <PieChart width={300} height={300}>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => (
                <span>
                  {value} (
                  {pieChartData.find((data) => data.name === value)?.value || 0}
                  )
                </span>
              )}
            />
          </PieChart>
        </Paper>

        <Paper elevation={3} sx={{ padding: 2, margin: 1, flex: "1 1 30%" }}>
          <Typography variant="h6" gutterBottom>
            Test Results by Test Type
          </Typography>
          <BarChart width={300} height={300} data={testTypeBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="PASS" fill="#00C49F" name="Pass" barSize={30} />
            <Bar dataKey="FAIL" fill="#FF0000" name="Fail" barSize={30} />
            <Bar dataKey="SKIP" fill="#FFA500" name="Skip" barSize={30} />
          </BarChart>
        </Paper>
      </Box>
    </Box>
  );
};

export default TestRunSummary;
