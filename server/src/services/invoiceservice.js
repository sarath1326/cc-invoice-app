// Your invoice service file
import { getWhatsAppClient, isWhatsAppReady, checkClientState } from "../../server.js";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

// Helper function to send message with retry logic
async function sendMessageWithRetry(client, chatId, message, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Check client state before sending
            const state = await client.getState();
            if (state !== 'CONNECTED') {
                throw new Error(`Client not connected. State: ${state}`);
            }

            await client.sendMessage(chatId, message);
            console.log(`✅ Message sent successfully (attempt ${attempt})`);
            return true;

        } catch (error) {
            console.error(`❌ Send attempt ${attempt}/${retries} failed:`, error.message);

            if (attempt === retries) {
                throw new Error(`Failed to send message after ${retries} attempts: ${error.message}`);
            }

            // Wait before retry (exponential backoff: 2s, 4s, 6s)
            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        }
    }
}

// Helper function to send media with retry logic
async function sendMediaWithRetry(client, chatId, media, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const state = await client.getState();
            if (state !== 'CONNECTED') {
                throw new Error(`Client not connected. State: ${state}`);
            }

            await client.sendMessage(chatId, media);
            console.log(`✅ Media sent successfully (attempt ${attempt})`);
            return true;

        } catch (error) {
            console.error(`❌ Media send attempt ${attempt}/${retries} failed:`, error.message);

            if (attempt === retries) {
                throw new Error(`Failed to send media after ${retries} attempts: ${error.message}`);
            }

            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        }
    }
}

export const invoiceService = {
    generateServiceInvoiceService: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const pdfFile = req.file;
                const finalData = JSON.parse(req.body.finalData);
                const phoneNumber = `91${finalData.invoiceData.customer.mob}`;
                const chatId = phoneNumber + "@c.us";

                console.log("📄 Invoice received:", pdfFile.filename);
                console.log("📱 Sending to:", phoneNumber);

                // Get WhatsApp client
                const client = getWhatsAppClient();

                // Check if WhatsApp is ready
                if (!isWhatsAppReady() || !client) {
                    throw new Error("WhatsApp service is not ready. Please try again later.");
                }

                // Double-check client state
                const clientState = await checkClientState();
                console.log("📱 Current client state:", clientState);

                if (clientState !== 'CONNECTED') {
                    throw new Error(`WhatsApp client is not connected. State: ${clientState}`);
                }

                // Check if number is registered on WhatsApp
                try {
                    const isRegistered = await client.isRegisteredUser(chatId);
                    if (!isRegistered) {
                        throw new Error(`Phone number ${phoneNumber} is not registered on WhatsApp`);
                    }
                    console.log("✅ Phone number is registered on WhatsApp");
                } catch (regError) {
                    console.warn("⚠️ Could not verify phone registration:", regError.message);
                    // Continue anyway as this check sometimes fails even for valid numbers
                }

                const fileUrl = `https://breezy-invoice-api.onrender.com/uploads/${pdfFile.filename}`;
                const firstMessage = "*Breezy Cooling Solution ❄️*\nThis is your service invoice! Please check.";
                const reviewMessage = `Share your experience with a Google review:\nhttps://g.co/kgs/iPvn627\n\n6282309320 save this number for future connections!`;

                console.log("📤 Step 1: Sending welcome message...");
                await sendMessageWithRetry(client, chatId, firstMessage);

                // Wait 3 seconds before sending media to avoid rate limiting
                console.log("⏳ Waiting 3 seconds before sending invoice...");
                await new Promise(resolve => setTimeout(resolve, 3000));

                console.log("📤 Step 2: Sending invoice PDF...");
                const media = await MessageMedia.fromUrl(fileUrl, { unsafeMime: true });
                await sendMediaWithRetry(client, chatId, media);

                // Wait 3 seconds before sending final message
                console.log("⏳ Waiting 3 seconds before sending review message...");
                await new Promise(resolve => setTimeout(resolve, 3000));

                console.log("📤 Step 3: Sending review message...");
                await sendMessageWithRetry(client, chatId, reviewMessage);

                console.log("✅ Invoice sent successfully to", phoneNumber);

                resolve({
                    success: true,
                    fileUrl: fileUrl,
                    recipient: phoneNumber,
                    message: "Invoice sent successfully!"
                });

            } catch (error) {
                console.error("❌ Invoice send error:", error.message);
                console.error("❌ Full error:", error);

                // Provide detailed error information
                const errorDetails = {
                    success: false,
                    error: error.message,
                    whatsappReady: isWhatsAppReady(),
                    clientState: await checkClientState().catch(() => 'UNKNOWN'),
                    timestamp: new Date().toISOString()
                };

                reject(errorDetails);
            }
        });
    }
};