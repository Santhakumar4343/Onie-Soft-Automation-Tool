import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";
import {
  executeTestRun,
  getTestCasesByTestRunId,
  
} from "../API/Api";

function UserTestRunView() {
  const location = useLocation();
  const project = location.state?.project || {};
  const testRun = location.state?.testRun || {};
  const [testCases, setTestCases] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({}); // Live status updates

  // Fetch initial test cases
  useEffect(() => {
    getTestCasesByTestRunId(testRun.id)
      .then((response) => setTestCases(response.data))
      .catch((err) => console.error(err));
  }, [testRun.id]);

  // Establish SSE connection for real-time updates
  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:8088/testrun/v1/addtestresults`); // SSE endpoint

    eventSource.onmessage = (event) => {
      const message = event.data;
      console.log("SSE Message received:", message);

      // Extract relevant information from the message
      const [testCaseName, status] = parseUpdateMessage(message);

      // Update the status dynamically
      if (testCaseName && status) {
        setStatusUpdates((prevUpdates) => ({
          ...prevUpdates,
          [testCaseName]: status,
        }));
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close(); // Stop SSE connection on error
    };

    // Clean up on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  const parseUpdateMessage = (message) => {
    const regex = /Test case (.+) status updated to (.+)/;
    const match = message.match(regex);
    if (match && match.length === 3) {
      return [match[1], match[2]]; // Extract testCaseName and status
    }
    return [null, null];
  };

  const handleTestRun = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Execute Test Run?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f0e83",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Execute Test Run!",
      customClass: {
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        executeTestRun(testRun.id)
          .then((response) => {
            const { status } = response;
            if (status === 200 || status === 201) {
              Swal.fire(
                "Execution Started!",
                "Test Run Execution Started Successfully.",
                "success"
              );
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

  return (
    <div className="container">
      <h2 style={{ color: "#4f0e83", textAlign: "center" }}>
        {testRun.testRunName} - Test Run
      </h2>
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
            {testCases.map((testCase, index) => (
              <tr key={index}>
                <td>{testCase.testCaseName}</td>
                <td>{testCase.automationId}</td>
                {/* Show live-updated status if available, fallback to original */}
                <td>{statusUpdates[testCase.testCaseName] || testCase.status}</td>
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
