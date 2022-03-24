import { SlashCommandBuilder } from '@discordjs/builders';

const command = new SlashCommandBuilder()
 .setName('suggest')
 .setDescription('give suggestions, features or report bugs/triage')
 .addStringOption(
  (option) => option
   .setName('title')
   .setDescription('give a short title for the issue')
   .setRequired(true),
 )
 .addStringOption(
  (option) => option
   .setName('details')
   .setDescription('give a long detailed suggestion/bug')
   .setRequired(true),
 );

export const commands = [{
 name: 'activecycle',
 description: 'get insights on active cycle',
// }, {
//  name: 'Superteam x Solana Foundation Grant',
//  description: 'get insights on Milestones of Instagrant, issues and progress',
}, command];
