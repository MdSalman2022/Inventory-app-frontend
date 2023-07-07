import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import Barcode from "react-barcode";

const InvoiceGenerator = ({ order }) => {
  console.log(order);
  const componentRef = useRef();

  function formatStockDate(isoTimestamp) {
    const date = new Date(isoTimestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

    return formattedDate;
  }

  console.log(order);

  function generateUUID() {
    return "x4xyxyxyx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  console.log(generateUUID());

  return (
    <div className="container mx-auto h-full w-fit p-5">
      <div
        style={{
          padding: "1rem",
          color: "black",
          fontSize: "18px",
        }}
        id="print"
        ref={componentRef}
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
            <img
              style={{ height: "40px", width: "200px", objectFit: "cover" }}
              src="https://i.ibb.co/TW8T2kc/logo-momley.png"
              alt=""
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "12px",
              }}
            >
              <span>Momley.com, 2/2 Arambag Motijheel, Dhaka-1000</span>
              <span>Phone: 01700000000, Email: admin@momley.com</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontSize: "12px",
            }}
          >
            <p>Invoice ID: {order?._id}</p>
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
            <p>Order ID: {order?._id}</p>
            <p>Placed: {formatStockDate(order?.timestamp)}</p>
            <p>Payment Method: COD:Partial Paid</p>
            <p>Total Product: {order?.quantity || 1}</p>
            <p>Delivery: {order?.courier}</p>
          </div>
          <div className="col-span-2 w-[50%]">
            <Barcode value={order?.orderId} width={2} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ fontWeight: "bold" }}>Delivery Address</p>
            <p>Name: {order?.name}</p>
            <p>Address: {order?.address}</p>
            <p>Phone: {order?.phone}</p>
            <p>Email: {order?.email}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
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
                padding: "4px",
                width: "300px",
              }}
            >
              <span>Total: </span>
              <span style={{ textAlign: "end" }}>
                {parseInt(order?.total) + parseInt(order?.deliveryCharge)} Tk
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: "1px solid #ccc",
                padding: "4px",
                width: "300px",
              }}
            >
              <span>Cash Payment: </span>
              <span style={{ textAlign: "end" }}>{order?.advance} Tk</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                border: "1px solid #ccc",
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
            <p style={{ fontWeight: "bold" }}>
              IF YOU HAVE ANY QUESTION CONCERNING THIS INVOICE. CONTACT OUR CARE
            </p>
            <p>DEPARTMENT AT CARE@MOMLEY.COM Thank you for your order</p>
          </div>
        </div>
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
