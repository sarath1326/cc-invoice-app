
import express from "express"
const route = express.Router()
import { invoiceControler } from "../controlers/invoicecontroler.js"
import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

route.post("/serviceinvoice",upload.single("pdf"), invoiceControler.generateServiceInvoice)
route.get("/invoice-items", invoiceControler.getAllInvoiceItems)
route.post("/invoice-items",invoiceControler.createInvoiceItems)
route.delete("/invoice-items/:itemId",invoiceControler.deleteInvoiceItem)














export default route