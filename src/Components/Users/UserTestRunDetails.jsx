import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../TestRuns/TestRunDetails.css";

import Swal from "sweetalert2";
import {
  addTestCasestoTestRun,
  getTestCasesToEditTestRun
} from "../API/Api";
import moment from "moment";
import TablePagination from "../Pagination/TablePagination.jsx";

function UserTestRunDetails() {
  const location = useLocation();
  const project = location.state?.project || {};
  const testRun = location.state?.testRun || {};
  const data = location.state?.data || {};

  const [testCases, setTestCases] = useState([]);

  const navigate=useNavigate();

  const [page, setPage] = useState(1); // Current page number

  const [itemsPerPage, setItemsPerPage] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(0); // To store total number of pages

  const [selectedCases, setSelectedCases] = useState([]);

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

  const handleSelectedCasesAdding = (newIds) => {
    setSelectedCases((prevIds) => [...new Set([...prevIds, ...newIds])]);
  }

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        getTestCasesToEditTestRun(testRun.id, project.id, page-1, itemsPerPage).then(response => {
          console.log("Response:", response)
            setTestCases(response.data.data.testCases);
            setTotalPages(response.data.pagination.totalPages);
            handleSelectedCasesAdding(response.data.data.idsOfTestCasesInTestRun)
        });
      } catch (error) {
        console.error("Error fetching test cases:", error);
      }
    };
    // Call the fetch function
    fetchTestCases();
    console.log(testCases)
  }, [testRun.id, project.id, page-1, itemsPerPage]);

  // Handle individual row selection
  const handleCheckboxChange = (id) => {
    setSelectedCases((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = testCases.map((testCase) => testCase.automationId);
    const allSelected = currentPageIds.every((id) =>
        selectedCases.includes(id)
    );

    setSelectedCases((prevSelected) => {
      if (allSelected) {
        // Remove current page IDs if already selected
        return prevSelected.filter((id) => !currentPageIds.includes(id));
      } else {
        // Add current page IDs if not already selected
        return [...prevSelected, ...currentPageIds.filter((id) => !prevSelected.includes(id))];
      }
    });
  };

    const handleAddToTestRun = () => {
      if (selectedCases.length === 0) {
        Swal.fire("Error", "No test cases selected!", "error");
        return;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to add these test cases to the Test Run?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4f0e83",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add to Test Run!",
        customClass: {
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Prepare payload for API
          const payload = {
            testRunId: testRun.id ||data.id,
            testRunName: testRun.testRunName||data.testRunName || "Default Test Run Name",
            testCaseId: selectedCases,
          };

          addTestCasestoTestRun(payload)
            .then((response) => {
              if (response.status === 200 || response.status === 201) {
                navigate("/userDashboard/testRunView", { state: { payload, project } });
                Swal.fire(
                  "Added!",
                  "Selected test cases have been added to the Test Run.",
                  "success"
                );
                window.location.reload();
                setSelectedCases([]);
              } else {
                Swal.fire(
                  "Error",
                  "Failed to add test cases to the Test Run.",
                  "error"
                );
              }
            })
            .catch((error) => {
              console.error("Error adding test cases to the test run:", error);
            });
        }
      });
    };

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
      testcase.automationId.toLowerCase().includes(searchQuery)
  );


  return (
    <div className="container">
      <h4 style={{ color: "#4f0e83", textAlign: "center" }}>
        {project.projectName} : {testRun.testRunName ||data.testRunName} : Select Test Cases to this run{" "}
      </h4>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-3">

        <button
          onClick={handleAddToTestRun}
          disabled={selectedCases.length === 0}
          style={{
            borderRadius: "20px",
            backgroundColor: "#4f0e83",
            color: "white",
            width: "14%",
            height: "35px",
          }}
        >
          Add to Test Run
        </button>
        <input
                type="text"
                value={searchQuery}
                style={{width:"40%"}}
                onChange={handleSearchInput}
                placeholder="Search by Test Case Name, Author......"
                className="form-control "
              />
      </div>
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
        <table
          className="table  table-hover mt-4"

        >
          <thead
            style={{
              position: "sticky",
              marginTop:"10px",
              top: 0,
              backgroundColor: "#f8f9fa",
              zIndex: 100,
              color: "#4f0e83",
            }}
          >
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedCases.length === testCases.length}
                  onChange={handleSelectAll}
                />
              </th>

              <th>Test Case Name</th>
              <th>Automation ID</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestCases.map((testCase, index) => (
              <tr
                key={index}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => handleCheckboxChange(testCase.automationId)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCases.includes(testCase.automationId)}
                    onChange={() => {}}
                    style={{
                      pointerEvents: "none",
                    }}
                  />
                </td>

                <td>{testCase.testCaseName}</td>
                <td>{testCase.automationId}</td>
                <td>{testCase.author}</td>
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

  );
}


export default UserTestRunDetails;
