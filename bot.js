const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
] });
const axios = require('axios');

client.once('ready', () => {
    console.log('บอทดักจับลิงก์คีย์ Delta พร้อมทำงาน 24 ชม. ครับ!');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.includes('gateway.platoboost.com') || message.content.includes('linkvertise.com')) {
        const loadingMessage = await message.reply('⏳ กำลังดึงคีย์ Delta ให้ครับ กรุณารอสักครู่...');

        try {
            const userLink = message.content;
            const response = await axios.get(`https://api.fluxteam.net/bypass/fluxus?url=${encodeURIComponent(userLink)}`);
            const keyResult = response.data.key || response.data.bypassed || "ไม่สามารถดึงคีย์ได้";

            const embed = new EmbedBuilder()
                .setColor('#00ffcc')
                .setTitle('🔑 ปลดล็อกคีย์ Delta สำเร็จ!')
                .setDescription(`**คีย์ของคุณคือ:** \`${keyResult}\` \n*(คีย์นี้ดึงมาจากลิงก์ที่ส่งมาครับ)*`)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `ส่งโดย: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            await loadingMessage.delete();
            await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await loadingMessage.edit('❌ เกิดข้อความผิดพลาด ไม่สามารถดึงคีย์จากลิงก์นี้ได้ครับ');
        }
    }
});

client.login(process.env.TOKEN);
                
