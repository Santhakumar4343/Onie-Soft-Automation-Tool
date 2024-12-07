import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";
import { executeTestRun, getTestCasesByTestRunId, testRunResult } from "../API/Api";

function UserTestRunView() {
  const location = useLocation();
  const testRun = location.state?.testRun || {};
  const [testCases, setTestCases] = useState([]);
  const [polling, setPolling] = useState(false);
  const pollingInterval = 5000; // Poll every 5 seconds


  // // Fetch initial test cases
  // useEffect(() => {
  //   if (testRun.id) {
  //     getTestCasesByTestRunId(testRun.id)
  //       .then((response) => setTestCases(response.data))
  //       .catch((err) => console.error(err));
  //   }
  // }, [testRun.id]);

  // // Polling for live status updates
  // useEffect(() => {
  //   if (polling) {
  //     const interval = setInterval(() => {
  //       testCases.forEach((testCase) => {
  //         testRunResult(testCase.id)
  //           .then((response) => {
  //             const updatedTestCase = {
  //               ...testCase,
  //               status: response.data?.status || "In Progress",
  //             };

  //             setTestCases((prevTestCases) =>
  //               prevTestCases.map((prevTestCase) =>
  //                 prevTestCase.id === updatedTestCase.id
  //                   ? updatedTestCase
  //                   : prevTestCase
  //               )
  //             );
  //           })
  //           .catch(() => {
  //             setTestCases((prevTestCases) =>
  //               prevTestCases.map((prevTestCase) =>
  //                 prevTestCase.id === testCase.id
  //                   ? { ...prevTestCase, status: "In Progress" }
  //                   : prevTestCase
  //               )
  //             );
  //           });
  //       });
  //     }, 5000); // Poll every 5 seconds
  
  //     return () => clearInterval(interval);
  //   }
  // }, [polling,testCases]);

   // Fetch test cases from API
   const fetchTestCases = async () => {
    try {
      const response = await getTestCasesByTestRunId(testRun.id);
      const data = response.data;
      console.log(data)
      setTestCases(data); // Assume the API returns an array of test cases
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
  }, []);

  // Fetch initial test cases
  useEffect(() => {
    if (testRun.id) {
      getTestCasesByTestRunId(testRun.id)
        .then((response) => setTestCases(response.data))
        .catch((err) => console.error("Error fetching test cases:", err));
    }
  }, [testRun.id]);

  // Poll for status updates
  useEffect(() => {
    if (polling) {
      const interval = setInterval(() => {
        const statusUpdates = testCases.map((testCase) =>
          testRunResult(testCase.id)
            .then((response) => ({
              id: testCase.id,
              status: response.data?.status || "In Progress",
            }))
            .catch(() => ({ id: testCase.id, status: "In Progress" }))
        );

        Promise.all(statusUpdates)
          .then((updatedStatuses) => {
            setTestCases((prevTestCases) =>
              prevTestCases.map((testCase) => {
                const updatedStatus = updatedStatuses.find(
                  (status) => status.id === testCase.id
                );
                return updatedStatus
                  ? { ...testCase, status: updatedStatus.status }
                  : testCase;
              })
            );
          })
          .catch((err) => console.error("Error polling statuses:", err));
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(interval); // Cleanup on unmount or polling stop
    }
  }, [polling, testCases]);


  const handleTestRun = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Execute Test Run?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f0e83",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Execute Test Run!",
    }).then((result) => {
      if (result.isConfirmed) {
        executeTestRun(testRun.id)
          .then((response) => {
            if (response.status === 200 || response.status === 201) {
              Swal.fire(
                "Execution Started!",
                "Test Run Execution Started Successfully.",
                "success"
              );
              setPolling(true); // Start polling
            } else {
              Swal.fire("Oops...!", "Something Went Wrong.", "error");
            }
          })
          .catch((error) => {
            console.error("Error executing test run:", error);
            Swal.fire(
              "Error!",
              "An unexpected error occurred. Please try again later.",
              "error"
            );
          });
      }
    });
  };

  const testCaseColors = {
    "In Progress": "blue",
    "SKIP": "orange",
    "FAIL": "red",
    "PASS": "green",}

  return (
    <div className="container">
      <h4 style={{ color: "#4f0e83", textAlign: "center" }}>
        {testRun.testRunName} - Test Run
      </h4>
      <div className="TestRun">
        <button
          onClick={handleTestRun}
          style={{
            borderRadius: "20px",
            backgroundColor: "#4f0e83",
            color: "white",
            width: "14%",
            maxHeight: "50px",
          }}
        >
          Execute Test Run
        </button>
      </div>
      <div style={{ maxHeight: "620px", overflowY: "auto" }}>
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
            {testCases.map((testCase) => (
              <tr key={testCase.id}>
                <td>{testCase.testCaseName}</td>
                <td>{testCase.automationId}</td>
                <td>
                  {/*
                  {testCase.status === "In Progress" ? (
                    <span style={{ color: "green" }}>
                      <i className="fa fa-spinner fa-spin"></i> In Progress
                    </span>
                  ) : (
                    testCase.status
                  )}
                  */}
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
    </div>
  );
}

export default UserTestRunView;
