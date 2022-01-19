var connection;
const mongoose = require('mongoose');
const economyModel = require('./models/EconomyModel');

mongoose.set('useFindAndModify', false);

class mongoCurrency {

    /**
     * 
     * @param {string} url - A MongoDB connection string.
     */

    static async connect(url) {
        if (!url) throw new TypeError("You didn't provide a MongoDB connection string");

        connection = url;

        return mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    /**
     * 
     * @param {string} userId - A valid discord user ID.
     * @param {string} guildId - A valid discord guild ID.
     */

    static async findUser(userId, guildId) {
        if (!userId) throw new TypeError("You didn't provide a user ID.");
        if (!guildId) throw new TypeError("You didn't provide a guild ID.");

        let user = await economyModel.findOne({ userId: userId, guildId: guildId });
        if (!user) return false;

        return user;
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     * @param {string} guildId - A discord guild ID.
     * @param {number} amount - Amount of coins to give.
     */
    
    static async giveCoins(userId, guildId, amount) {
        if (!userId) throw new TypeError("You didn't provide a user ID.");
        if (!guildId) throw new TypeError("You didn't provide a guild ID.");
        if (!amount) throw new TypeError("You didn't provide an amount of coins.");
        if (isNaN(amount)) throw new TypeError("The amount must be a number.");
        if (amount < 0) throw new TypeError("New amount must not be under 0.");

        let user = await economyModel.findOne({ userId: userId, guildId: guildId });

        if (!user) {
            const newData = new economyModel({
                userId: userId,
                guildId: guildId,
                Wallet: parseInt(amount)
            });

            await newData.save()
            .catch(err => console.log(err));
            
            return amount;
        }

        user.Wallet += parseInt(amount);

        await user.save()
        .catch(err => console.log(err));

        return amount;
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     * @param {string} guildId - A discord guild ID.
     * @param {string} amount - Amount of coins to deduct.
     */

    static async deductCoins(userId, guildId, amount) { // deduct means "reduce", coins in particular.
        if (!userId) throw new TypeError("You didn't provide a user ID.");
        if (!guildId) throw new TypeError("You didn't provide a guild ID.");
        if (!amount) throw new TypeError("You didn't provide an amount of coins.");
        if (isNaN(amount)) throw new TypeError("The amount must be a number.");
        if (amount < 0) throw new TypeError("New amount must not be under 0.");

        let user = await economyModel.findOne({ userId: userId, guildId: guildId });

        if (!user) {
            const newData = new economyModel({
                userId: userId,
                guildId: guildId,
                Wallet: 50
            });

            await newData.save()
            .catch(err => console.log(err));
            
            return amount;
        }

        if (amount > user.Wallet) {
            user.Wallet -= user.Wallet;

            await user.save()
            .catch(err => console.log(err));

            return amount;
        }

        user.Wallet -= parseInt(amount);

        await user.save()
        .catch(err => console.log(err));

        return amount;
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     * @param {string} guildId - A discord guild ID.
     */

    static async createUser(userId, guildId) {
        if (!userId) throw new TypeError("Please provide a user ID.");
        if (!guildId) throw new TypeError("Please provide a guild ID.");

        let user = await economyModel.findOne({ userId: userId, guildId: guildId });
        if (user) return false;

        let newData = new economyModel({
            userId: userId,
            guildId: guildId,
            Wallet: 50
        });

        await newData.save()
        .catch(err => console.log(err));
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     * @param {string} guildId - A discord guild ID.
     */

    static async deleteUser(userId, guildId) {
        if (!userId) throw new TypeError("Please provide a user ID.");
        if (!guildId) throw new TypeError("Please provide a guild ID.");

        let user = await economyModel.findOne({ userId: userId, guildId: guildId });
        if (!user) return false;

        await economyModel.findOneAndRemove({ userId: userId, guildId: guildId });

        await user.save()
        .catch(err => console.log(err));
    }

    /**
     * 
     * @param {string} guildId - A discord guild ID.
     * @param {number} amount - The amount of users to show.
     */

    static async generateLeaderboard(guildId, amount) {
        if (!guildId) throw new TypeError("Please provide a guild ID.");
        if (!amount) throw new TypeError("Please provide the amount of users to show.");
        if (isNaN(amount)) throw new TypeError("Amount must be a number");

        let users = await economyModel.find({ guildId: guildId }).sort([['Wallet', 'descending']]).exec();

        return users.slice(0, amount);
    }
}

module.exports = mongoEconomy;
