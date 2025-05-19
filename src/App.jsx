import { useEffect, useState, useRef } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import ServiceFormRegister from "./components/ServiceFormRegister";
import ServicePackCheckout from "./components/ServicePackCheckout";
import ConsultationForm from "./components/ConsultationForm";
import CollaboratorForm from "./components/CollaboratorForm";

import Home from "./components/Home";

import createAxios from "./service/axios";
const API = createAxios();

function ServiceFormRegisterFlow() {
  const [tab, setTab] = useState(0);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  const [formDataContact, setFormDataContact] = useState({
    firstName: "Nguyễn Lê",
    lastName: "Hữu",
    dob: "2000-11-02",
    phone: "+84354187011",
    cccd: "123456789101",
    address: "P. Phú Hữu, Quận 9, TP. Thủ Đức",
    email: "nguyenlehuu1102000@gmail.com",
    gender: "",
    area: "20bdc808-bddd-404d-ab75-fe8b60aa0413",
  });

  //   const [formDataContact, setFormDataContact] = useState({
  //   firstName: "",
  //   lastName: "",
  //   dob: "",
  //   phone: "",
  //   cccd: "",
  //   address: "",
  //   email: "",
  //   gender: "",
  //   area: "Việt Nam",
  // });

  useEffect(() => {
    console.log("Các dịch vụ: ", selectedServices);
  }, [selectedServices]);

  useEffect(() => {
    console.log("Form contact: ", JSON.stringify(formDataContact, null, 2));
  }, [formDataContact]);

  useEffect(() => {
    fetchServiceData();
  }, []);

  const getAffiliateCode = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("fpr") || "";
  };

  const fetchServiceData = async () => {
    try {
      const url = `https://christian-jeana-khd-c86f9de4.koyeb.app/unverified_investments`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Lỗi khi lấy sản phẩm}`);
      }

      const data = await response.json();
      console.log("Fetch Service Data: ", data.data);
      // Gán vào state
      setServiceData(data.data);
    } catch (error) {
      console.error("Lỗi khi fetch product:", error.message);
      alert("Không thể lấy thông tin sản phẩm. Vui lòng thử lại.");
    }
  };

  const createNewOrderByInvestmentIdAxios = async (
    customerId,
    selectedServices
  ) => {
    console.log(
      "Customer Id in createNewOrderByInvestmentId: ",
      customerId,
      typeof customerId
    );
    const payload = {
      userId: customerId,
      investment_list: selectedServices.map((item) => ({
        investmentId: item.id,
        quantity: item.quantity,
        ...(item.investment_type === "investment_package" && {
          amount: item.total_invest,
        }),
      })),
    };
    console.log("Final payload:", JSON.stringify(payload, null, 2));
    try {
      const response = await API.post(`/orders/public`, payload);
      if (response) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createNewOrderByInvestmentId = async (customerId, selectedServices) => {
    console.log(
      "Customer Id in createNewOrderByInvestmentId: ",
      customerId,
      typeof customerId
    );
    const payload = {
      userId: customerId,
      investment_list: selectedServices.map((item) => ({
        investmentId: item.id,
        quantity: item.quantity,
        ...(item.investment_type === "investment_package" && {
          amount: item.total_invest,
        }),
      })),
    };
    console.log("Final payload:", JSON.stringify(payload, null, 2));

    const url = "https://christian-jeana-khd-c86f9de4.koyeb.app/orders/public";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi tạo sản phẩm với customer ${customerId}`);
    }
    return response.json();
  };

  const createCustomerByPassAxios = async (formDataContact) => {
    const payload = {
      email: formDataContact.email,
      name: formDataContact.firstName + " " + formDataContact.lastName,
      birthday: formDataContact.dob,
      phone: formDataContact.phone,
      address: formDataContact.address,
      gender: formDataContact.gender,
      identityCode: formDataContact.cccd,
      referalCode: getAffiliateCode(),
      areaId: formDataContact.area,
    };
    console.log("Payload customer:", JSON.stringify(payload, null, 2));
    try {
      const response = await API.post(`/auth/register-by-pass`, payload);
      if (response) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createCustomerByPass = async (formDataContact) => {
    const res = await fetch(
      "https://christian-jeana-khd-c86f9de4.koyeb.app/auth/register-by-pass",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formDataContact.email,
          name: formDataContact.firstName + " " + formDataContact.lastName,
          birthday: formDataContact.dob,
          phone: formDataContact.phone,
          address: formDataContact.address,
          gender: formDataContact.gender,
          identityCode: formDataContact.cccd,
          referalCode: getAffiliateCode(),
          areaId: formDataContact.area,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Tạo khách hàng thất bại");
    return data;
  };

  const handleCompleteCheckout = async () => {
    setLoadingFetch(true);
    try {
      const customerResponse = await createCustomerByPassAxios(formDataContact);
      console.log("Customer Response:", customerResponse);

      if (
        !customerResponse ||
        !customerResponse.data ||
        !customerResponse.data.id
      ) {
        throw new Error("Không lấy được ID khách hàng.");
      }

      const customerId = customerResponse.data.id;
      console.log("Customer Id:", customerId, typeof customerId);

console.log("⏳ Đợi 30 giây...", new Date().toISOString());
      await new Promise((r) => setTimeout(r, 30000));
console.log("✅ Đã xong delay", new Date().toISOString());

      const orderResponse = await createNewOrderByInvestmentIdAxios(
        customerId,
        selectedServices
      );

      if (orderResponse) {
        console.log("OrderResponse: ", orderResponse);
        alert("Vậy là thành công rồi đó!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi xử lý sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoadingFetch(false);
    }
  };

  //     const handleCompleteCheckout = async () => {
  //     setLoadingFetch(true);
  //     try {
  //       let customerId
  //       const customerResponse = await createCustomerByPass(formDataContact);
  //       if (customerResponse) {
  //           customerId = customerResponse.data.id
  //       }

  //       ////////////////////////////////////////////////
  //       const orderResponse = await createNewOrderByInvestmentId(
  //         customerId,
  //         selectedServices
  //       );

  //       if (orderResponse) {
  //         console.log("OrderResponse: ", orderResponse);
  //         alert("Vậy là thành công rồi đó!");
  //       }
  //     } catch (error) {
  //       console.error("Lỗi:", error);
  //       alert("Có lỗi xảy ra khi xử lý sản phẩm. Vui lòng thử lại.");
  //     } finally {
  //       setLoadingFetch(false);
  //     }
  //   };

  //   const handleCompleteCheckout = async () => {
  //   setLoadingFetch(true);
  //   try {
  //     // 1. Gửi yêu cầu tạo customer
  //     const registerResponse = await fetch(
  //       "https://christian-jeana-khd-c86f9de4.koyeb.app/auth/register-by-pass",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           email: formDataContact.email,
  //           name: `${formDataContact.firstName} ${formDataContact.lastName}`,
  //           birthday: formDataContact.dob,
  //           phone: formDataContact.phone,
  //           address: formDataContact.address,
  //           gender: formDataContact.gender,
  //           identityCode: formDataContact.cccd,
  //           referalCode: getAffiliateCode(),
  //           areaId: formDataContact.area,
  //         }),
  //       }
  //     );

  //     const registerData = await registerResponse.json();
  //     if (!registerResponse.ok || !registerData.data?.id) {
  //       throw new Error(registerData.message || "Tạo khách hàng thất bại.");
  //     }

  //     const customerId = registerData.data.id;
  //     console.log("✅ Customer Register data: ", registerData);
  //     console.log("✅ Customer created, ID:", customerId);

  //     // 2. Chuẩn bị dữ liệu tạo order
  //     const payload = {
  //       userId: customerId,
  //       investment_list: selectedServices.map((item) => ({
  //         investmentId: item.id,
  //         quantity: item.quantity,
  //         ...(item.investment_type === "investment_package" && {
  //           amount: item.total_invest,
  //         }),
  //       })),
  //     };

  //     console.log("📦 Payload gửi order:", JSON.stringify(payload, null, 2));

  //     // 3. Gửi yêu cầu tạo order
  //     const orderResponse = await fetch(
  //       "https://christian-jeana-khd-c86f9de4.koyeb.app/orders/public",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const orderData = await orderResponse.json();
  //     if (!orderResponse.ok) {
  //       throw new Error(orderData.message || "Tạo đơn hàng thất bại.");
  //     }

  //     console.log("✅ Order created:", orderData);
  //     alert("Vậy là thành công rồi đó!");

  //   } catch (error) {
  //     console.error("❌ Lỗi khi hoàn tất thanh toán:", error);
  //     alert(error.message || "Có lỗi xảy ra. Vui lòng thử lại.");
  //   } finally {
  //     setLoadingFetch(false);
  //   }
  // };
  return (
    <>
      <div className="container mt-3 mb-5 container-main">
        {tab === 0 && (
          <>
            <ServiceFormRegister
              setTab={setTab}
              serviceData1={serviceData}
              setFormDataContact={setFormDataContact}
              formDataContact={formDataContact}
              onChange={(services) => {
                const withQuantity = services.map((item) => ({
                  ...item,
                  quantity: 1,
                }));
                setSelectedServices(withQuantity);
              }}
            />
          </>
        )}
        {tab === 1 && (
          <>
            <ServicePackCheckout
              selected={selectedServices}
              onUpdateSelected={setSelectedServices}
            />
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => setTab(tab - 1)}
              >
                Trở về
              </button>
              <button
                type="button"
                class="btn btn-primary btn-lg"
                style={{ backgroundColor: "#074379" }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => console.log("Checkout")}
              >
                Hoàn tất
              </button>
            </div>
            <div
              class="modal fade"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
            >
              <div class="modal-dialog modal-dialog-centered">
                {loadingFetch ? (
                  <div
                    class="modal-content d-flex justify-content-center align-items-center"
                    style={{ height: "200px" }}
                  >
                    <div
                      class="spinner-grow"
                      role="status"
                      style={{
                        width: "4rem",
                        height: "4rem",
                        color: "#074379",
                      }}
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <span className="mt-3 fs-4">
                      Đang xử lí, vui lòng chờ...
                    </span>
                  </div>
                ) : (
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">
                        Thông báo
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      Hãy kiểm tra kĩ các gói dịch vụ, số lượng và đơn giá, bấm
                      hoàn tất!
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Đóng
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary"
                        onClick={handleCompleteCheckout}
                        // onClick={() => setLoadingFetch(true)}
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {tab === 2 && (
          <>
            <ConsultationForm />
          </>
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dang-ky-dich-vu" element={<ServiceFormRegisterFlow />} />
        <Route path="/dang-ky-tu-van" element={<ConsultationForm />} />
        <Route path="/dang-ky-cong-tac-vien" element={<CollaboratorForm />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
