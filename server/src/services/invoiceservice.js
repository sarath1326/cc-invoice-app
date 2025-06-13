
import client from "../../server.js"
import pkg from "whatsapp-web.js"
const { MessageMedia } = pkg




export const invoiceService = {



    generateServiceInvoiceService: (req) => {

        return new Promise(async (resolve, reject) => {

            try {


                const pdfFile = req.file;
                const finalData = JSON.parse(req.body.finalData);
                const phoneNumber = `91${finalData.invoiceData.customer.mob}`;
                const chatId = phoneNumber + "@c.us";

                console.log("📄 Invoice received:", pdfFile.filename);

                const fileUrl = `https://breezy-invoice-api.onrender.com/uploads/${pdfFile.filename}`;


                const secondMessage = `Share your experience with a Google review:\nhttps://g.co/kgs/iPvn627\n\n6282309320 save this number for future connections!`;

                const media = await MessageMedia.fromUrl(fileUrl, { unsafeMime: true });

                
                const message = "*Breezy Cooling Solution ❄️*\nThis is your service invoice! Please check.";

                await client.sendMessage(chatId, message);
                await client.sendMessage(chatId, media);
                await client.sendMessage(chatId, secondMessage);

                console.log("invoice sented !!")

               resolve(fileUrl)


            } catch (error) {

                console.log("invoice sent error", error.message)
                reject()
            }
        })
    }
}