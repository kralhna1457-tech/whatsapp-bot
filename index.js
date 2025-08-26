const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
});

// QR Olayı
client.on("qr", (qr) => {
    // Konsolda ASCII QR
    qrcode.generate(qr, { small: true });
    console.log("📲 QR kod yukarıda (ASCII).");

    // ✅ QR kodu link olarak göster
    console.log("🔗 QR kodunu tarayıcıda aç:");
    console.log(
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
            qr
        )}`
    );
});

// Başarılı giriş
client.on("ready", () => {
    console.log("✅ Bot başarıyla bağlandı!");
});

// Mesajlara cevap
client.on("message", async (message) => {
    console.log(`💬 ${message.from}: ${message.body}`);

    // Basit akış
    if (message.body.toLowerCase() === "merhaba") {
        await message.reply("Hello! 👋 How can I help you today?\n1️⃣ Hotel\n2️⃣ House");
    } else if (message.body === "1" || message.body.toLowerCase() === "otel") {
        await message.reply("🛎️ Please provide the time for hotel booking:");
    } else if (message.body === "2" || message.body.toLowerCase() === "ev") {
        await message.reply("🏠 Please provide the time for house booking:");
    } else if (message.body.match(/\d{1,2}:\d{2}/)) {
        await message.reply("✅ Got it! I will get back to you shortly ⏳");
    }
});

// Başlat
client.initialize();
