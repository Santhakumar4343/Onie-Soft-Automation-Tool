
import { Button, Select, MenuItem, FormControl, InputLabel, Pagination } from '@mui/material';
import { Box } from '@mui/system';

const TablePagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  handlePreviousPage,
  handleNextPage,
  handlePageSizeChange,
  pageSize,
}) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        right: 0,
        width: '100%',
        padding: 2,
        backgroundColor: 'white',
        zIndex: 100,
        boxShadow: 3,
      }}
    >
      <div className="pagination-footer d-flex justify-content-around align-items-center">
        <Button
          variant="outlined"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          Previous
        </Button>

        <Pagination
          count={totalPages}
          page={currentPage + 1}
          onChange={(_, page) => handlePageChange(page - 1)} 
          siblingCount={1}
          boundaryCount={1}
          shape="rounded"
          variant="outlined"
        />

        <Button
          variant="outlined"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </Button>

        <Box sx={{ ml: 0 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="itemsPerPage-label">Items per page</InputLabel>
            <Select
              labelId="itemsPerPage-label"
              value={pageSize}
              onChange={handlePageSizeChange}
              label="Items per page"
              variant="outlined"
            >
              {[10, 20, 30, 40].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
    </Box>
  );
};

export default TablePagination;
