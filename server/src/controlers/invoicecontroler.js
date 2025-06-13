

import { invoiceService } from "../services/invoiceservice.js"
import { response } from "../utils/responseUtils.js"



export const invoiceControler = {

    generateServiceInvoice: async (req, res) => {


        try {

            console.log("invoice")

            const result = await invoiceService.generateServiceInvoiceService(req)

            response.success(res, result, "invoice ")

        } catch (error) {
            console.log("error", error)
            response.error(res)
        }
    }

}

