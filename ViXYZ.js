const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const admin = '917736381119@c.us';
// (incase Needed) const admin2 = '918686883838@c.us';
const Dealer = '2348163376700@c.us';

const groupID1 = '120363132061932497@g.us';
const groupID2 = '120363181774801103@g.us';

console.log(`Made by IG/_IVXYZ`)

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('Scan the QR code to log in:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
    client.sendMessage(admin, 'Bot Client Initialized...');
});

let isBotEnabled = false;

let totalCollected = 0

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
                        console.log(tierReceived);
                        const tierCheck = tierReceived[1]
                        if (captchaReceived && captchaReceived[1]) {

                            if(tierCheck === 'S' || tierCheck == 5 || tierCheck == 6){
                            
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
                        } } else {
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
                  //console.log('made-by-IG/_IVXYZ)
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
