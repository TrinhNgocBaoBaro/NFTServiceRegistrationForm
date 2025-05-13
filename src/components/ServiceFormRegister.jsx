import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { serviceData } from "../data/dataService";
import NFTBanner from "../assets/images/NFTBanner.png";
import NFTLogo from "../assets/images/NFTLogo.jpg";

const ServiceFormRegister = ({
  onChange,
  setTab,
  formDataContact,
  setFormDataContact,
}) => {
  const [selectedCombo, setSelectedCombo] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [error, setError] = useState(false);

  ///////////////////////////////////////
  const [contributeAmount, setContributeAmount] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const isP001Selected = selectedCombo.some((combo) => combo.SKU === "P001");
  const isInvalid = isTouched && (!contributeAmount || contributeAmount < 500);

  /////////////////////////////////////

  const handleChangeFormDataContact = (e) => {
    const { name, value } = e.target;
    setFormDataContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "dob",
      "phone",
      "cccd",
      "email",
      "gender",
      "area",
    ];
    const errors = [];
    requiredFields.forEach((field) => {
      if (!formDataContact[field]) {
        errors.push(`${field} is required`);
      }
    });

    if (isP001Selected) {
      if (errors.length > 0 || (!contributeAmount || contributeAmount < 500)) {
        setError(true);
        setIsTouched(true)
        return false;
      }
    } else if(!isP001Selected) {
      if (errors.length > 0) {
        // alert("Vui lòng điền đầy đủ thông tin: \n" + errors.join("\n"));
        setError(true);
        return false;
      }
    }

    // if (!(selectedCombo.length > 0 || selectedServices.length > 0)) {
    //   setIsTouched(true);
    //   if (errors.length > 0 && isInvalid) {
    //     setError(true);
    //     return false;
    //   }
    // }

    setError(false);
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (
      validateForm() &&
      (selectedCombo.length > 0 || selectedServices.length > 0)
    ) {
      setTab(1);
      console.log("Form is valid:", formDataContact);
    } else {
      setError(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form is valid:", formDataContact);
    }
  };

  // useEffect(() => {
  //   console.log("Form contact ở Con: ", formDataContact);
  // }, [formDataContact]);

  useEffect(() => {
    const selected = [...selectedCombo, ...selectedServices];
    onChange?.(selected);
  }, [selectedCombo, selectedServices]);

  const handleComboChange = (comboSKU) => {
    const combo = serviceData.find(
      (item) => item["Loại "] === "package_service" && item.SKU === comboSKU
    );

    if (!combo) return;

    const exists = selectedCombo.some((s) => s.SKU === comboSKU);

    if (exists) {
      setSelectedCombo((prev) => prev.filter((s) => s.SKU !== comboSKU));
    } else {
      setSelectedCombo((prev) => [...prev, combo]);
    }
  };

  const handleServiceToggle = (serviceSKU) => {
    const service = serviceData.find(
      (item) => item["Loại "] === "retail_service" && item.SKU === serviceSKU
    );
    const exists = selectedServices.some((s) => s.SKU === serviceSKU);

    if (exists) {
      setSelectedServices((prev) => prev.filter((s) => s.SKU !== serviceSKU));
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  return (
    <div className="">
      <img
        src={NFTBanner}
        className="img-fluid mb-4 rounded"
        alt="NFT Capital Group Banner"
        style={{ width: "100%" }}
      />

      <h2 className="mb-4 title-session fs-2">ĐĂNG KÝ DỊCH VỤ</h2>

      <div className="p-4 rounded mb-4" style={{ backgroundColor: "#EAF0F6" }}>
        <h5
          style={{
            color: "#33475B",
            margin: "0px 0px 10px 0px",
            paddingLeft: "1ex",
            borderLeft: "1px solid #cccccc",
          }}
        >
          <strong>TẬP ĐOÀN NFT CAPITAL GROUP</strong>
        </h5>
        <p style={{ fontFamily: "Inter" }} className="fs-5">
          Vốn của bạn - Tương lai của bạn - Thành công của bạn.
        </p>

        <p style={{ color: "#202124", fontSize: "16px", margin: "8px 0" }}>
          Thông tin liên hệ:
        </p>
        <p>
          <strong>Phone:</strong> <a href="tel:+13468010206">+1 346 801 0206</a>
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
        <table>
          <tbody>
            <tr
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <td style={{ flex: "0 0 160px", padding: "10px" }}>
                <img
                  src={NFTLogo}
                  alt="Logo"
                  style={{
                    width: "100%",
                    maxWidth: "160px",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              </td>
              <td style={{ flex: 1, minWidth: "250px", padding: "10px" }}>
                <blockquote
                  style={{
                    margin: "0px 0px 0px 0.8ex",
                    paddingLeft: "1ex",
                    borderLeft: "1px solid #cccccc",
                  }}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      margin: "0 0 8px",
                      color: "#33475B",
                    }}
                  >
                    Chúng tôi cần thu thập một số thông tin cơ bản của bạn nhằm
                    tuân thủ quy định pháp lý tại bang Texas (Hoa Kỳ), bao gồm
                    các điều khoản liên quan đến{" "}
                    <strong>chống rửa tiền (AML)</strong>,{" "}
                    <strong>hiểu khách hàng (KYC)</strong>, và{" "}
                    <strong>bảo vệ quyền lợi nhà đầu tư</strong>. Việc cung cấp
                    thông tin giúp đảm bảo tính minh bạch, an toàn và hợp pháp
                    cho tất cả các bên tham gia, đặc biệt trong lĩnh vực liên
                    quan đến tài sản số và NFT.
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      margin: 0,
                      color: "#33475B",
                    }}
                  >
                    Mọi dữ liệu của bạn sẽ được bảo mật tuyệt đối và chỉ phục vụ
                    mục đích xác minh hợp lệ.
                  </p>
                </blockquote>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <form onSubmit={handleNextStep}>
        <div className="mb-4">
          <h4>Thông tin cá nhân</h4>
          {/* <button type="submit" className="btn btn-primary">
            Đăng ký
          </button> */}
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
                Ngày sinh <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                name="dob"
                className={`form-control ${
                  !formDataContact.dob && error ? "is-invalid" : ""
                }`}
                value={formDataContact.dob}
                onChange={handleChangeFormDataContact}
              />
              <div class="invalid-feedback">Vui lòng chọn.</div>
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
            <div className="col-md-6">
              <label className="form-label">
                CCCD <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="cccd"
                className={`form-control ${
                  !formDataContact.cccd && error ? "is-invalid" : ""
                }`}
                value={formDataContact.cccd}
                onChange={handleChangeFormDataContact}
              />
              <div class="invalid-feedback">Vui lòng nhập đầy đủ.</div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Địa chỉ</label>
              <input
                type="text"
                name="address"
                className={`form-control ${
                  !formDataContact.address && error ? "is-invalid" : ""
                }`}
                value={formDataContact.address}
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
                Giới tính <span className="text-danger">*</span>
              </label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    // className="form-check-input"
                    className={`form-check-input ${
                      !formDataContact.gender && error ? "is-invalid" : ""
                    }`}
                    name="gender"
                    id="nam"
                    value="Nam"
                    checked={formDataContact.gender === "Nam"}
                    onChange={(e) =>
                      setFormDataContact({
                        ...formDataContact,
                        gender: e.target.value,
                      })
                    }
                  />
                  <label className="form-check-label" htmlFor="nam">
                    Nam
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className={`form-check-input ${
                      !formDataContact.gender && error ? "is-invalid" : ""
                    }`}
                    name="gender"
                    id="nu"
                    value="Nữ"
                    checked={formDataContact.gender === "Nữ"}
                    onChange={(e) =>
                      setFormDataContact({
                        ...formDataContact,
                        gender: e.target.value,
                      })
                    }
                  />
                  <label className="form-check-label" htmlFor="nu">
                    Nữ
                  </label>
                </div>
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
      </form>
      <div className="">
        <h4>Dịch vụ</h4>
        <div
          style={{
            margin: "0px 0px 0px 0.8ex",
            paddingLeft: "1ex",
            borderLeft: "1px solid #cccccc",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              color: "#33475B",
              margin: "20px 0px 20px 0px",
            }}
          >
            Vui lòng chọn ít nhất <strong>1 gói combo</strong> hoặc{" "}
            <strong>1 dịch vụ riêng lẻ</strong>. <br />
            Liên hệ với bộ phận CSKH ngay để được tư vấn miễn phí nếu bạn có bất
            kỳ thắc mắc nào.
          </p>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Gói dịch vụ:</label>
          {serviceData
            .filter((item) => item["Loại "] === "package_service")
            .map((combo, index) => (
              // <div className="form-check mt-2" key={combo.SKU}>
              //   <input
              //     type="radio"
              //     className="form-check-input"
              //     name="combo"
              //     id={`combo-${combo.SKU}`}
              //     checked={selectedCombo?.SKU === combo.SKU}
              //     onChange={() => handleComboChange(combo.SKU)}
              //   />
              //   <label
              //     className="form-check-label"
              //     htmlFor={`combo-${combo.SKU}`}
              //   >
              //     {combo["Tên gói"]}
              //   </label>
              // </div>
              <div className="form-check mt-2" key={index}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`combo-${combo.SKU}`}
                  checked={selectedCombo.some((s) => s.SKU === combo.SKU)}
                  onChange={() => handleComboChange(combo.SKU)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`combo-${combo.SKU}`}
                >
                  {combo["Tên gói"]}
                </label>
              </div>
            ))}
          {isP001Selected && (
            <div className="mt-3">
              <label className="form-label fw-bold">
                Số tiền góp (USD): <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control ${isInvalid ? "is-invalid" : ""}`}
                min={500}
                step={100}
                placeholder="Nhập số tiền bạn muốn góp"
                value={contributeAmount}
                onChange={(e) => {
                  const newPrice = parseFloat(e.target.value);
                  setContributeAmount(e.target.value);
                  setSelectedCombo((prev) =>
                    prev.map((combo) =>
                      combo.SKU === "P001" ? { ...combo, Giá: newPrice } : combo
                    )
                  );
                }}
                onBlur={() => setIsTouched(true)}
              />
              {isInvalid && (
                <div className="invalid-feedback">
                  Vui lòng nhập số tiền (≥ 500$).
                </div>
              )}
            </div>
          )}
          {/* {(!selectedCombo || selectedServices.length === 0) && 
            <div className="mt-3 text-danger fs-6 fw-medium">
              Vui lòng chọn gói dịch vụ.
            </div>
          } */}
          <div className="mt-3">
            {" "}
            Chi tiết các gói / dịch vụ:{" "}
            <a href="ServicePack.pdf" target="_blank" rel="noreferrer">
              ServicePack.pdf
            </a>
          </div>
        </div>
        <label className="form-label fw-bold">Dịch vụ riêng lẻ:</label>
        <div className="row">
          {serviceData
            .filter((item) => item["Loại "] === "retail_service")
            .map((service, index) => (
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
              Vui lòng nhập đầy đủ thông tin còn thiếu.
            </div>
          </div>
        )}{" "}
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary btn-lg" onClick={handleNextStep}  style={{ backgroundColor: "#074379" }}>
            Tiếp theo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceFormRegister;
