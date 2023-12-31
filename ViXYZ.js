const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Qrcode = require('qrcode')
const TelegramBot = require("node-telegram-bot-api")

const admin = '917736381119@c.us';
// (incase Needed) const admin2 = '918686883838@c.us';
const Dealer = '2348163376700@c.us';

const groupID1 = '120363132061932497@g.us';
const groupID2 = '120363181774801103@g.us';

console.log(`Made by IG/_IVXYZ`)

const botToken = '6552828975:AAF-XWJKsDm4PZ9ZNkgza9dcb1XCdq6B-Q8'
const bot = new TelegramBot(botToken, { polling: true });



const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ["--no-sandbox"]
    }
});

client.on('qr', async (qr) => {
    console.log('Scan the QR code to log in:');
    qrcode.generate(qr, { small: true });

    // Generate the QR code image
    const qrImageBuffer = await Qrcode.toBuffer(qr, { errorCorrectionLevel: 'H' });

    // Replace 'TARGET_TELEGRAM_USER_ID' with the actual user ID you want to send the image to
    const targetUserId = '1148001896';

    // Send the QR code image as a photo to the specified user
    bot.sendPhoto(targetUserId, qrImageBuffer, { caption: 'Scan the QR code to log in' });
});

client.on('ready', () => {
    console.log('Client is ready!');
    client.sendMessage(admin, 'Bot Client Initialized...');
});

bot.on('polling_error',(error)=>{
    console.error('polling error: ', error)
})

let isBotEnabled = false;

let totalCollected = 0

client.on('ready', () => {
    console.log('Client is ready!');
    client.sendMessage(admin, 'Bot Client Initialized...');
});

isBotEnabled = false;

totalCollected = 0

client.on('message', async (message) => {
    try {
        if (message.from === groupID1 || message.from === groupID2) {
            if (message._data.id.participant === Dealer) {
                console.log('Message received from the dealer');
                if (isBotEnabled) {
                    console.log(`Bot is Checking for Captcha match`);
                    const captchaReceived = message.body.match(/Captcha: (\w+)/);
                    if (captchaReceived) {
                        const tierReceived = message.body.match(/🪄 \*Tier:\* (\w+)/);
                        console.log(tierReceived)
                        const tierCheck = tierReceived[1];
                        if (captchaReceived && captchaReceived[1]) {
                            if(tierCheck === 'S' || tierCheck == 4 || tierCheck == 5){
                                console.log(`Captcha received: ${captchaReceived[1]}`);
                                client.sendMessage(
                                    admin,
                                    `Card sent by Dealer [Captcha:${captchaReceived[1]} , Tier:${tierReceived[1]} ]`
                                );
                                if (!message.body.match(new RegExp(`#claim ${captchaReceived[1]}`))) {
                                    setTimeout(() => {
                                        client.sendMessage(message.from, `#claim ${captchaReceived[1]}`);
                                    }, 500);

                                totalCollected += 1

                                console.log(
                                    `we Claimed the card ${captchaReceived[1]} with Tier ${tierReceived[1]}`
                                );
                            } else {
                                client.sendMessage(admin, 'Someone already claimed');
                            }
                        }
                    }} else {
                        console.error('Invalid captcha format');
                    }
                } else {
                    console.log('Bot is currently disabled');
                }
            }
        }
    } catch (error) {
        console.error('An error occurred in Group side:', error);
    }
});

// Listen for commands to enable or disable the bot
client.on('message', (message) => {
    try {
        if (message.from === admin) {
            if (message.body === '/turnOn') {
                isBotEnabled = true;
                console.log(`Bot is Listening for Captcha`);
                client.sendMessage(message.from, 'Bot is now enabled.');
            } else if (message.body === '/turnOff') {
                isBotEnabled = false;
                console.log(`Bot is`);
                client.sendMessage(message.from, 'Bot is now disabled.');
            } else if (message.body === '/status') {
                if (isBotEnabled) {
                    client.sendMessage(admin, 'Bot is On listening for Captcha');
                } else {
                    client.sendMessage(admin, 'Bot is Off Sleep Mode.. /turnOn to start claiming');
                }
            }else if(message.body === '/total'){
                client.sendMessage(message.from, `Total Cards Collected from Turning on is ${totalCollected}`)
            }
        }
    } catch (error) {
        console.error('An error occurred in Admin Msg side:', error);
    }
});

client.initialize();
