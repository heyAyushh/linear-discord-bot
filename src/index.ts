import 'dotenv/config';
import express, { Request, Response } from 'express';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import logger from './utils/logger';
import { validate } from './utils/validate';
import { commands } from './controllers';
import {
 CLIENT_ID, GUILD_ID, PORT, DISCORD_TOKEN,
} from './config';
import discord from './clients/discord';
import { } from './controllers/embeds/webooks/events';
import 'source-map-support/register';
import { handleButtonCommands } from './controllers/commands/buttons';
import { handleSlashCommands } from './controllers/commands/slash';
import { getWebhookEventEmbed } from './controllers/embeds/webhook';
import { getChannel } from './controllers/commands/guild';

const app = express();

app.use(express.json());
app.use(validate);

app.post('/recieve', async (req: Request, res: Response) => {
 try {
  const payload = req.body;
  if (!Object.keys(payload).length) {
   return res.status(400).send('No payload');
  }

  const embed = await getWebhookEventEmbed(payload);
  if (embed) {
   const channel = await getChannel();
   if (channel.isText()) {
    channel.send({ embeds: [embed] });
   } else {
    logger.error('Unable to send in Channel');
   }
  }

  logger.info(`Message${embed ? 'sent' : 'not sent'}`);
  logger.info(payload);

  return res.sendStatus(200);
 } catch (err) {
  logger.error(err);
  return res.status(500).send(err.message);
 }
});

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

app.listen(PORT, async () => {
 await rest.put(
  Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
  { body: commands },
 );
 logger.info('Successfully reloaded application (/) commands.');
 logger.info(`Listening at port: ${PORT}`);
});

discord.on('interactionCreate', async interaction => {
 try {
  if (interaction.isCommand()) {
   await handleSlashCommands(interaction);
  }

  if (interaction.isButton()) {
   await handleButtonCommands(interaction);
  }
 } catch (err) {
  logger.error(err);
 }
});
