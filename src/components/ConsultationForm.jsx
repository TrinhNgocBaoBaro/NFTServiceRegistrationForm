import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { serviceData } from "../data/dataService";
import NFTBanner from "../assets/images/NFTBanner.png";
import NFTBanner2 from "../assets/images/NFTBanner2.jpg";
import SuccessLogo from "../assets/images/SuccessLogo.png";
import NFTLogo2 from "../assets/images/NFTLogo2.png";
import LoadingModal from "./LoadingModal";

const ConsultationForm = () => {
  const [tab, setTab] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [error, setError] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const [formDataContact, setFormDataContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    area: "Việt Nam",
  });

  useEffect(() => {
    console.log("Các dịch vụ được chọn ở form tư vấn: ", selectedServices);
  }, [selectedServices]);

  const handleChangeFormDataContact = (e) => {
    const { name, value } = e.target;
    setFormDataContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    useEffect(() => {
    console.log("Các dịch vụ được chọn ở form tư vấn khi biến đổi: ", [...selectedServices].map((item,index)=>(item["Tên gói"])));
  }, [selectedServices]);


  const validateForm = () => {
    const requiredFields = ["firstName", "lastName", "phone", "email", "area"];
    const errors = [];
    requiredFields.forEach((field) => {
      if (!formDataContact[field]) {
        errors.push(`${field} is required`);
      }
    });

    if (errors.length > 0) {
      setError(true);
      return false;
    }

    setError(false);
    return true;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (validateForm() && selectedServices.length > 0) {
      setLoadingFetch(true);
      console.log("Form is valid:", formDataContact);
      await createContactCRM(formDataContact);
      setTimeout(() => {
        setTab(1);
      }, 3600);
    } else {
      setError(true);
    }
  };

  const handleServiceToggle = (serviceSKU) => {
    const service = serviceData.find((item) => item.SKU === serviceSKU);
    const exists = selectedServices.some((s) => s.SKU === serviceSKU);

    if (exists) {
      setSelectedServices((prev) => prev.filter((s) => s.SKU !== serviceSKU));
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  const getAffiliateCode = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("fpr") || "";
  };

  const createContactCRM = async (formDataContact) => {
    setLoadingFetch(true);
    const service_concern = [...selectedServices].map((item,index)=>(item["Tên gói"]))
    try {
      const response = await fetch(
        "https://christian-jeana-khd-c86f9de4.koyeb.app/crm/create-contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            area: formDataContact.area,
            full_name: formDataContact.firstName + formDataContact.lastName,
            email: formDataContact.email,
            phone: formDataContact.phone,
            citizen_identification: "123456789101",
            birthday: "1900-01-01",
            address:
              "800 Wilcrest Dr, Suite 104, Houston, TX, United States, Texas",
            gender: "Nam",
            is_contributor: 'no',
            service_concern: service_concern,
            affiliate_code: getAffiliateCode(),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Tạo contact khách hàng thất bại");
      }
      return data;
    } catch (error) {
      console.error("Lỗi tạo contact CRM:", error.message);
      throw error;
    }
  };

  return (
    <>
      {tab === 0 && (
        <>
          <div className="form-consultation-container container-main">
            <img
              src={NFTBanner}
              className="img-fluid mb-4 rounded"
              alt="NFT Capital Group Banner"
              style={{ width: "100%" }}
            />
            <h2 className="mb-4 title-session fs-2">NHẬN TƯ VẤN MIỄN PHÍ</h2>
            <div
              className="p-4 rounded mb-4"
              style={{ backgroundColor: "#EAF0F6" }}
            >
              <h5
                style={{
                  color: "#33475B",
                  margin: "0px 0px 10px 0px",
                  paddingLeft: "1ex",
                  borderLeft: "1px solid #cccccc",
                }}
              >
                <strong>
                  Để lại thông tin hoặc liên hệ trực tiếp để được tư vấn
                </strong>
              </h5>
              <p
                style={{ color: "#202124", fontSize: "16px", margin: "8px 0" }}
              >
                Thông tin liên hệ:
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:+13468010206">+1 346 801 0206</a>
              </p>
              <p>
                <strong>Fanpage:</strong>{" "}
                <a href="https://facebook.com/nftcapitalgroupcorp">
                  facebook.com/nftcapitalgroupcorp
                </a>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=it.nftcapitalgroupcorp@gmail.com&amp;"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  it.nftcapitalgroupcorp@gmail.com
                </a>
              </p>
            </div>
            <div className="mb-4">
              <h4>Thông tin cá nhân</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Họ <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className={`form-control ${
                      !formDataContact.firstName && error ? "is-invalid" : ""
                    }`}
                    value={formDataContact.firstName}
                    onChange={handleChangeFormDataContact}
                  />
                  <div class="invalid-feedback">Vui lòng nhập đầy đủ.</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Tên <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className={`form-control ${
                      !formDataContact.lastName && error ? "is-invalid" : ""
                    }`}
                    value={formDataContact.lastName}
                    onChange={handleChangeFormDataContact}
                  />
                  <div class="invalid-feedback">Vui lòng nhập đầy đủ.</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      !formDataContact.email && error ? "is-invalid" : ""
                    }`}
                    value={formDataContact.email}
                    onChange={handleChangeFormDataContact}
                  />
                  <div class="invalid-feedback">Vui lòng nhập đầy đủ.</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Số điện thoại <span className="text-danger">*</span>
                  </label>
                  {/* <input type="tel" className="form-control" /> */}
                  <div
                    className={`form-control ${
                      !formDataContact.phone && error ? "is-invalid" : ""
                    }`}
                  >
                    <PhoneInput
                      international
                      defaultCountry="VN"
                      value={formDataContact.phone}
                      onChange={(phone) =>
                        setFormDataContact({
                          ...formDataContact,
                          phone: phone,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label">
                    Khu vực <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formDataContact.area}
                    onChange={(e) =>
                      setFormDataContact({
                        ...formDataContact,
                        area: e.target.value,
                      })
                    }
                  >
                    <option value="Việt Nam">Việt Nam</option>
                    <option value="Texas">Texas</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <h4 className="mb-3">Dịch vụ tư vấn</h4>
              {serviceData.map((service, index) => (
                <div className="col-md-6" key={index}>
                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`service-${service.SKU}`}
                      checked={selectedServices.some(
                        (s) => s.SKU === service.SKU
                      )}
                      onChange={() => handleServiceToggle(service.SKU)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`service-${service.SKU}`}
                    >
                      {service["Tên gói"]}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {error && (
              <div className="d-flex justify-content-center">
                <div className="mt-3 text-danger fs-5 fw-medium">
                  Vui lòng chọn dịch vụ và nhập đầy đủ thông tin còn thiếu.
                </div>
              </div>
            )}{" "}
            <div className="d-flex justify-content-end mt-5">
              <button
                className="btn btn-primary btn-lg"
                // onClick={handleSubmitForm}
                onClick={handleSubmitForm}
                style={{ backgroundColor: "#074379" }}
              >
                Đăng ký
              </button>
            </div>
          </div>
          <LoadingModal loading={loadingFetch} />
        </>
      )}
      {tab === 1 && (
        <div className="text-center">
          <img
            src={NFTLogo2}
            className="mb-4 img-fluid"
            alt="Success Icon"
            style={{
              width: "240px",
              height: "240px",
              objectFit: "contain",
            }}
          />

          <div>
            <h2 className="display-7 display-md-5" style={{ color: "#33475B" }}>
              Thông tin của bạn đã được ghi nhận.
            </h2>
            <h2 className="fs-4 fs-md-3 mt-2" style={{ color: "#33475B" }}>
              Cảm ơn bạn đã quan tâm – chúng tôi sẽ sớm liên hệ!
            </h2>
          </div>
          <img
            src={NFTBanner2}
            className="img-fluid mb-4 rounded mt-5"
            alt="NFT Capital Group Banner"
            style={{ width: "100%" }}
          />
        </div>
      )}
    </>
  );
};

export default ConsultationForm;
