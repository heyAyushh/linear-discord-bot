import {
 EmbedFieldData,
 MessageActionRow, MessageButton, MessageEmbed,
} from 'discord.js';
import { ActiveCycleDetails } from '../commands/slash/cycle';

export const getActiveCycleEmbed = async (
 { ...details } : ActiveCycleDetails | null,
 buttons: boolean,
): Promise<MessageEmbed> => {
 let fields = [
  { name: 'Starts at', value: details.cycle_starts_at, inline: true },
  { name: 'Ends at', value: details.cycle_ends_at, inline: true },
  { name: 'Progress', value: details.progress, inline: true },
  { name: '\u200B', value: '\u200B' },
  { name: 'Total Issues in this Cycle', value: details.total_issues },
  { name: 'In-Progress', value: String(details.inprogress_issues.nodes.length), inline: true },
  { name: 'Completed', value: String(details.completed_issues.nodes.length), inline: true },
  { name: 'Pending', value: String(details.pending_issues.nodes.length), inline: true },
 ]as EmbedFieldData[];

 if (buttons) {
  fields.push({ name: '\u200B', value: 'Do you want to see all Issues? \n React to the button below.' });
 } else {
  fields.push({ name: '\u200B', value: '\u200B' });
 }
 return details
  ? new MessageEmbed()
   .setColor('#0099ff')
   .setTitle(`Active Cycle ${details.cycle_number} Report`)
  //  .setURL('https://yahoo.com')
   //  .setAuthor({ name: 'Some name', iconURL: 'https://raw.githubusercontent.com/heyAyushh/vscode-anchor/main/assets/marketplace-logo.png', url: 'https://discord.js.org' })
   .setDescription(`${details.pending_week_days} weekdays left in this cycle`)
   //  .setThumbnail('https://raw.githubusercontent.com/heyAyushh/vscode-anchor/main/assets/marketplace-logo.png')
   .addFields(fields)
   //  .setImage('https://raw.githubusercontent.com/heyAyushh/vscode-anchor/main/assets/marketplace-logo.png')
   .setTimestamp()
   .setFooter({ text: 'vscode-anchor Linear updates', iconURL: 'https://raw.githubusercontent.com/heyAyushh/vscode-anchor/main/assets/marketplace-logo.png' })
  : new MessageEmbed()
   .setTitle('Its the cooldown 🏝 period!')
   .setDescription('We will be starting next week!')
   .addField('\u200B', '\u200B');
};

export const wantsToSeeIssues = (): MessageActionRow => new MessageActionRow()
 .addComponents(
  new MessageButton()
   .setCustomId('seeIssues')
   .setLabel('Yes')
   .setStyle('PRIMARY'),
  new MessageButton()
   .setCustomId('noIssues')
   .setLabel('No')
   .setStyle('SECONDARY'),
 );
