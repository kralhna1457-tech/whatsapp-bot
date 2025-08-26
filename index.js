const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

let state = {};
client.on('qr', qr => {
    // Konsolda ASCII QR
    qrcode.generate(qr, { small: true });
    console.log('📲 QR kod yukarıda, WhatsApp ile okut.');

    // Alternatif: QR'ı link olarak da yazdır
    console.log("🔗 QR kodu buradan açabilirsin:");
    console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qr}`);
});

});

client.on('ready', () => {
    console.log('✅ Bot çalışıyor!');
});

client.on('message', async msg => {
    const chatId = msg.from;

    if (!state[chatId]) {
        await client.sendMessage(chatId, "Hello 👋 How can I help you?\nMerhaba 👋 Size nasıl yardımcı olabilirim?\n\n1️⃣ Hotel / Otel\n2️⃣ House / Ev");
        state[chatId] = { step: 1 };
        return;
    }

    if (state[chatId].step === 1) {
        if (msg.body.toLowerCase().includes('hotel') || msg.body.includes('otel')) {
            state[chatId] = { step: 2, choice: 'Hotel' };
            await client.sendMessage(chatId, "Please provide the time ⏰\nLütfen saat bilgisini giriniz ⏰");
        } else if (msg.body.toLowerCase().includes('house') || msg.body.includes('ev')) {
            state[chatId] = { step: 2, choice: 'House' };
            await client.sendMessage(chatId, "Please provide the time ⏰\nLütfen saat bilgisini giriniz ⏰");
        } else {
            await client.sendMessage(chatId, "Please type 'Hotel / Otel' or 'House / Ev'");
        }
        return;
    }

    if (state[chatId].step === 2) {
        state[chatId].time = msg.body;
        await client.sendMessage(chatId, "✅ Thank you! I’ll get back to you shortly.\n✅ Teşekkürler! Kısa süre içinde dönüş yapacağım.");
        state[chatId] = null; // sıfırla
    }
});

client.initialize();
