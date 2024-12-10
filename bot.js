const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap('/usr/bin/yt-dlp');

const fs = require('fs');

const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');

const config = require("./config.json");

const client = new Client ({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}.`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("https://www.instagram.com/share")) {
        const fileName = message.id + ".mp4";
        let ytDlpEventEmitter = ytDlpWrap
            .exec([
                message.content,
                '-o',
                fileName,
                '--no-cache-dir'
            ])
            .on('error', (error) => {
                message.reply("Error...");
                console.error(error);
            })
            .on('close', () => {
                const file = new AttachmentBuilder(fileName, { name: 'output.mp4' });

                message.channel.send({
                    files: [file]
                }).then(() => {
                    message.delete();
                    fs.unlinkSync(fileName);
                });
            });
    }
});

client.login(config.token);
