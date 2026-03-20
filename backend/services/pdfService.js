import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generatePDF = (invoice, user) => {
  return new Promise((resolve, reject) => {
    try {
      // ✅ ENSURE UPLOADS DIRECTORY EXISTS
      const uploadDir = path.join("uploads", "pdfs");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `invoice-${Date.now()}.pdf`;
      const filePath = path.join(uploadDir, fileName);

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // 🎨 THEME
      if (invoice.theme === "color") {
        doc.fillColor("#2563eb"); // Blue
      } else {
        doc.fillColor("black");
      }

      // 🔥 HEADER
      doc.fontSize(22).text("INVOICE", { align: "center" });
      doc.moveDown();

      // 🖼 LOGO (with error handling)
      if (user?.logo) {
        const logoPath = path.join(process.cwd(), user.logo);
        if (fs.existsSync(logoPath)) {
          try {
            doc.image(logoPath, 50, 40, { width: 80 });
          } catch (err) {
            console.log("Logo render error:", err.message);
          }
        }
      }

      doc.moveDown(2);

      // 👤 CLIENT DETAILS
      doc.fontSize(12);
      doc.fillColor("black");
      doc.text(`Client: ${invoice.clientName}`);
      doc.text(`Status: ${invoice.status}`);
      doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);

      doc.moveDown();

      // 📦 ITEMS
      doc.fontSize(14).fillColor("#1f2937").text("Items:");
      doc.moveDown(0.5);

      doc.fontSize(10);
      
      // Table header
      doc.text("Description", 50, doc.y, { continued: true, width: 200 });
      doc.text("Qty", 260, doc.y, { continued: true, width: 50 });
      doc.text("Price", 320, doc.y, { continued: true, width: 80 });
      doc.text("Amount", 410, doc.y, { width: 100 });
      
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);

      // Items
      invoice.items?.forEach((item) => {
        const itemAmount = item.quantity * item.price;
        doc.text(item.name, 50, doc.y, { continued: true, width: 200 });
        doc.text(item.quantity.toString(), 260, doc.y, { continued: true, width: 50 });
        doc.text(`₹${item.price}`, 320, doc.y, { continued: true, width: 80 });
        doc.text(`₹${itemAmount}`, 410, doc.y, { width: 100 });
        doc.moveDown(0.5);
      });

      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // 💰 TOTALS
      doc.fontSize(12);
      doc.text(`Subtotal: ₹${invoice.amount}`, { align: "right" });
      
      if (invoice.gst > 0) {
        doc.text(`GST (18%): ₹${invoice.gst}`, { align: "right" });
      }
      
      doc.fontSize(14);
      doc.fillColor("#059669");
      doc.text(`Final Amount: ₹${invoice.finalAmount}`, { align: "right" });

      doc.moveDown(3);

      // ✍️ SIGNATURE (with error handling)
      if (user?.signature) {
        const signaturePath = path.join(process.cwd(), user.signature);
        if (fs.existsSync(signaturePath)) {
          try {
            doc.image(signaturePath, 400, doc.y, { width: 100 });
            doc.moveDown(2);
          } catch (err) {
            console.log("Signature render error:", err.message);
          }
        }
      }

      // Footer
      doc.fontSize(10).fillColor("gray");
      doc.text("Thank you for your business!", { align: "center" });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);

    } catch (err) {
      reject(err);
    }
  });
};
