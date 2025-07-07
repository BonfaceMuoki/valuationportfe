import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const PaginationComponent = ({
  itemPerPage = 1,
  totalItems = 1,
  currentPage = 1,
  paginate = () => {},
}) => {
  const totalPages = Math.ceil(totalItems / itemPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mb-0">
      <PaginationItem disabled={currentPage === 1}>
        <PaginationLink onClick={(e) => { e.preventDefault(); paginate(currentPage - 1); }} href="#">
          Prev
        </PaginationLink>
      </PaginationItem>

      {pageNumbers.map((num) => (
        <PaginationItem key={num} active={num === currentPage}>
          <PaginationLink onClick={(e) => { e.preventDefault(); paginate(num); }} href="#">
            {num}
          </PaginationLink>
        </PaginationItem>
      ))}

      <PaginationItem disabled={currentPage === totalPages}>
        <PaginationLink onClick={(e) => { e.preventDefault(); paginate(currentPage + 1); }} href="#">
          Next
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  );
};

export default PaginationComponent;
