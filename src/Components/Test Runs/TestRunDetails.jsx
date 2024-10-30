import  { useState } from "react";
import "./TestRunDetails.css"
import { toast } from "react-toastify";
import Swal from "sweetalert2";
function TestCaseTable() {
  const [testCases, setTestCases] = useState([
    {
      projectId: "4",
      testCaseId: "TC001",
      testCaseName: "Password Reset Test",
      customId: "TC03",
      author: "Alice",
      createdBy: "29/10/24",
      updatedAt: "29/10/24",
    },
    {
      projectId: "4",
      testCaseId: "TC002",
      testCaseName: "Login Functionality Test",
      customId: "TC04",
      author: "Bob",
      createdBy: "28/10/24",
      updatedAt: "28/10/24",
    },
    {
      projectId: "4",
      testCaseId: "TC003",
      testCaseName: "Signup Functionality Test",
      customId: "TC05",
      author: "Charlie",
      createdBy: "27/10/24",
      updatedAt: "27/10/24",
    },
    {
        projectId: "1",
        testCaseId: "1",
        testCaseName: "Login Test",
        customId: "TC01",
        author: "Alice",
        createdBy: "29/10/24",
        updatedAt: "29/10/28",
      },
      {
        projectId: "2",
        testCaseId: "2",
        testCaseName: "Signup Test",
        customId: "TC02",
        author: "Bob",
        createdBy: "29/10/24",
        updatedAt: "29/10/28",
      },
      {
        projectId: "3",
        testCaseId: "3",
        testCaseName: "Password Reset Test",
        customId: "TC03",
        author: "Charlie",
        createdBy: "29/10/24",
        updatedAt: "29/10/28",
      },
      {
        projectId: "1",
        testCaseId: "4",
        testCaseName: "Login Test",
        customId: "TC01",
        author: "Alice",
        createdBy: "29/10/24",
        updatedAt: "29/10/28",
      },
      {
        projectId: "2",
        testCaseId: "5",
        testCaseName: "Signup Test",
        customId: "TC02",
        author: "Bob",
        createdBy: "29/10/24",
        updatedAt: "29/10/28",
      },
      {
        projectId: "3",
        testCaseId: "6",
        testCaseName: "Password Reset Test",
        customId: "TC03",
        author: "Charlie",
        createdBy: "29/10/24",
        updatedAt: "29/10/28",
      },
      {
        projectId: "1",
        testCaseId: "7",
        testCaseName: "Login Test",
        customId: "TC01",
        author: "Alice",
        createdBy: "29/10/24",
        updatedAt: "29/10/28",
      },
      {
        projectId: "2",
        testCaseId: "8",
        testCaseName: "Signup Test",
        customId: "TC02",
        author: "Bob",
        createdBy: "29/10/24",
        updatedAt: "29/10/28",
      },
      {
        projectId: "3",
        testCaseId: "9",
        testCaseName: "Password Reset Test",
        customId: "TC03",
        author: "Charlie",
        createdBy: "29/10/24",
        updatedAt: "29/10/28",
      },
      {
        projectId: "1",
        testCaseId: "10",
        testCaseName: "Login Test",
        customId: "TC01",
        author: "Alice",
        createdBy: "29/10/24",
        updatedAt: "29/10/28",
      },
      {
        projectId: "2",
        testCaseId: "11",
        testCaseName: "Signup Test",
        customId: "TC02",
        author: "Bob",
        createdBy: "29/10/24",
        updatedAt: "29/10/28",
      }
  ]);

  const [selectedCases, setSelectedCases] = useState([]);

  // Handle individual row selection
  const handleCheckboxChange = (testCaseId) => {
    setSelectedCases((prevSelected) =>
      prevSelected.includes(testCaseId)
        ? prevSelected.filter((id) => id !== testCaseId)
        : [...prevSelected, testCaseId]
    );
  };

  // Handle "Select All" functionality
  const handleSelectAll = () => {
    if (selectedCases.length === testCases.length) {
      setSelectedCases([]); // Deselect all
    } else {
      setSelectedCases(testCases.map((testCase) => testCase.testCaseId)); // Select all
    }
  };

 
  const handleAddToTestRun = () => {
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
          cancelButton: "custom-cancel-button"
        }
      }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Added!", "Selected test cases have been added to the Test Run.", "success");
      }
    });
  };
const handleTestRun=()=>{
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to Test Run?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4f0e83",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Run The Test Run!",
        customClass: {
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button"
        }
      }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Added!", "Test Run Run Successfully.", "success");
      }
    });
}
  return (
    <div className="RunDetails-Container">
        <div className="TestRun">
      
        <button onClick={ handleTestRun}  style={{borderRadius:"20px" ,backgroundColor:"#4f0e83",color:"white",width:"10%",maxHeight:"50px"}}>
         Run Test Run 
      </button>
      <button onClick={handleAddToTestRun} disabled={selectedCases.length === 0} style={{borderRadius:"20px" ,backgroundColor:"#4f0e83",color:"white",width:"10%",height:"35px"}}>
        Add to Test Run 
      </button>
      
      
      </div>
      <div  style={{ maxHeight: "450px", overflowY: "auto" }}>
      <table  className="table table-bordered table-hover mt-4" style={{textAlign:"center"}}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedCases.length === testCases.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>Project ID</th>
            <th>Test Case ID</th>
            <th>Test Case Name</th>
            <th>Custom ID</th>
            <th>Author</th>
            <th>Created By</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((testCase, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCases.includes(testCase.testCaseId)}
                  onChange={() => handleCheckboxChange(testCase.testCaseId)}
                />
              </td>
              <td>{testCase.projectId}</td>
              <td>{testCase.testCaseId}</td>
              <td>{testCase.testCaseName}</td>
              <td>{testCase.customId}</td>
              <td>{testCase.author}</td>
              <td>{testCase.createdBy}</td>
              <td>{testCase.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default TestCaseTable;