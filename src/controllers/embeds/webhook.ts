import { EmbedFieldData, HexColorString, MessageEmbed } from 'discord.js';
import linear from '../../clients/linear';
import { capitalize } from '../../utils/helpers';
import { LinearWebhookPayload } from './webooks/events';

export const getWebhookEventEmbed = async (
 payload: LinearWebhookPayload,
): Promise<MessageEmbed| null> => {
 let fields = [] as EmbedFieldData[];
 const {
  url, type, data, action,
 } = payload;
 let title;
 let description;

 if (type === 'Issue') {
  const issue = await linear.issue(data.id);
  title = `${capitalize(type)}: ${issue.identifier} ${capitalize(action)}`;
  if (issue?.description) {
   description = issue?.description;
  }
  const user = await linear.user(data.creatorId);
  fields?.push({ name: `${capitalize(action)}d By`, value: user.name });

  if (action === 'update') {
   fields.push({ name: 'Priority', value: data.priorityLabel });
   fields.push({ name: 'Status', value: data.state.name });

   fields.push({ name: `${capitalize(action)} By`, value: user.name });
  }

  const embed_json = new MessageEmbed()
   .setColor(data.state?.color as HexColorString)
   .setTitle(title)
   .setDescription(description || '')
   .setURL(url)
   .setDescription(issue?.description || '')
   .addFields(fields)
   .setTimestamp()
   .setFooter({
    text: 'vscode-anchor Linear updates',
    iconURL: 'https://raw.githubusercontent.com/heyAyushh/vscode-anchor/main/assets/marketplace-logo.png',
   })
   .toJSON();

  if (embed_json.description === '') {
   delete embed_json.description;
  }

  return new MessageEmbed(embed_json);
 } if (type === 'Comment') {
  const issue = await linear.issue(data.issueId);
  title = `${capitalize(type)}: ${issue.identifier} ${capitalize(action)}`;
  if (issue?.description) {
   description = data.body;
  }
  const user = await linear.user(data.userId);
  fields?.push({ name: `${capitalize(action)} By`, value: user.name });

  const embed_json = new MessageEmbed()
   .setColor('#E91E63' as HexColorString)
   .setTitle(title)
   .setDescription(description || '')
   .setURL(url)
   .setDescription(issue?.description || '')
   .addFields(fields)
   .setTimestamp()
   .setFooter({
    text: 'vscode-anchor Linear updates',
    iconURL: 'https://raw.githubusercontent.com/heyAyushh/vscode-anchor/main/assets/marketplace-logo.png',
   })
   .toJSON();

  if (embed_json.description === '') {
   delete embed_json.description;
  }

  return new MessageEmbed(embed_json);
 }
 return null;
};
