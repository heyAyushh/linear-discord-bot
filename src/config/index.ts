const CLIENT_ID = process.env.DISCORD_CLIENT_ID as string;
const GUILD_ID = process.env.DISCORD_GUILD_ID as string;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID as string;
const DISCORD_TOKEN = process.env.DISCORD_CLIENT_TOKEN as string;
const LINEAR_KEY = process.env.LINEAR_API_KEY as string;
const PORT = process.env.PORT || 3000;
const DISCORD_OWNER_NAME = process.env.DISCORD_OWNER_NAME || '' as string;

export {
 CLIENT_ID, GUILD_ID, CHANNEL_ID, DISCORD_TOKEN,
 PORT, LINEAR_KEY, DISCORD_OWNER_NAME,
};
