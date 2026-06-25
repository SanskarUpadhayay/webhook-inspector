const express = require('express');
const mongoose = require('mongoose');
const { rateLimit } = require('express-rate-limit');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected')).catch(err => console.log('DB error: ', err));


const app = express();

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    handler: (req,res,next,options) => res.status(options.statusCode).send(options.message),
})

const Webhook = require('./models/Webhook');

app.use(express.json());

app.get('/health', (req,res) => {
    res.json({ status: 'ok'});
});

app.post('/webhook/:source', limiter ,async (req,res) => {
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

app.get('/webhooks', async (req,res) => {
    try{
        let { currentPage =1 ,currentLimit =2 } = req.query;
        currentPage = parseInt(currentPage);
        currentLimit = parseInt(currentLimit);
        const offset = (currentPage-1)*currentLimit;
        const totalCount = await Webhook.countDocuments();
        const webhooks = await Webhook.find().sort({receivedAt: -1}).skip(offset).limit(currentLimit);
        res.json(
            {
               "data":webhooks,
               page: currentPage,
               limit: currentLimit,
               total: totalCount
        }
        );
    }
    catch(err){
        res.status(500).json({error: 'Failed to fetch webhooks'});
    }
})

app.get('/webhooks/:source', async (req,res) => {
    try{
        const source_params = req.params.source;
        const webhooks = await Webhook.find({'source': source_params}).sort({receivedAt: -1});
        res.json(webhooks);
    }   
    catch(err){
        res.status(500).json({error: 'Failed to fetch webhooks for source'});
    }
})

app.delete('/webhooks/:id', async (req,res) => {
    try{
        const webhook_id = req.params.id;
        const is_valid_id = mongoose.isValidObjectId(webhook_id);
        if(!is_valid_id){
            res.status(400).json({message: 'Id is not valid'});
            return;
        }
        const result = await Webhook.findByIdAndDelete(webhook_id);
        if(result){
            res.json({message: 'Webhook deleted successfully'});
        }
        else{
            res.status(404).json({ message: 'Webhook not found with ID'});
        }
    }
    catch(err){
        res.status(500).json({error: 'Failed to delete webhook'});
    }
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});