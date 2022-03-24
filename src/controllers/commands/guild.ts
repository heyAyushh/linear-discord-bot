import { Guild, NonThreadGuildBasedChannel } from 'discord.js';
import discord from '../../clients/discord';
import { CHANNEL_ID, GUILD_ID } from '../../config';

export const getGuild = async (): Promise<Guild> => (discord).guilds.fetch(GUILD_ID);

export const getChannel = async (): Promise<NonThreadGuildBasedChannel> => {
 const guild = await getGuild();
 const channel = await guild.channels.fetch(CHANNEL_ID);
 if (!channel) {
  throw new Error('Channel not found');
 }
 if (channel?.type !== 'GUILD_TEXT') {
  throw new Error('not a text channel!');
 }
 return channel;
};
