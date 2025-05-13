import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const ServicePackCheckout = ({ selected = [], onUpdateSelected }) => {
  const [quantities, setQuantities] = useState(() =>
    selected.reduce((acc, item) => {
      acc[item.SKU] = 1;
      return acc;
    }, {})
  );

  const handleQuantityChange = (sku, value) => {
    const val = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({
      ...prev,
      [sku]: val,
    }));
    const updated = selected.map((item) =>
      item.SKU === sku ? { ...item, quantity: val } : item
    );
    onUpdateSelected(updated);
  };

  const getTotal = () => {
    return selected.reduce((sum, item) => {
      const qty = quantities[item.SKU] || 1;
      const price = parseFloat(item["Giá"]) || 0;
      return sum + qty * price;
    }, 0);
  };
  return (
    <div>
      <img
        src="../assets/images/NFTBanner.png"
        className="img-fluid mb-4 rounded"
        alt="NFT Capital Group Banner"
        style={{ width: "100%" }}
      />
      <h2 className="mb-4 title-session">DỊCH VỤ ĐÃ CHỌN</h2>

      {selected.length === 0 ? (
        <p className="text-muted">Chưa có dịch vụ nào được chọn.</p>
      ) : (
        <div className="mb-4">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên gói / Dịch vụ</th>
                {/* <th scope="col">Mô tả</th> */}
                <th scope="col">Giá ($)</th>
                <th scope="col">Kỳ hạn</th>
                <th scope="col">Nhập số lượng</th>
              </tr>
            </thead>
            <tbody>
              {selected.map((item, index) => (
                <tr key={item.SKU}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {item["Tên gói"] || "Không có tên"}
                    <br />
                    <small className="text-muted" style={{}}>
                      {item["Mô tả"] || "Không có mô tả"}
                    </small>
                  </td>
                  {/* <td>{item["Mô tả"] || "Không có mô tả"}</td> */}
                  <td>{item["Giá"] || 0}</td>
                  <td>{item["Recurring"] ? "tháng" : "-"}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={quantities[item.SKU] || 1}
                      min={1}
                      onChange={(e) =>
                        handleQuantityChange(item.SKU, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Tổng tiền:</h3>
            <h4>
              {getTotal().toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              USD
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePackCheckout;
