import React from "react";
import './PagenationComponent.css'
const PaginationComponent = ({ currentPage, totalPages, handlePageChange, handlePreviousPage, handleNextPage }) => {
  return (
    <div className="d-flex justify-content-between mt-4" style={{ width: "50%", marginLeft: "20%" }}>
      <button
        className="btn btn-outline-secondary"
        onClick={handlePreviousPage}
        disabled={currentPage === 0}
      >
        Previous
      </button>
      {/* Page Number Buttons */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`btn ${currentPage === index ? "btn-primary" : "btn-secondary"} mx-1`}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button
        className="btn btn-outline-secondary"
        onClick={handleNextPage}
        disabled={currentPage >= totalPages - 1}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;
