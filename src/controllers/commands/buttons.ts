import { ButtonInteraction, CacheType } from 'discord.js';
import { getActiveCycleEmbed } from '../embeds/active_cycle';
import { getIssueEmbed, wantsToSeeMoreIssues } from '../embeds/issues';
import { getActiveCycleDetails } from './slash/cycle';
import { getActiveIssue } from './slash/issue';

export const handleButtonCommands = async (
 interaction: ButtonInteraction<CacheType>,
): Promise<void> => {
 if (interaction.customId === 'noIssues') {
  await interaction.deferUpdate();
  const active_cycle_details = await getActiveCycleDetails();
  const active_cycle_embed = await getActiveCycleEmbed(active_cycle_details, false);

  await interaction.editReply({ embeds: [active_cycle_embed], components: [] });
 } else if (interaction.customId === 'seeIssues') {
  await interaction.deferUpdate();
  const current_page = 1;
  const {
   issue_state, page, total, issue,
  } = await getActiveIssue(current_page);
  const issue_embed = await getIssueEmbed(issue_state, issue, page, total);

  await interaction.editReply({
   embeds: [issue_embed],
   components: [wantsToSeeMoreIssues(page, total)],
  });
 } else if (interaction.customId === 'active_cycle_btn') {
  await interaction.deferUpdate();
  const active_cycle_details = await getActiveCycleDetails();
  const active_cycle_embed = await getActiveCycleEmbed(active_cycle_details, false);

  await interaction.editReply({ embeds: [active_cycle_embed], components: [] });
 } else if (interaction.customId === 'nextIssue') {
  await interaction.deferUpdate();
  const pageField = interaction.message.embeds[0].fields?.pop()?.value;
  const current_page = pageField?.includes('Page:') ? Number(pageField.split(':')[1].split('/')[0]) : 0;
  const {
   issue_state, page, total, issue,
  } = await getActiveIssue(current_page + 1);
  const issue_embed = await getIssueEmbed(issue_state, issue, page, total);

  await interaction.editReply({
   embeds: [issue_embed],
   components: [wantsToSeeMoreIssues(page, total)],
  });
 } else if (interaction.customId === 'prevIssue') {
  await interaction.deferUpdate();
  const pageField = interaction.message.embeds[0].fields?.pop()?.value;
  const current_page = pageField?.includes('Page:') ? Number(pageField.split(':')[1].split('/')[0]) : 0;
  const {
   issue_state, page, total, issue,
  } = await getActiveIssue(current_page - 1);
  const issue_embed = await getIssueEmbed(issue_state, issue, page, total);

  await interaction.editReply({
   embeds: [issue_embed],
   components: [wantsToSeeMoreIssues(page, total)],
  });
 }
};
