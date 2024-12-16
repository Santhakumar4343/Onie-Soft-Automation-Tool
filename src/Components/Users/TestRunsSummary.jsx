import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { getTestRunByProjectId, TestRunsSummaryApi } from "../API/Api";
import TablePagination from "../Pagination/TablePagination";
import { useLocation, useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
const COLORS = ["#0088FE", "#f7485f", "#FFBB28", "#12e38c", "#e80cd9"];
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Tab } from "@mui/material";
const TestRunsSummary = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const project = location.state?.project;
  const navigate = useNavigate();

  const [testRuns, setTestRuns] = useState([]);

  const [page, setPage] = useState(1); // Current page number

  const [itemsPerPage, setItemsPerPage] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(0); // To store total number of pages
  const [totalTestRuns, setTotalTestRuns] = useState(0);
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
  useEffect(() => {
    const query = "completed";
    getTestRunByProjectId(project.id, query, page - 1, itemsPerPage)
      .then((response) => {
        setTestRuns(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => console.log(err));
  }, [project.id, page - 1, itemsPerPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TestRunsSummaryApi(project.id);
        const result = await response.data;
        setTotalTestRuns(result.totalTestRuns);

        const chartData = [
          {
            name: "New (with Test Cases)",
            value: result.newStatusWithTestCases,
          },
          {
            name: "New (without Test Cases)",
            value: result.newStatusWithOutTestCases,
          },
          { name: "In Progress", value: result.inProgressStatus },
          { name: "Completed", value: result.completed },
          { name: "Scheduled", value: result.scheduled },
        ];

        setData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [project.id]);

  const handleTestRunView = (testRun) =>
    navigate("/userDashboard/testRunSummary", { state: { project, testRun } });

  const convertToMinutes = (executeTimeInMillis) => {
    const milliseconds = parseInt(executeTimeInMillis, 10); // Ensure it's a number
    const minutes = Math.floor(milliseconds / 60000); // Convert to minutes
    const seconds = Math.floor((milliseconds % 60000) / 1000); // Remaining seconds
    return `${minutes} min ${seconds} sec`;
  };

  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedTestRuns, setSelectedTestRuns] = useState([]);

  const toggleCompareMode = () => {
    if (isCompareMode && selectedTestRuns.length === 2) {
      const runOne = selectedTestRuns[0];
      const runTwo = selectedTestRuns[1];

      // Navigate to ComparisonPage and pass state
      navigate("/userDashboard/comparison", {
        state: { runOne, runTwo, project },
      });

      // Reset state after submission
      setIsCompareMode(false);
      setSelectedTestRuns([]);
    } else {
      setIsCompareMode(!isCompareMode);
    }
  };

  const handleTestRunSelection = (testRun) => {
    if (selectedTestRuns.includes(testRun)) {
      setSelectedTestRuns(selectedTestRuns.filter((run) => run !== testRun));
    } else if (selectedTestRuns.length < 2) {
      setSelectedTestRuns([...selectedTestRuns, testRun]);
    }
  };
  const handleBackwardClick = () => {
    navigate("/userDashboard/testruns", { state: { project } });
  };
  return (
    <div>
      <div className="d-flex align-items-center justify-contnet-center">
        <Tab
          icon={
            <ArrowBackIcon
              sx={{ fontSize: "2rem", color: "#4f0e83" }}
              onClick={handleBackwardClick}
            />
          }
        ></Tab>
        <h4>Test Runs Summary</h4>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Pie Chart */}
        <PieChart width={400} height={420}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* Legend */}
        <div
          style={{
            marginLeft: "30px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
            Total Test Runs: {totalTestRuns}
          </div>
          {data.map((entry, index) => (
            <div
              key={`item-${index}`}
              style={{ display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  backgroundColor: COLORS[index % COLORS.length],
                  marginRight: "5px",
                }}
              />
              {entry.name}: {entry.value}
            </div>
          ))}
        </div>
      </div>

      <h4 className="">Completed Test Runs </h4>
      <button
        style={{
          marginLeft: "10px",

          backgroundColor: "#4f0e83",
          color: "white",
          border: "none",
          padding: " 5px 10px",
          cursor: "pointer",
          borderRadius: "20px",
          width: "10%",
        }}
        onClick={toggleCompareMode}
      >
        {isCompareMode ? "Submit" : "Compare"}
      </button>
      <div>
        <div
          style={{
            maxHeight: "520px",
            overflowY: "auto",
          }}
        >
          <style>
            {`
      /* Scrollbar styling for Webkit browsers (Chrome, Safari, Edge) */
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

      /* Scrollbar styling for Firefox */
      div {
        scrollbar-width: thin; 
        scrollbar-color: #4f0e83 #e0e0e0;   
      }
    `}
          </style>
          <table className="table table-hover">
            <thead
              className="thead-dark"
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#f8f9fa",
                zIndex: 100,
                color: "#4f0e83",
              }}
            >
              <tr>
                {isCompareMode && <th>Select</th>}
                <th>Test Run Name</th>
                <th>Created By</th>
                <th>No. of Test Cases</th>
                <th>Execution Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testRuns.map((testRun, index) => (
                <tr
                  key={index}
                  style={{
                    cursor: "pointer",
                    backgroundColor: selectedTestRuns.includes(testRun)
                      ? "rgb(79, 103, 228)"
                      : "white",
                    color: selectedTestRuns.includes(testRun)
                      ? "white"
                      : "black",
                  }}
                  onClick={(e) => {
                    if (
                      e.target.tagName !== "INPUT" &&
                      e.target.tagName !== "svg"
                    ) {
                      handleTestRunSelection(testRun);
                    }
                  }}
                >
                  {isCompareMode && (
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleTestRunSelection(testRun)}
                        checked={selectedTestRuns.includes(testRun)}
                        disabled={
                          selectedTestRuns.length === 2 &&
                          !selectedTestRuns.includes(testRun)
                        }
                      />
                    </td>
                  )}
                  <td>{testRun.testRunName}</td>
                  <td>{testRun.createdBy}</td>
                  <td>{testRun.testCaseCount}</td>
                  <td>{convertToMinutes(testRun.executeTimeInMillis)}</td>
                  <td>
                    <RemoveRedEyeIcon
                      className="me-2"
                      style={{
                        cursor:
                          testRun.testCaseCount === 0
                            ? "not-allowed"
                            : "pointer",
                        color: "#4f0e83",
                        opacity: testRun.testCaseCount === 0 ? 0.5 : 1,
                      }}
                      onClick={() =>
                        testRun.testCaseCount !== 0 &&
                        handleTestRunView(testRun)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default TestRunsSummary;
