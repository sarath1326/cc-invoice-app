

import client from "../../server.js"
import pkg from "whatsapp-web.js"
const { MessageMedia } = pkg
import { BillingItems } from "../../DB/model/billingItem.js"







export const invoiceService = {



    generateServiceInvoiceService: (req) => {

        return new Promise(async (resolve, reject) => {

            try {


                const pdfFile = req.file;
                const finalData = JSON.parse(req.body.finalData);
                const phoneNumber = `91${finalData.invoiceData.customer.mob}`;
                const chatId = phoneNumber + "@c.us";

                console.log("📄 Invoice received:", pdfFile.filename);

                const fileUrl = `https://cc-invoice-api.onrender.com/uploads/${pdfFile.filename}`;


                const secondMessage = `Share your experience with a Google review:\nhttps://g.co/kgs/iPvn627\n\n6282309320 save this number for future connections!`;

                const media = await MessageMedia.fromUrl(fileUrl, { unsafeMime: true });


                const message = "*Cool&Clean ❄️*\nThis is your service invoice! Please check.";

                await client.sendMessage(chatId, message);
                await client.sendMessage(chatId, media);
                // await client.sendMessage(chatId, secondMessage);

                console.log("invoice sented !!")

                resolve(fileUrl)


            } catch (error) {

                console.log("invoice sent error", error.message)
                reject()
            }
        })
    },
    getAllInvoiceItems: () => {

        return new Promise(async (resolve, reject) => {

            try {

                const result = await BillingItems.find().sort({ createdAt: -1 })
                resolve(result)

            } catch (error) {

                reject(error)
            }

        })
    },
    createInvoiceItems: (formData) => {

        return new Promise(async (resolve, reject) => {

            try {

                const final = new BillingItems(formData)
                await final.save()
                resolve()

            } catch (error) {
                reject(error)
            }
        })
    },
    deleteInvoiceitem: (itemId) => {

        return new Promise(async (resolve, reject) => {

            try {

                await BillingItems.findByIdAndDelete(itemId)
                resolve()

            } catch (error) {
                resolve(error)
            }
        })
    }






}






