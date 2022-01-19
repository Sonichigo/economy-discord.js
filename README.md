[![NPM](https://nodei.co/npm/mongo-discord.js.png)](https://www.npmjs.com/package/mongo-discord.js/)

# mongo-discord.js
A npm package for making economy bots.

# Installation
```npm i mongo-discord.js```

# Starting
Start off by connecting mongo-discord.js to MongoDB.
```js
const mongoEconomy = require('mongo-discord.js');

mongoEconomy.connect('some connection string');
```

# All Methods
##### createUser(userId, guildId)
Adds a user to the database.

##### deleteUser(userId, guildId)
Deletes a user from the database.

##### giveCoins(userId, guildId, amount)
Gives coins to a user.

##### deductCoins(userId, guildId, amount)
Deducts coins from a user.

##### findUser(userId, guildId)
Finds the user in the database.

##### generateLeaderboard(guildId, amount)
Generates a leaderboard.

# Command Examples

##### Wallet Command
```js
    const mongoEconomy = require('mongo-discord.js');
    const { MessageEmbed } = require('discord.js');

    const member = message.mentions.members.first() || message.member;

    const user = await mongoEconomy.findUser(member.id, message.guild.id); // Get the user from the database.

    const embed = new MessageEmbed()
    .setTitle(`${member.user.username}'s Balance`)
    .setDescription(`Wallet: ${user.Wallet}`);

    message.channel.send(embed);
```

##### Coin Command
```js
    const mongoEconomy = require('mongo-discord.js');

    const randomCoins = Math.floor(Math.random() * 99) + 1; // Random amount of coins.
    
    await mongoEconomy.giveCoins(message.member.id, message.guild.id, randomCoins);
```

##### Leaderboard Command
```js
    const mongoEconomy = require('mongo-discord.js');
    const { MessageEmbed } = require('discord.js');
    
    const leaderboard = await mongoEconomy.generateLeaderboard(message.guild.id, 10);
    
    if (leaderboard.length < 1) return message.channel.send("Nobody's on the leaderboard.");
    
    const mappedLeaderboard = leaderboard.map(i => `${client.users.cache.get(i.userId).tag ? client.users.cache.get(i.userId).tag : "Nobody"} - ${i.Wallet}`);
    
    const embed = new MessageEmbed()
    .setTitle(`${message.guild.name}\'s Leaderboard`)
    .setDescription(`${mappedLeaderboard.join('\n')}`);
    
    message.channel.send(embed);
```
