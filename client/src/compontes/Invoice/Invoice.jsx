import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "INV-12345",
    date: "2025-01-09",
    customer: {
      name: "John Doe",
      address: "123 Main Street, Springfield, USA",
    },
    items: [
      { description: "Product A", quantity: 2, price: 50 },
      { description: "Product B", quantity: 1, price: 100 },
      { description: "Service C", quantity: 3, price: 30 },
    ],
    tax: 10,
  });

  const handleChange = (field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index][field] = value;
    setInvoiceData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = [...invoiceData.items];
    updatedItems.splice(index, 1);
    setInvoiceData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const subtotal = invoiceData.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const taxAmount = (subtotal * invoiceData.tax) / 100;
  const total = subtotal + taxAmount;

  const downloadPdf = async () => {
    const invoice = document.getElementById("invoice-pdf");

    // Temporarily make the PDF section visible
    invoice.style.position = "static";
    invoice.style.left = "0";
    invoice.style.opacity = "1";

    try {
      const canvas = await html2canvas(invoice);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Re-hide the PDF section
      invoice.style.position = "absolute";
      invoice.style.left = "-9999px";
      invoice.style.opacity = "0";
    }
  };

  return (
    <div>
      {/* Editable Invoice Section */}
      <div
        id="invoice"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Invoice</h1>
        <p>
          <strong>Invoice Number:</strong>{" "}
          <input
            type="text"
            value={invoiceData.invoiceNumber}
            onChange={(e) => handleChange("invoiceNumber", e.target.value)}
          />
        </p>
        <p>
          <strong>Date:</strong>{" "}
          <input
            type="date"
            value={invoiceData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </p>
        <h3>Customer Details:</h3>
        <p>
          <strong>Name:</strong>{" "}
          <input
            type="text"
            value={invoiceData.customer.name}
            onChange={(e) =>
              setInvoiceData((prev) => ({
                ...prev,
                customer: { ...prev.customer, name: e.target.value },
              }))
            }
          />
        </p>
        <p>
          <strong>Address:</strong>{" "}
          <input
            type="text"
            value={invoiceData.customer.address}
            onChange={(e) =>
              setInvoiceData((prev) => ({
                ...prev,
                customer: { ...prev.customer, address: e.target.value },
              }))
            }
          />
        </p>
        <h3>Items:</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Description
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Quantity
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                  />
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", Number(e.target.value))
                    }
                  />
                </td>

                
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", Number(e.target.value))
                    }
                  />
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  ${(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addItem}>Add Item</button>

        <h3>Summary:</h3>
        <p>
          <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
        </p>
        <p>
          <strong>Tax (%):</strong>{" "}
          <input
            type="number"
            value={invoiceData.tax}
            onChange={(e) => handleChange("tax", Number(e.target.value))}
          />
        </p>
        <h2>
          <strong>Total:</strong> ${total.toFixed(2)}
        </h2>
      </div>

      {/* Hidden PDF Section */}
      <div
        id="invoice-pdf"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Arial, sans-serif",
          position: "absolute",
          left: "-9999px",
          opacity: 0,
        }}
      >
        <h1 style={{ textAlign: "center" }}>Invoice</h1>
        <p>
          <strong>Invoice Number:</strong> {invoiceData.invoiceNumber}
        </p>
        <p>
          <strong>Date:</strong> {invoiceData.date}
        </p>
        <h3>Customer Details:</h3>
        <p>
          <strong>Name:</strong> {invoiceData.customer.name}
        </p>
        <p>
          <strong>Address:</strong> {invoiceData.customer.address}
        </p>
        <h3>Items:</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Description
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Quantity
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.description}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.quantity}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  ${item.price.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  ${(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Summary:</h3>
        <p>
          <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
        </p>
        <p>
          <strong>Tax (%):</strong> {invoiceData.tax}%
        </p>
        <h2>
          <strong>Total:</strong> ${total.toFixed(2)}
        </h2>
      </div>

      <button onClick={downloadPdf}>Download Invoice as PDF</button>
    </div>
  );
};

export default Invoice;
