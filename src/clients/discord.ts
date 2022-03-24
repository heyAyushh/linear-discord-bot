import { Client, Intents } from 'discord.js';
import { DISCORD_TOKEN } from '../config';

const discord = new Client({
 intents: [
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MEMBERS,
 ],
});
discord.login(DISCORD_TOKEN);
export default discord;
