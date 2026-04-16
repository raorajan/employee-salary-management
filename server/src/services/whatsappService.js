const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

class WhatsAppService {
    constructor() {
        this.status = 'INITIALIZING'; // INITIALIZING, QR, READY, AUTH_FAILURE, DISCONNECTED
        this.qrImage = null;
        this.initialized = false;
        this.ready = false;
        this.authPath = './.wwebjs_auth';

        this.client = new Client({
            authStrategy: new LocalAuth({
                dataPath: this.authPath
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox', 
                    '--disable-dev-shm-usage',
                    '--disable-extensions',
                    '--no-first-run',
                    '--no-zygote',
                    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
                ]
            }
        });
    }


    initialize() {
        if (this.initialized) return;

        console.log('Initializing WhatsApp Service...');

        this.client.on('qr', async (qr) => {
            console.log('New WhatsApp QR code received');
            
            try {
                // Generate base64 image for browser display
                this.qrImage = await QRCode.toDataURL(qr);
                this.status = 'QR';
                
                console.log('WhatsApp QR code is ready! Please scan it in your browser dashboard.');
                // qrcodeTerminal.generate(qr, { small: true }); // Disabled terminal QR as requested
            } catch (err) {

                console.error('Failed to generate QR image:', err);
                this.status = 'ERROR';
            }
        });


        this.client.on('ready', () => {
            console.log('WhatsApp Client is Ready!');
            this.status = 'READY';
            this.ready = true;
            this.qrImage = null;
        });

        this.client.on('authenticated', () => {
            console.log('WhatsApp authenticated successfully');
            this.status = 'AUTHENTICATED';
        });

        this.client.on('auth_failure', (msg) => {
            console.error('WhatsApp Authentication failure:', msg);
            this.status = 'AUTH_FAILURE';
        });

        this.client.on('disconnected', (reason) => {
            console.log('WhatsApp was disconnected:', reason);
            this.status = 'DISCONNECTED';
            this.ready = false;
        });

        this.client.initialize().catch(err => {
            console.error('Failed to initialize WhatsApp client:', err.message);
            this.initialized = false;
            console.log('Retrying WhatsApp initialization in 5 seconds...');
            setTimeout(() => this.initialize(), 5000);
        });

        this.initialized = true;
    }


    async logout() {
        try {
            if (this.ready) {
                await this.client.logout();
            }
            this.status = 'DISCONNECTED';
            this.ready = false;
            this.initialized = false;
            
            // Re-initialize after some delay
            setTimeout(() => this.initialize(), 2000);
            return true;
        } catch (err) {
            console.error('Logout error:', err);
            return false;
        }
    }


    async sendSalaryAlert(data) {
        const { 
            employeeName, 
            mobile, 
            monthLabel, 
            netSalary, 
            regularHours, 
            overtimeHours, 
            regularPay, 
            overtimePay, 
            advances,
            paymentDate 
        } = data;

        if (!this.ready) {
            console.warn('WhatsApp service not ready. Skipping message for', employeeName);
            return false;
        }

        // Clean mobile number (assume India 91 if only 10 digits)
        let cleanNumber = mobile.replace(/\D/g, '');
        if (cleanNumber.length === 10) {
            cleanNumber = '91' + cleanNumber;
        }
        
        const chatId = cleanNumber + '@c.us';

        // Calculate working days (Assuming 8 hours = 1 day)
        const workingDays = (regularHours / 8).toFixed(1);

        const message = `नमस्ते *${employeeName}*,\n\nआपका *${monthLabel}* का वेतन विवरण नीचे दिया गया है:\n\n*विवरण (Payroll Details):*\n--------------------------------\n📅 कुल कार्य दिवस: *${workingDays} दिन*\n⏰ सामान्य घंटे: *${regularHours} h*\n🚀 ओवरटाइम घंटे: *${overtimeHours} h*\n\n💰 नियमित वेतन: *₹${regularPay.toLocaleString()}*\n➕ ओवरटाइम वेतन: *₹${overtimePay.toLocaleString()}*\n➖ पेशगी कटौती (Advance): *₹${advances.toLocaleString()}*\n--------------------------------\n💵 *कुल शुद्ध वेतन (Net Salary): ₹${netSalary.toLocaleString()}*\n\n✅ भुगतान की तिथि: ${paymentDate}\n\nसादर,\n*RanjitEnterprises*`;

        try {
            // 1. Send to Employee
            await this.client.sendMessage(chatId, message);
            console.log(`Detailed Hindi WhatsApp Alert sent to ${employeeName}`);

            // Add a small 2-second safety delay to avoid WhatsApp spam detection
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 2. Send Mirror to Admin (9773517745)
            const adminNumber = '919773517745@c.us';
            const adminMessage = `नमस्ते एडमिन,\n\n*RanjitEnterprises* के लिए *${employeeName}* का वेतन प्रोसेस हो गया है।\n\n*अपडेट विवरण:*\n- कुल कार्य दिवस: *${workingDays} दिन*\n- ओवरटाइम: *${overtimeHours} h*\n- शुद्ध वेतन (Net): *₹${netSalary.toLocaleString()}*\n- भुगतान तिथि: ${paymentDate}\n\nयह अपडेट आपकी जानकारी के लिए है।`;
            
            await this.client.sendMessage(adminNumber, adminMessage);
            console.log(`Admin Mirror Alert sent to 9773517745 for ${employeeName}`);

            return true;
        } catch (err) {
            console.error(`Error sending WhatsApp to ${employeeName}/Admin:`, err.message);
            return false;
        }

    }
}



// Single instance for the application
module.exports = new WhatsAppService();
