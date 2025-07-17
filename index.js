require("./keep_alive.js");

const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Replace with your values
const TOKEN = "MTM5NTExMjQ1MTg4MzY2MzUzMQ.GHZGaM.3xTcjgtFhtb1l5HvVIshI3MvyLOrhfO3tw8j6I";
const CHANNEL_ID = "1395114303501373592";

// Function to check if today is every 3rd day since July 17, 2025
function isThirdDayFromStart() {
  const start = new Date("2025-07-17");
  const now = new Date();

  // Timezone adjustment: UTC+1
  const utcNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const diffTime = utcNow - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays % 3 === 0;
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Run every day at 20:40 UTC+1
  cron.schedule("40 19 * * *", () => {  // 19 UTC = 20 UTC+1
    if (isThirdDayFromStart()) {
      const channel = client.channels.cache.get(CHANNEL_ID);
      if (channel) {
        channel.send("<@&1395170767238467684> Championship starts in 20 minutes!");
      }
    }
  });
});
  // 5 minutes before (20:55 UTC+1)
  cron.schedule("55 19 * * *", () => {
    if (isThirdDayFromStart()) {
      const channel = client.channels.cache.get(CHANNEL_ID);
      if (channel) {
        channel.send("<@&1395170767238467684> Championship starts in 5 minutes! Get ready!");
      }
    }
  });

  // Start time (21:00 UTC+1)
  cron.schedule("0 20 * * *", () => {
    if (isThirdDayFromStart()) {
      const channel = client.channels.cache.get(CHANNEL_ID);
      if (channel) {
        channel.send("<@&1395170767238467684> The Championship has begun! Good luck!");
      }
    }
  });

// Slash Command Setup
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

// Replace with your actual IDs
const CLIENT_ID = "1395112451883663531";
const GUILD_ID = "1322896510630891520";
const ROLE_ID = "1395170767238467684";

const slashCommands = [
  new SlashCommandBuilder()
    .setName("giverole")
    .setDescription("Receive a role to be pinged for related anoucements."),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

// Register the slash command
(async () => {
  try {
    console.log("Registering slash command...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: slashCommands,
    });
    console.log("Slash command registered.");
  } catch (error) {
    console.error("Error registering slash command:", error);
  }
})();

// Handle interaction (slash command)
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "giverole") {
    const member = interaction.member; // command user as GuildMember
    const role = interaction.guild.roles.cache.get(ROLE_ID);

    if (!role) {
      return interaction.reply({ content: "❌ Role not found.", ephemeral: true });
    }

    try {
      await member.roles.add(role);
      await interaction.reply(`✅ You have been given the **${role.name}** role. Congratulations brave warrior!`);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Couldn't give you the role. Check with the higher ups.",
        ephemeral: true,
      });
    }
  }
});
client.login(TOKEN);
