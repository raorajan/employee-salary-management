const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');
const { authenticate } = require('../middleware/auth');

// Get current connection status
router.get('/status', (req, res) => {
    res.json({
        status: whatsappService.status,
        ready: whatsappService.ready
    });
});

// Get QR code image
router.get('/qr', (req, res) => {
    if (whatsappService.qrImage) {
        res.json({ qr: whatsappService.qrImage });
    } else {
        res.status(404).json({ error: 'QR code not available' });
    }
});

// Logout / Disconnect
router.post('/logout', async (req, res) => {
    const success = await whatsappService.logout();
    if (success) {
        res.json({ message: 'Logged out successfully' });
    } else {
        res.status(500).json({ error: 'Failed to logout' });
    }
});


module.exports = router;
