import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Generate downloadable PDF
export const generateOrderPDFDownload = async (order) => {
    try {
        // Create a temporary container for the receipt
        const tempContainer = document.createElement('div')
        tempContainer.innerHTML = createReceiptHTML(order)
        tempContainer.style.position = 'absolute'
        tempContainer.style.left = '-9999px'
        tempContainer.style.width = '800px'
        document.body.appendChild(tempContainer)

        // Convert HTML to canvas
        const canvas = await html2canvas(tempContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        })

        // Create PDF from canvas
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })

        const imgWidth = 210 // A4 width in mm
        const pageHeight = 297 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0

        // Add image to PDF, handling multiple pages if needed
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
        }

        // Download PDF
        pdf.save(`Order_Receipt_${order.id}.pdf`)

        // Clean up
        document.body.removeChild(tempContainer)
    } catch (error) {
        console.error('Error generating PDF:', error)
        alert('Error generating receipt. Please try again.')
    }
}

// Print receipt
export const generateOrderPDF = (order) => {
    const receiptHTML = createReceiptHTML(order)

    const printWindow = window.open('', '', 'height=600,width=800')
    printWindow.document.write(receiptHTML)
    printWindow.document.close()
    printWindow.print()
}

// Helper function to create receipt HTML - Modern Single Page Format
const createReceiptHTML = (order) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Receipt - ${order.id}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: white;
          color: #000;
        }
        .receipt-container {
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          padding: 12mm;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .header {
          text-align: center;
          margin-bottom: 6mm;
          border-bottom: 3px solid #ff6b35;
          padding-bottom: 6mm;
        }
        .logo {
          font-size: 22px;
          font-weight: 800;
          color: #ff6b35;
          margin-bottom: 2mm;
          letter-spacing: -0.5px;
        }
        .tagline {
          color: #000;
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .receipt-title {
          font-size: 13px;
          font-weight: 700;
          color: #000;
          margin-top: 3mm;
          letter-spacing: 0.5px;
        }
        .order-header {
          background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
          padding: 7mm;
          border-radius: 6px;
          margin-bottom: 6mm;
          color: white;
          font-size: 9px;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.15);
        }
        .order-header-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2.5mm;
          font-size: 9px;
        }
        .order-header-row:last-child {
          margin-bottom: 0;
        }
        .order-header-label {
          font-weight: 600;
          opacity: 0.9;
        }
        .order-header-value {
          color: white;
          font-weight: 500;
        }
        .status-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.25);
          color: white;
          padding: 2mm 5mm;
          border-radius: 4px;
          font-size: 7px;
          font-weight: 700;
          text-transform: uppercase;
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        .section {
          margin-bottom: 5mm;
        }
        .section-title {
          font-size: 9px;
          font-weight: 700;
          color: #000;
          border-bottom: 2px solid #ff6b35;
          padding-bottom: 2mm;
          margin-bottom: 2.5mm;
          letter-spacing: 0.3px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6mm;
          font-size: 8px;
          margin-bottom: 2mm;
        }
        .info-block {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 7px;
          color: #000;
          text-transform: uppercase;
          margin-bottom: 1mm;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .info-value {
          font-size: 8px;
          color: #000;
          font-weight: 500;
          line-height: 1.4;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 3mm;
          font-size: 8px;
        }
        .items-table thead {
          background: #f0f0f0;
          border-bottom: 2px solid #ff6b35;
        }
        .items-table th {
          padding: 2mm;
          text-align: left;
          font-size: 7px;
          font-weight: 700;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .items-table td {
          padding: 2mm;
          border-bottom: 1px solid #e0e0e0;
          font-size: 8px;
          color: #000;
        }
        .item-name {
          font-weight: 600;
          color: #000;
        }
        .item-qty {
          text-align: center;
          color: #000;
          font-weight: 500;
        }
        .item-price {
          text-align: right;
          font-weight: 700;
          color: #ff6b35;
        }
        .summary-box {
          background: #f8f9fa;
          padding: 5mm;
          border-radius: 6px;
          border-left: 4px solid #ff6b35;
          font-size: 8px;
          margin-bottom: 3mm;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5mm;
          font-size: 8px;
        }
        .summary-row:last-child {
          margin-bottom: 0;
        }
        .summary-label {
          color: #000;
          font-weight: 500;
        }
        .summary-value {
          color: #000;
          font-weight: 700;
        }
        .summary-row.discount .summary-value {
          color: #27ae60;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding-top: 1.5mm;
          border-top: 2px solid #ff6b35;
          margin-top: 1.5mm;
          font-size: 10px;
          font-weight: 800;
          color: #ff6b35;
        }
        .payment-delivery {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5mm;
          font-size: 8px;
          margin-bottom: 3mm;
        }
        .payment-block, .delivery-block {
          background: #f8f9fa;
          padding: 4mm;
          border-radius: 6px;
          border-top: 3px solid #ff6b35;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .payment-block h4, .delivery-block h4 {
          font-size: 7px;
          color: #000;
          text-transform: uppercase;
          margin-bottom: 1.5mm;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .payment-block p, .delivery-block p {
          font-size: 8px;
          color: #000;
          font-weight: 600;
        }
        .footer {
          text-align: center;
          margin-top: auto;
          padding-top: 3mm;
          border-top: 1px solid #e0e0e0;
          color: #000;
          font-size: 7px;
        }
        .thank-you {
          font-size: 9px;
          font-weight: 800;
          color: #ff6b35;
          margin-bottom: 1.5mm;
          letter-spacing: 0.3px;
        }
        .footer-text {
          font-size: 7px;
          line-height: 1.3;
          margin-bottom: 0.8mm;
          color: #000;
          font-weight: 500;
        }
        .footer-contact {
          font-size: 7px;
          color: #000;
          margin-top: 1.5mm;
          font-weight: 500;
        }
        .footer-timestamp {
          font-size: 6px;
          color: #666;
          margin-top: 1.5mm;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .receipt-container {
            box-shadow: none;
            margin: 0;
            padding: 12mm;
            height: auto;
            page-break-after: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <!-- Header -->
        <div class="header">
          <div class="logo">🛍️ BuyFastBD</div>
          <div class="tagline">Online Shopping Destination</div>
          <div class="receipt-title">ORDER RECEIPT</div>
        </div>

        <!-- Order Header Info -->
        <div class="order-header">
          <div class="order-header-row">
            <span class="order-header-label">Order ID:</span>
            <span class="order-header-value">${order.id}</span>
          </div>
          <div class="order-header-row">
            <span class="order-header-label">Date:</span>
            <span class="order-header-value">${order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
          </div>
          <div class="order-header-row">
            <span class="order-header-label">Status:</span>
            <span class="order-header-value"><span class="status-badge">${order.status || 'Pending'}</span></span>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="section">
          <div class="section-title">👤 CUSTOMER INFORMATION</div>
          <div class="info-grid">
            <div class="info-block">
              <div class="info-label">Name</div>
              <div class="info-value">${order.userName}</div>
            </div>
            <div class="info-block">
              <div class="info-label">Email</div>
              <div class="info-value">${order.userEmail}</div>
            </div>
            <div class="info-block">
              <div class="info-label">Phone</div>
              <div class="info-value">${order.phone}</div>
            </div>
            <div class="info-block">
              <div class="info-label">Address</div>
              <div class="info-value">${order.deliveryAddress}</div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="section">
          <div class="section-title">📦 ORDER ITEMS</div>
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 55%;">Product</th>
                <th style="width: 15%;">Qty</th>
                <th style="width: 30%; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item, idx) => `
                <tr>
                  <td class="item-name">${idx + 1}. ${item.name}</td>
                  <td class="item-qty">x${item.quantity}</td>
                  <td class="item-price">৳${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Order Summary -->
        <div class="section">
          <div class="section-title">💰 ORDER SUMMARY</div>
          <div class="summary-box">
            <div class="summary-row">
              <span class="summary-label">Subtotal:</span>
              <span class="summary-value">৳${(order.subtotal || 0).toLocaleString()}</span>
            </div>
            ${order.discount > 0 ? `
              <div class="summary-row discount">
                <span class="summary-label">Discount:</span>
                <span class="summary-value">-৳${(order.discount || 0).toLocaleString()}</span>
              </div>
            ` : ''}
            <div class="summary-row">
              <span class="summary-label">Delivery (${order.deliveryLocation === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
              <span class="summary-value">৳${(order.deliveryCost || 0).toLocaleString()}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Delivery:</span>
              <span class="summary-value">৳${order.deliveryCost || 0}</span>
            </div>
            <div class="total-row">
              <span>TOTAL:</span>
              <span>৳${(order.total || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <!-- Payment & Delivery Info -->
        <div class="section">
          <div class="section-title">🔐 PAYMENT & DELIVERY</div>
          <div class="payment-delivery">
            <div class="payment-block">
              <h4>Payment</h4>
              <p>${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
            </div>
            <div class="delivery-block">
              <h4>Est. Delivery</h4>
              <p>${order.estimatedDelivery ? new Date(order.estimatedDelivery.toDate()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '2-3 days'}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="thank-you">Thank You for Your Order!</div>
          <div class="footer-text">We appreciate your business. Your order will be shipped soon.</div>
          <div class="footer-contact">
            Support: support@buyfastbd.com | +880 1234-567890
          </div>
          <div class="footer-timestamp">
            Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
