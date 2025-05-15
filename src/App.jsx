import { useEffect, useState, useRef } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import ServiceFormRegister from "./components/ServiceFormRegister";
import ServicePackCheckout from "./components/ServicePackCheckout";
import ConsultationForm from "./components/ConsultationForm";
import Home from "./components/Home";

function ServiceFormRegisterFlow() {
  const [tab, setTab] = useState(0);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  // const [formDataContact, setFormDataContact] = useState({
  //   firstName: "Nguyễn Lê",
  //   lastName: "Hữu",
  //   dob: "2000-11-02",
  //   phone: "+84354187011",
  //   cccd: "123456789101",
  //   address: "P. Phú Hữu, Quận 9, TP. Thủ Đức",
  //   email: "nguyenlehuu1102@gmail.com",
  //   gender: "Nam",
  //   area: "Việt Nam",
  // });

    const [formDataContact, setFormDataContact] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    cccd: "",
    address: "",
    email: "",
    gender: "",
    area: "Việt Nam",
  });

  useEffect(() => {
    console.log("Các dịch vụ: ", selectedServices);
  }, [selectedServices]);

  useEffect(() => {
    console.log("Form contact ở Cha: ", formDataContact);
  }, [formDataContact]);

    const getAffiliateCode = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("fpr") || "";
  };

  const fetchProductBySKU = async (sku) => {
    const encodedSKU = encodeURIComponent(`metadata['SKU']:'${sku}'`);
    const url = `https://christian-jeana-khd-c86f9de4.koyeb.app/payment/stripe/search-product?query=${encodedSKU}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Lỗi khi lấy sản phẩm với SKU ${sku}`);
    }

    return response.json();
  };

  const createProductBySKU = async (item) => {
    console.log("Item: ", item.Recurring);
    const url = `https://christian-jeana-khd-c86f9de4.koyeb.app/payment/stripe/create-product`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency: "usd",
        amount: item["Giá"] * 100,
        recurring: {
          interval: item.Recurring === "monthly" ? "month" : "",
          interval_count: 3,
        },
        product_data: {
          name: item["Tên gói"],
        },
        metadata: {
          SKU: item.SKU,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi tạo sản phẩm với SKU ${item.SKU}`);
    }

    return response.json();
  };

  const createCustomer = async ({ email, name }) => {
    const res = await fetch(
      "https://christian-jeana-khd-c86f9de4.koyeb.app/payment/stripe/create-customer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Tạo khách hàng thất bại");
    return data;
  };

  const createPaymentSession = async (lineItems, customerId) => {
    try {
      const response = await fetch(
        "https://christian-jeana-khd-c86f9de4.koyeb.app/payment/stripe/create-payment-fb",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            line_items: lineItems,
            customer_id: customerId,
            contact: {
              full_name: formDataContact.firstName + formDataContact.lastName,
              birthday: formDataContact.dob,
              phone: formDataContact.phone,
              citizen_identification: formDataContact.cccd,
              address: formDataContact.address,
              email: formDataContact.email,
              gender: formDataContact.gender,
              area: formDataContact.area,
              affiliate_code: getAffiliateCode(),
              is_contributor: "no"
            },
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Tạo phiên thanh toán thất bại");
      }

      return result;
    } catch (error) {
      console.error("Lỗi tạo payment session:", error);
      throw error;
    }
  };

  const handleCompleteCheckout = async () => {
    setLoadingFetch(true);
    try {
      const customerResponse = await createCustomer({
        email: "abc@example.com",
        name: "Nguyễn Văn A",
      });

      const customerId = customerResponse.data;
      console.log("Customer id: ", customerId);
      const taskPromises = selectedServices.map((item) => ({
        service_name: item["Tên gói"],
        recurring: item.Recurring || "one_time",
        sku: item.SKU,
        service_price: item["Giá"] === "P001" ? item["Giá"] : item["Giá"] * 100,
        quantity: item.quantity || 1,
        task:
          item.SKU === "P001"
            ? createProductBySKU(item)
            : fetchProductBySKU(item.SKU),
      }));

      const allResults = await Promise.all(taskPromises.map((t) => t.task));
      console.log("Kết quả theo đúng thứ tự:", allResults);

      // const lineItems = allResults.map((result, index) => ({
      //   price:
      //     typeof result.data === "string" ? result.data : result.data[0].id,
      //   quantity: taskPromises[index].quantity,
      // }));
      // console.log("Line items: ", lineItems);

      /////////////////////////////////////////////
      const newLineItems = allResults.map((result, index) => ({
        price_stripe_id:
          typeof result.data === "string" ? result.data : result.data[0].id,
        quantity: taskPromises[index].quantity,
        price_hubspot: taskPromises[index].service_price,
        sku: taskPromises[index].sku,
        service_name: taskPromises[index].service_name,
        recurring: taskPromises[index].recurring,
      }));

      console.log("New line items: ", newLineItems);

      ////////////////////////////////////////////////
      const paymentSession = await createPaymentSession(
        newLineItems,
        customerId
      );

      window.location.href = paymentSession.data.url;
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi xử lý sản phẩm. Vui lòng thử lại.");
    } finally {
      // setLoadingFetch(false);
    }
  };

  return (
    <>
      <div
        className="container mt-3 mb-5 container-main"
      >
        {tab === 0 && (
          <>
            <ServiceFormRegister
              setTab={setTab}
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
                Thanh toán
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
                      hoàn tất để đi đến thanh toán!
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
                        Hoàn tất
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
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
