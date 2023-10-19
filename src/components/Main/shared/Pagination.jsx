import toast from "react-hot-toast";

export function Pagination({ currentPage, totalPages, onPageChange }) {
  console.log("totalPages", totalPages);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  console.log("pages", pages);
  console.log("currentPage", currentPage);
  if (totalPages === 1) return null;
  return (
    <div className="join">
      {/* <button
        onClick={() => {
          console.log("compare", currentPage, typeof currentPage);
          if (currentPage === 1 || currentPage === 0) {
            toast.error("You are on the first page");
          } else {
            return onPageChange(currentPage - 1);
          }
        }}
        className={`join-item btn ${currentPage === 1 ? "btn-disabled" : ""}`}
        disabled={currentPage === 1}
      >
        Prev
      </button> */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${
            page === currentPage
              ? "bg-primary text-white"
              : "bg-base text-black"
          } join-item btn`}
        >
          {page}
        </button>
      ))}
      {/* <button
        onClick={() => {
          if (currentPage === totalPages - 1) {
            return;
          } else {
            return onPageChange(currentPage + 1);
          }
        }}
        className={`join-item btn ${
          currentPage === totalPages ? "btn-disabled" : ""
        }`}
        disabled={currentPage === totalPages}
      >
        Next
      </button> */}
    </div>
  );
}
