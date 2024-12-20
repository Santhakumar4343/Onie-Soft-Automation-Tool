import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


import moment from "moment";
import {  getTestCasesByTestRunId } from "../API/Api";
import TablePagination from "../Pagination/TablePagination";

function UserTestRunView() {
  const location = useLocation();
  const testRun = location.state?.testRun || {};
  const [testCases, setTestCases] = useState([]);
  
  const pollingInterval = 30000; // Poll every 5 seconds

  
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

   // Fetch test cases from API
   const fetchTestCases = async () => {
    try {
      const response = await getTestCasesByTestRunId(testRun.id, page-1 , itemsPerPage);
    
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
  }, [testRun.id,page, itemsPerPage]);

 

  const testCaseColors = {
    "In Progress": "blue",
    "SKIP": "orange",
    "FAIL": "red",
    "PASS": "green",}
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchInput = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);
    };
    const filteredTestCases = testCases.filter(
      (testcase) =>
        testcase.testCaseName.toLowerCase().includes(searchQuery) ||
        testcase.author.toLowerCase().includes(searchQuery)||
        testcase.feature.toLowerCase().includes(searchQuery)||
        testcase.automationId.toLowerCase().includes(searchQuery)||
        testcase.status.toLowerCase().includes(searchQuery)
    );
  return (
    <div className="container">
      <h4 style={{ color: "#4f0e83", textAlign: "center" }}>
        {testRun.testRunName} - Test Run
      </h4>
      <div className="d-flex justify-content-end align-items-center mt-3 mb-3">
       

        <input
                type="text"
                value={searchQuery}
                style={{width:"40%"}}
                onChange={handleSearchInput}
                placeholder="Search by Test Case Name, Author,Automation ID"
                className="form-control "
              />
      </div>
      <div style={{ maxHeight: "530px", overflowY: "auto" }}>
        <style>
          {`
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
        <table
          className="table table-hover mt-4"
          style={{ textAlign: "center" }}
        >
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
              <th>Created Date</th>
              <th>Updated Date</th>
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
                <td>
                  {moment(testCase.createdAt).format("DD-MMM-YYYY ,HH:MM:SS")}
                </td>
                <td>{testCase.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div> <TablePagination
          currentPage={page - 1}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handlePageSizeChange={handlePageSizeChange}
        /></div>
    </div>
  );
}

export default UserTestRunView;