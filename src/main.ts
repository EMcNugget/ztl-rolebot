import { REST, Routes, Client, GatewayIntentBits } from "discord.js";
import { BOT_TOKEN, CLIENT_ID, GUILD_ID } from "./config.js";
import { commands, addRoles } from "./commands.js";

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

client.on("ready", () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}`);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "giverole") {
    await addRoles(interaction);
  }
});

client.login(BOT_TOKEN);
