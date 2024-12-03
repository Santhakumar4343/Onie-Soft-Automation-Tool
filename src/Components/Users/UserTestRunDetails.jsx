import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../TestRuns/TestRunDetails.css";

import Swal from "sweetalert2";
import { addTestCasestoTestRun, edittestrun } from "../API/Api";
import moment from "moment";

function UserTestRunDetails() {
  const location = useLocation();

  const project = location.state?.project || {};
  const testRun = location.state?.testRun || {};
  console.log(testRun.id);
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    edittestrun(testRun.id, project.id)
      .then((response) => setTestCases(response.data))
      .catch((err) => console.log(err));
  }, [testRun.id, project.id]);

  const [selectedCases, setSelectedCases] = useState([]);

  // Handle individual row selection
  const handleCheckboxChange = (id) => {
    setSelectedCases((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCases.length === testCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(testCases.map((testCase) => testCase.id)); // Select all
    }
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
          testRunId: testRun.id,
          testRunName: testRun.testRunName || "Default Test Run Name",
          testCaseId: selectedCases,
        };

        addTestCasestoTestRun(payload)
          .then((response) => {
            if (response.status === 200 || response.status === 201) {
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
  const handleTestRun = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to  Execute Test Run?",
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
        Swal.fire("Executed!", "Test Run Executed Successfully.", "success");
      }
    });
  };

  return (
    <div className="container">
      <h4 style={{ color: "#4f0e83", textAlign: "center" }}>
        {testRun.testRunName}-Test Run{" "}
      </h4>
      <div className="">
        
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
      </div>
      <div
        style={{
          maxHeight: "550px",
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
              <th>Created Date</th>
              <th>Updated Date</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((testCase, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCases.includes(testCase.id)}
                    onChange={() => handleCheckboxChange(testCase.id)}
                  />
                </td>

                <td>{testCase.testCaseName}</td>
                <td>{testCase.automationId}</td>
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

export default UserTestRunDetails;
