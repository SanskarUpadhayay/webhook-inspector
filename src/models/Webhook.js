const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
    source: { type: String, required: true},
    payload: { type: Object, required: true},
    receivedAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Webhook', webhookSchema);