import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import ServiceFormRegister from "./components/ServiceFormRegister";
import ServicePackCheckout from "./components/ServicePackCheckout";

function App() {
  const [tab, setTab] = useState(0);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  const [formDataContact, setFormDataContact] = useState({
    firstName: "Nguyễn Lê",
    lastName: "Hữu",
    dob: "2000-11-02",
    phone: "+84354187011",
    cccd: "123456789101",
    address: "P. Phú Hữu, Quận 9, TP. Thủ Đức",
    email: "nguyenlehuu1102@gmail.com",
    gender: "Nam",
    area: "Việt Nam",
  });

  useEffect(() => {
    console.log("Các dịch vụ: ", selectedServices);
  }, [selectedServices]);

    useEffect(() => {
      console.log("Form contact ở Cha: ", formDataContact);
    }, [formDataContact]);

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
          interval_count: 5,
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
        "https://christian-jeana-khd-c86f9de4.koyeb.app/payment/stripe/create-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            line_items: lineItems,
            customer_id: customerId,
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
        sku: item.SKU,
        quantity: item.quantity || 1,
        task:
          item.SKU === "P001"
            ? createProductBySKU(item)
            : fetchProductBySKU(item.SKU),
      }));

      const allResults = await Promise.all(taskPromises.map((t) => t.task));
      console.log("Kết quả theo đúng thứ tự:", allResults);

      const lineItems = allResults.map((result, index) => ({
        price:
          typeof result.data === "string" ? result.data : result.data[0].id,
        quantity: taskPromises[index].quantity,
      }));
      console.log("Line items: ", lineItems);

      const paymentSession = await createPaymentSession(lineItems, customerId);

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
        style={{ maxWidth: "900px" }}
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
      </div>
    </>
  );
}

export default App;
