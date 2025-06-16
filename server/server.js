import dotenv from 'dotenv';

import express from "express"
import cors from 'cors'
import { connect } from "./src/config/DB.js"
import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal"
import multer from 'multer';
import { MongoStore } from "wwebjs-mongo"
import mongoose from "mongoose"
import invoiceRouter from "./src/routers/invoicerouter.js"

dotenv.config();
const { Client, LocalAuth, MessageMedia, RemoteAuth } = pkg;


const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors("*"))


// mongoDB connecting
const isConnected = await connect()




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));


let client;


// async function initializeWhatsApp() {
//     try {
//         // Ensure MongoDB is connected first
//         console.log("🔌 Establishing MongoDB connection...");


//         if (!isConnected) {
//             console.log("🔄 Retrying in 5 seconds...");
//             setTimeout(initializeWhatsApp, 5000);
//             return;
//         }

//         // Verify connection is ready
//         if (mongoose.connection.readyState !== 1) {
//             throw new Error('MongoDB connection not ready');
//         }

//         console.log("🏪 Creating MongoStore...");
//         const store = new MongoStore({ mongoose: mongoose });

//         console.log("🤖 Initializing WhatsApp client...");
//         client = new Client({
//             authStrategy: new RemoteAuth({
//                 clientId: "cc-bot",
//                 store: store,
//                 backupSyncIntervalMs: 300000 // 5 minutes backup interval
//             }),
//         });

//         client.on("qr", (qr) => {
//             console.log("📌 Scan this QR code to connect:");
//             qrcode.generate(qr, { small: true });
//         });

//         client.on("ready", () => {
//             console.log("✅ WhatsApp Bot is ready!");
//         });

//         client.on("authenticated", () => {
//             console.log("✅ WhatsApp authenticated!");
//         });

//         // New event for RemoteAuth - session saved to database
//         client.on("remote_session_saved", () => {
//             console.log("💾 Session saved to remote database!");
//         });

//         client.on("message", async (message) => {
//             console.log("📩 New message received:");
//         });

//         client.on("disconnected", async (reason) => {
//             console.log("🚫 WhatsApp Disconnected:", reason);
//             console.log("🔄 Reconnecting in 5 seconds...");
//             setTimeout(initializeWhatsApp, 5000);
//         });

//         client.on("auth_failure", (message) => {
//             console.error("❌ Authentication failed:", message);
//         });

//         await client.initialize();

//     } catch (error) {
//         console.error("❌ Failed to initialize WhatsApp:", error);
//         console.log("🔄 Retrying in 10 seconds...");
//         setTimeout(initializeWhatsApp, 10000);
//     }
// }


// initializeWhatsApp().catch(console.error);





// setInterval(async () => {
//     console.log("🔄 Checking WhatsApp connection...");
//     if (!client || !client.info) {
//         console.log("❌ WhatsApp client is disconnected. Restarting...");
//         initializeWhatsApp();
//     } else {
//         console.log("✅ WhatsApp client is active.");
//     }
// }, 600000); // Every 10 minutes

// export default client;

























// test route



let isClientReady = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;





async function initializeWhatsApp() {
    try {
        console.log("🔌 Establishing MongoDB connection...");

        if (!isConnected) {
            console.log("🔄 Retrying in 5 seconds...");
            setTimeout(initializeWhatsApp, 5000);
            return;
        }

        if (mongoose.connection.readyState !== 1) {
            throw new Error('MongoDB connection not ready');
        }

        console.log("🏪 Creating MongoStore...");
        const store = new MongoStore({ mongoose: mongoose });

        console.log("🤖 Initializing WhatsApp client...");
        client = new Client({
            authStrategy: new RemoteAuth({
                clientId: "breezy-bot",
                store: store,
                backupSyncIntervalMs: 300000
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            }
        });

        client.on("qr", (qr) => {
            console.log("📌 Scan this QR code to connect:");
            qrcode.generate(qr, { small: true });
            isClientReady = false;
        });

        client.on("ready", async () => {
            console.log("✅ WhatsApp Bot is ready!");
            isClientReady = true;
            reconnectAttempts = 0;

            try {
                const info = client.info;
                console.log("📱 Bot Info:", {
                    wid: info.wid.user,
                    phone: info.me?.user,
                    name: info.pushname
                });
            } catch (err) {
                console.error("❌ Error getting client info:", err);
            }
        });

        client.on("authenticated", () => {
            console.log("✅ WhatsApp authenticated!");
        });

        client.on("remote_session_saved", () => {
            console.log("💾 Session saved to remote database!");
        });

        client.on("message", async (message) => {
            console.log("📩 New message received:");

        });

        client.on("disconnected", async (reason) => {
            console.log("🚫 WhatsApp Disconnected:", reason);
            isClientReady = false;

            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts++;
                console.log(`🔄 Reconnecting attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in 10 seconds...`);
                setTimeout(initializeWhatsApp, 10000);
            } else {
                console.error("❌ Max reconnection attempts reached. Manual intervention required.");
            }
        });

        client.on("auth_failure", (message) => {
            console.error("❌ Authentication failed:", message);
            isClientReady = false;
        });

        await client.initialize();

    } catch (error) {
        console.error("❌ Failed to initialize WhatsApp:", error);
        isClientReady = false;

        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            console.log(`🔄 Retrying initialization attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in 15 seconds...`);
            setTimeout(initializeWhatsApp, 15000);
        }
    }
}

// Enhanced connection check
setInterval(async () => {
    try {
        console.log("🔄 Checking WhatsApp connection...");

        if (!client) {
            console.log("❌ WhatsApp client is null. Restarting...");
            initializeWhatsApp();
            return;
        }

        const state = await client.getState();
        console.log(`📱 Connection State: ${state}, Ready: ${isClientReady}`);

        if (state !== 'CONNECTED') {
            console.log("❌ WhatsApp client is not connected. Marking as not ready...");
            isClientReady = false;

            setTimeout(() => {
                console.log("🔄 Attempting to reconnect...");
                initializeWhatsApp();
            }, 5000);
        } else {
            console.log("✅ WhatsApp client is active and connected.");
        }

    } catch (error) {
        console.error("❌ Error checking connection:", error);
        isClientReady = false;
        setTimeout(initializeWhatsApp, 5000);
    }
}, 300000); // Check every 5 minutes (300000ms)

// Start WhatsApp initialization
initializeWhatsApp().catch(console.error);

// Helper functions to use in other files
export function getWhatsAppClient() {
    return client;
}

export function isWhatsAppReady() {
    return isClientReady && client !== null;
}

export async function checkClientState() {
    if (!client) return 'NO_CLIENT';
    try {
        return await client.getState();
    } catch (error) {
        return 'ERROR';
    }
}

export default client;










app.get("/", (req, res) => {
    res.send("Server is running...");
    console.log("test")
});


// router

app.use("/api/invoice", invoiceRouter)





app.listen(3018, () => {

    console.log("server started")
})

