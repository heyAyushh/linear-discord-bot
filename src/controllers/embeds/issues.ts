import { Issue, WorkflowState } from '@linear/sdk';
import {
 EmbedFieldData, HexColorString,
 MessageActionRow, MessageButton, MessageEmbed,
} from 'discord.js';

export const getIssueEmbed = async (
 state: WorkflowState, issue: Issue,
 page: number, total: number,
): Promise<MessageEmbed> => {
 let fields = [] as EmbedFieldData[];

 if (state.type === 'unstarted') {
  fields.push({ name: '\u200B', value: '\u200B', inline: false });
 }
 if (state.type === 'started') {
  fields.push({ name: 'Branch Name', value: issue.branchName, inline: false });
  fields.push({ name: 'Started at', value: issue.startedAt?.toDateString() || 'unknown', inline: true });
  fields.push({ name: 'Due at', value: issue.dueDate?.toDateString() || 'unknown', inline: true });
  fields.push({ name: 'Estimated Points', value: String(issue.estimate) || 'unknown', inline: false });
 }

 const parent_issue = await issue.parent;

 if (parent_issue) {
  fields.push({
   name: 'Parent Issue',
   value: `${parent_issue.identifier}: ${parent_issue.title}` || 'unknown',
   inline: false,
  });
 }

 fields.push({ name: 'Priority', value: issue.priorityLabel, inline: true });
 fields.push({ name: 'Release Candidate', value: (await issue?.project)?.name || 'unknown', inline: true });
 fields.push({ name: 'Status', value: state?.name || 'unknown', inline: false });

 const embed_json = new MessageEmbed()
  .setColor(state?.color as HexColorString)
  .setTitle(`${issue.identifier}: ${issue.title}`)
  .setURL(issue.url)
  //  .setAuthor({ name: 'Some name', iconURL: 'https://raw.githubusercontent.com/heyAyushh/vscode-anchor/main/assets/marketplace-logo.png', url: 'https://discord.js.org' })
  .setDescription(issue?.description || '')
  //  .setThumbnail('https://raw.githubusercontent.com/heyAyushh/vscode-anchor/main/assets/marketplace-logo.png')
  .addFields(fields)
  .addField('\u200B', `Page: ${page - 1}/${total}`, true)
  //  .setImage('https://raw.githubusercontent.com/heyAyushh/vscode-anchor/main/assets/marketplace-logo.png')
  .setTimestamp()
  .setFooter({ text: 'vscode-anchor Linear updates', iconURL: 'https://raw.githubusercontent.com/heyAyushh/vscode-anchor/main/assets/marketplace-logo.png' })
  .toJSON();
 if (embed_json.description === '') {
  delete embed_json.description;
 }
 return new MessageEmbed(embed_json);
};

export const wantsToSeeMoreIssues = (
 page: number, total: number,
): MessageActionRow => new MessageActionRow()
 .addComponents(
  new MessageButton()
   .setCustomId('active_cycle_btn')
   .setLabel('Active Cycle')
   .setStyle('SECONDARY'),
  new MessageButton()
   .setCustomId('prevIssue')
   .setLabel('Previous')
   .setStyle('SECONDARY')
   .setDisabled(page === 0),
  new MessageButton()
   .setCustomId('nextIssue')
   .setLabel('Next')
   .setStyle('PRIMARY')
   .setDisabled(page - 1 === total),
 );
