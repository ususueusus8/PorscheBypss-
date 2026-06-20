const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
] });
const axios = require('axios'); // ต้องใช้ตัวนี้เพื่อไปดึงคีย์มาจากระบบ Bypass

client.once('clientReady', () => {
    console.log('บอทดักจับลิงก์คีย์ Delta พร้อมทำงาน 24 ชม. ครับ!');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return; // ถ้าบอทส่งลิงก์กันเอง ให้ข้ามไป ไม่ทำงาน

    // 🕵️ ตรวจสอบว่าในข้อความมีลิงก์ของ Delta หรือไม่ (แก้หรือเพิ่มคำในเครื่องหมาย / / ได้ครับ)
    if (message.content.includes('gateway.platoboost.com') || message.content.includes('linkvertise.com')) {

        // ⏳ ส่งข้อความบอกก่อนว่ากำลังแกะคีย์ให้
        const loadingMessage = await message.reply('⏳ กำลังดึงคีย์ Delta ให้ครับ กรุณารอ สักครู่...');

        try {
            const userLink = message.content; // ดึงลิงก์ที่คนส่งมา

            // 🌐 ส่งลิงก์ไปให้ API ตัว Bypass แกะคีย์ (ใช้ API ฟรียอดนิยม)
            const response = await axios.get(`https://api.fluxteam.net/bypass/fluxus?url=${encodeURIComponent(userLink)}`);
            const keyResult = response.data.key || response.data.bypassed || "ไม่สามารถดึงคีย์ได้ หรือลิงก์หมดอายุครับ";

            // 🖼️ สร้างการ์ดข้อความ (Embed) สวย ๆ โชว์รูปคนส่งข้าง ๆ คีย์
            const embed = new EmbedBuilder()
                .setColor('#00ffcc')
                .setTitle('🔑 ปลดล็อกคีย์ Delta สำเร็จ!')
                .setDescription(`**คีย์ของคุณคือ:** \`${keyResult}\` \n*(คีย์นี้ดึงมาจากลิงก์ที่ส่งมาครับ)*`)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true })) // บรรทัดนี้จะดึงรูปโปรไฟล์ของคนส่งลิงก์มาแปะไว้ข้าง ๆ
                .setFooter({ text: `ส่งโดย: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            // ลบข้อความที่บอกว่ากำลังรอออก แล้วส่งคีย์ที่มีรูปภาพคนส่งเข้าไปแทน
            await loadingMessage.delete();
            await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await loadingMessage.edit('❌ เกิดข้อความผิดพลาด ไม่สามารถดึงคีย์จากลิงก์นี้ได้ครับ');
        }
    }
});

// ระบบจะดึงรหัส TOKEN จากช่อง Environment Variables ที่เราใส่ไว้ใน Render มาใช้
client.login(process.env.TOKEN);
                
