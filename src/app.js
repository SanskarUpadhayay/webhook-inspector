const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected')).catch(err => console.log('DB error: ', err));


const app = express();

const Webhook = require('./models/Webhook');

app.use(express.json());

app.get('/health', (req,res) => {
    res.json({ status: 'ok'});
});

app.post('/webhook/:source', async (req,res) => {
    try{
        const webhook = new Webhook({
            source: req.params.source,
            payload: req.body
        });
        await webhook.save();
        res.status(201).json({ message: 'Webhook receieved', id: webhook._id});
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to save webhook'});
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});