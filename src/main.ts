import { REST, Routes, Client, GatewayIntentBits } from "discord.js";
import { BOT_TOKEN, CLIENT_ID, GUILD_ID, PORT } from "./config.js";
import { commands, addRoles } from "./commands.js";
import express from "express";

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const guild = client.guilds.cache.get(GUILD_ID);

client.on("ready", () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}`);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const member = guild?.members.cache.get(
    interaction.member?.user.id as string
  );
  if (interaction.commandName === "giverole") {
    await addRoles(member, guild, interaction);
  }
});

client.login(BOT_TOKEN);

const app = express();

// /assignRoles?userId=
app.get("/assignRoles", async (req, res) => {
  const userId = req.query.userId as string;
  if (!guild) {
    res.status(500).send("Guild not found");
    return;
  }
  if (userId) {
    try {
      const member = await guild.members.fetch(userId);
      await addRoles(member, guild);
      res.status(200).send({
        success: true,
        message: `Roles added for ${member.user.tag}`,
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: `Error adding roles: ${err}`,
      });
    }
  } else {
    res.status(404).send({
      success: false,
      message: `User of ID ${userId} not found`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
