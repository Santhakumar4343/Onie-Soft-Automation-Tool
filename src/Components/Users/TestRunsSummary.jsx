import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getTestRunByProjectId, TestRunsSummaryApi } from "../API/Api";
import TablePagination from "../Pagination/TablePagination";
import { useLocation, useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
const COLORS = ["#0088FE", "#f7485f", "#FFBB28","#12e38c", "#e80cd9"]; 

const TestRunsSummary = () => {
  const [data, setData] = useState([]); 
  const location=useLocation();
  const project=location.state?.project;
  const navigate=useNavigate();
  
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
    const query="completed";
    getTestRunByProjectId(project.id,query, page - 1, itemsPerPage)
      .then((response) => {
        setTestRuns(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => console.log(err));
  }, [project.id,page - 1, itemsPerPage]);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TestRunsSummaryApi(project.id); 
        const result = await response.data;
         setTotalTestRuns(result.totalTestRuns)
     
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
  return (
    <div>
    <div
    style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
       
      }}>
      <h2>Test Runs Summary</h2>
      <PieChart width={400} height={420}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="100%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
            layout="vertical"
            align="right"
            verticalAlign="bottom"
            wrapperStyle={{
                position: "absolute",
                right: -200,
                bottom: 50,
                display: "flex",
                flexDirection: "column",
              }}
            content={({ payload }) => (
              <div>
               
                <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
                  Total Test Runs: {totalTestRuns}
                </div>
                
                {payload.map((entry, index) => (
                  <div key={`item-${index}`} style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        backgroundColor: entry.color,
                        marginRight: "5px",
                      }}
                    />
                    {entry.value}
                  </div>
                ))}
              </div>
            )}
          />
      </PieChart>
    </div>
    <h4 className="">Test Runs </h4>
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
        <table className="table  table-hover">
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
              <th>Test Run Name</th>
              <th>Created By</th>
              <th>No. of Test Cases</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testRuns.map((testRun, index) => (
              <tr
                key={index}
                style={{
                  cursor: "pointer",
                  backgroundColor: "rgb(79, 103, 228)",
                  color: "white",
                }}
              >
                <td>{testRun.testRunName}</td>
                <td>{testRun.createdBy}</td>
                <td>{testRun.testCaseCount}</td>
                <div>
                 
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
                 
                </div>
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
