import React, { useContext, useRef } from "react";
import ReactToPrint from "react-to-print";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import { StateContext } from "@/contexts/StateProvider/StateProvider";

const InvoiceGenerator = () => {
  const { selectedOrders, stores, userInfo } = useContext(StateContext);

  const storeInfo = stores[0];

  const { address, area, district, name, phone, zip } = storeInfo;

  const componentRef = useRef(null);

  console.log("stores", stores);
  function formatStockDate(isoTimestamp) {
    const date = new Date(isoTimestamp);

    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    const formattedDate = `${month} ${day}, ${year} ${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")}${ampm}`;

    return formattedDate;
  }

  return (
    <div className="container mx-auto h-full w-fit">
      <p className="text-center text-3xl font-bold">Invoice</p>
      <div
        className="flex flex-col gap-5 p-5"
        id="print"
        ref={componentRef}
        // ref={(el) => (componentRef.current[index] = el)}
      >
        {selectedOrders?.map((order, index) => (
          <div
            key={order._id}
            className="order-section"
            style={{
              padding: "1rem",
              color: "black",
              fontSize: "18px",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              pageBreakInside: "avoid",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderBottom: "1px solid black",
                padding: "5px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {userInfo?.image && (
                  <img
                    style={{
                      height: "113px",
                      width: "200px",
                      objectFit: "cover",
                    }}
                    src={userInfo?.image}
                    alt=""
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "12px",
                  }}
                >
                  <span>
                    {name}, {address}, {district}, {zip}
                  </span>
                  <span>
                    Phone: {phone}, Email: {userInfo?.email}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  fontSize: "12px",
                }}
              >
                <p>Invoice ID: {order?.orderId}</p>
              </div>
            </div>

            <div
              style={{
                margin: "10px 0",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                fontSize: "14px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p style={{ fontWeight: "bold" }}>Order Info</p>
                <p>Order ID: {order?.orderId}</p>
                <p>Placed: {formatStockDate(order?.timestamp)}</p>
                <p>Payment Method: COD:{order?.paymentType || ""}</p>
                <p>Total Product: {order?.quantity || 1}</p>
                <p>Delivery: {order?.courier}</p>
              </div>
              <div className="col-span-2 flex w-full flex-col items-center">
                {/* <Barcode value={order?.orderId} width={2} /> */}
                <QRCode
                  size={256}
                  style={{
                    height: "100px",
                    maxWidth: "100px",
                    width: "100%",
                  }}
                  value={order?.orderId}
                  viewBox={`0 0 256 256`}
                />
                <p>{order?.orderId}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p style={{ fontWeight: "bold" }}>Delivery Address</p>
                <p>Name: {order?.name}</p>

                <p>
                  Address: {order?.address ? order.address + ", " : ""}
                  {order?.thana ? order.thana + ", " : ""}
                  {order?.district ? order.district : ""}
                </p>

                <p>Phone: {order?.phone}</p>
                <p>Email: {order?.email}</p>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <div>
                <table
                  style={{
                    width: "100%",
                    textAlign: "left",
                    color: "black",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        fontSize: "14px",
                        backgroundColor: "#ccc",
                        padding: "5px",
                      }}
                    >
                      <th style={{ textAlign: "start" }}>SL</th>
                      <th style={{ textAlign: "center" }}>Product</th>
                      <th style={{ textAlign: "center" }}>Quantity</th>
                      <th style={{ textAlign: "center" }}>Unit Price</th>
                      <th style={{ textAlign: "center" }}>Total Price</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#000" }}>
                    {order?.products?.map((item, index) => (
                      <tr
                        key={item._id}
                        style={{ marginTop: "5px", border: "1px solid #ccc" }}
                      >
                        <td
                          style={{
                            minWidth: "10px",
                            textAlign: "start",
                            padding: "0px 5px",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            minWidth: "50px",
                            textAlign: "center",
                            padding: "0px 5px",
                          }}
                        >
                          {item?.name}
                        </td>

                        <td
                          style={{
                            minWidth: "50px",
                            textAlign: "center",
                            padding: "0px 5px",
                          }}
                        >
                          {item.quantity}
                        </td>
                        <td
                          style={{
                            minWidth: "50px",
                            textAlign: "center",
                            padding: "0px 5px",
                          }}
                        >
                          {item?.salePrice}
                        </td>
                        <td
                          style={{
                            minWidth: "50px",
                            textAlign: "center",
                            padding: "0px 5px",
                          }}
                        >
                          {item.salePrice * item.quantity} Tk
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "1px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    border: "1px solid #ccc",
                    borderBottom: "none",
                    padding: "4px",
                    width: "300px",
                  }}
                >
                  <span>Subtotal </span>
                  <span style={{ textAlign: "end" }}>{order?.total} Tk</span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    border: "1px solid #ccc",
                    borderBottom: "none",
                    padding: "4px",
                    width: "300px",
                  }}
                >
                  <span>Shipping: </span>
                  <span style={{ textAlign: "end" }}>
                    {order?.deliveryCharge} Tk
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    border: "1px solid #ccc",
                    borderBottom: "none",
                    padding: "4px",
                    width: "300px",
                  }}
                >
                  <span>Total: </span>
                  <span style={{ textAlign: "end" }}>
                    {parseInt(order?.total) + parseInt(order?.deliveryCharge)}{" "}
                    Tk
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    border: "1px solid #ccc",
                    borderBottom: "none",
                    padding: "4px",
                    width: "300px",
                  }}
                >
                  <span>Advance Payment: </span>
                  <span style={{ textAlign: "end" }}>{order?.advance} Tk</span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    border: "1px solid #ccc",
                    borderBottom: "none",
                    padding: "4px",
                    width: "300px",
                    backgroundColor: "#ccc",
                  }}
                >
                  <span>Customer Payable: </span>
                  <span style={{ textAlign: "end" }}>{order?.cash} Tk</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ fontWeight: "bold", marginTop: "20px" }}>
                  IF YOU HAVE ANY QUESTION CONCERNING THIS INVOICE. CONTACT OUR
                  CARE
                </p>
                <p>
                  {/* DEPARTMENT AT CARE@MOMLEY.COM */} Thank you for your order
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-5">
        <ReactToPrint
          trigger={() => (
            <button className="flex w-full items-center justify-center space-x-1 rounded-md border border-blue-500 py-2 text-sm text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white">
              Print this out!
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
    </div>
  );
};

export default InvoiceGenerator;
