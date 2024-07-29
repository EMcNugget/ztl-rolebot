import {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  GuildMember,
} from "discord.js";
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

client.login(BOT_TOKEN);

client.on("ready", () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}`);
  }
});

client.on("interactionCreate", async (interaction) => {
  const guild = await client.guilds.fetch(GUILD_ID);

  if (!interaction.isChatInputCommand()) return;
  const member = guild?.members.cache.get(
    interaction.member?.user.id as string
  ) as GuildMember;
  if (interaction.commandName === "giverole") {
    await addRoles(member, guild, interaction);
  }
});

const app = express();

// /assignRoles?userId=
app.get("/assignRoles", async (req, res) => {
  const guild = await client.guilds.fetch(GUILD_ID);
  const userId = req.query.userId as string;
  if (!guild) {
    res.status(500).send("Guild not found");
    return;
  }
  if (userId) {
    const member = await guild.members.fetch(userId);
    if (!member) {
      res.status(404).send({
        success: false,
        status: 404,
        message: `User of ID ${userId} not found`,
      });
      return;
    }
    await addRoles(member, guild)
      .then((embed) => {
        res.status(embed?.status || 500).send({
          success: embed?.success,
          status: embed?.status,
          message: embed?.message,
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          status: 500,
          message: `Error adding roles: ${err}`,
        });
      });
  } else {
    res.status(400).send({
      success: false,
      status: 400,
      message: `Missing query parameter 'userId'`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
