import {Modal} from "@mui/material";
import axios from "axios";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {API_URL, getTestRunByProjectId} from "../API/Api";
import Swal from "sweetalert2";
import moment from "moment";
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TablePagination from "../Pagination/TablePagination";

const TestRuns = () => {
    const [searchText, setSearchText] = useState("");
    const [testRunModal, setTestRunModal] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user.empId)
    const location = useLocation();

    const {project} = location.state || {};

    const [testRunData, setTestData] = useState({
        testRunName: "",
        createdBy: user.empId
    });
    const [testRuns, setTestRuns] = useState([]);

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
    useEffect(() => {
        getTestRunByProjectId(project.id, page - 1, itemsPerPage).then(
            response => {
                setTestRuns(response.data.content)
                setTotalPages(response.data.totalPages)
            }
        ).catch(err => console.log(err))
    }, [project.id, page - 1, itemsPerPage])


    const filteredTestRuns = testRuns.filter(
        (testRun) =>
            testRun.testRunName.toLowerCase().includes(searchText.toLowerCase()) ||
            testRun.createdBy.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleTestRunClick = (testRun) => navigate("/dashboard/testRunDetails", {state: {project, testRun}});
    const handleTestRunView = (testRun) => navigate("/dashboard/testRunView", {state: {project, testRun}});
    const handleTestRunSubmit = (e) => {
        e.preventDefault();

        axios.post(`${API_URL}/testrun/v1/createtestrun/${project.id}`, testRunData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            Swal.fire({
                icon: "success",
                title: "Test Run Saved",
                text: "Test Run Created Successfully!"
            })
            console.log(response)
            setTestRunModal(false)
        }).catch(err => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "something went wrong could not create Test Run!!"
            })
            console.log(err)
            setTestRunModal(false)
        })
    };

    const handleTestRunChange = (e) => {
        const {name, value} = e.target;
        setTestData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="container ">
            <h4 className="text-center mb-2" style={{color: "#4f0e83"}}>
                {project.projectName}-Test Runs
            </h4>
            <div className="d-flex justify-content-end mb-3">

                <input
                    type="text"
                    value={searchText}
                    placeholder="Search by Test Run Name,Created By"
                    className="form-control "
                    style={{width: "40%"}}
                    onChange={(e) => setSearchText(e.target.value)}
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
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTestRuns.map((testRun, index) => (
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
                                    <EditIcon
                                        className="me-2"
                                        style={{cursor: "pointer", color: "#4f0e83"}}
                                        onClick={() => handleTestRunClick(testRun)}
                                    />
                                </td>
                                <td>
                                    <RemoveRedEyeIcon
                                        className="me-2"
                                        style={{cursor: "pointer", color: "#4f0e83"}}
                                        onClick={() => handleTestRunView(testRun)}
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


            <Modal open={testRunModal} onClose={() => setTestRunModal(false)}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                >
                    <div
                        className="modal-content p-4"
                        style={{
                            maxWidth: "500px",
                            width: "100%",
                            backgroundColor: "white",
                            borderRadius: "20px",
                        }}
                    >
                        <h4 className="modal-title text-center">Add Test Run</h4>
                        <form onSubmit={handleTestRunSubmit} className="mt-4">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="testRunName"
                                    className="form-control w-80 mb-3"
                                    placeholder="Test Run Name"
                                    onChange={handleTestRunChange}
                                    value={testRuns.testRunName}
                                    required
                                />
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn btn-primary mt-3 "
                                    style={{
                                        borderRadius: "20px",
                                        background: "#4f0e83",
                                        marginRight: "20px",
                                        width: "150px",
                                    }}
                                    onClick={() => {
                                        setTestRunModal(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary mt-3 w-20"
                                    style={{
                                        borderRadius: "20px",
                                        background: "#4f0e83",
                                        width: "150px",
                                    }}
                                >
                                    Add Test Run
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TestRuns;
