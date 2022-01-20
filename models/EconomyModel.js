const mongoose = require('mongoose');

const EconomySchema = new mongoose.Schema({
    guildId: String,
    userId: String,
    Wallet: Number
});

module.exports = mongoose.model('economy', EconomySchema);