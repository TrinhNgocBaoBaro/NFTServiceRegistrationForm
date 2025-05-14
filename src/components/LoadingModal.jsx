import { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
const LoadingModal = ({ loading }) => {
  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalInstance.current = new Modal(modalRef.current, {
        backdrop: "static",
        keyboard: false,
      });
    }
  }, []);

useEffect(() => {
  if (!modalInstance.current) return;

  if (loading) {
    modalInstance.current.show();
  } else {
    // 👇 Chuyển focus về body hoặc nút nào đó ngoài modal
    document.activeElement?.blur();
    modalInstance.current.hide();
  }
}, [loading]);

  return (
    <div
      className="modal fade"
      id="loadingModal"
      tabIndex="-1"
      ref={modalRef}
      aria-labelledby="loadingModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div
            className="spinner-grow"
            role="status"
            style={{
              width: "4rem",
              height: "4rem",
              color: "#074379",
            }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="mt-3 fs-4">Đang xử lí, vui lòng chờ...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
