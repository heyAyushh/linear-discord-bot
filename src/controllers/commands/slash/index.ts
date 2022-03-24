import { userMention } from '@discordjs/builders';
import {
 CacheType, CommandInteraction, CommandInteractionOption, MessageEmbed,
} from 'discord.js';
import linear from '../../../clients/linear';
import { DISCORD_OWNER_NAME } from '../../../config';
import { getActiveCycleEmbed, wantsToSeeIssues } from '../../embeds/active_cycle';
import { getActiveCycleDetails } from './cycle';

export const handleSlashCommands = async (
 interaction: CommandInteraction<CacheType>,
): Promise<void> => {
 if (interaction.commandName === 'activecycle') {
  await interaction.deferReply();
  const active_cycle_details = await getActiveCycleDetails();
  const active_cycle_embed = await getActiveCycleEmbed(active_cycle_details, true);

  await interaction.editReply({ embeds: [active_cycle_embed], components: [wantsToSeeIssues()] });
 } else if (interaction.commandName === 'suggest') {
  const user_name = `${interaction.user.username}#${interaction.user.discriminator}`;
  const title = interaction.options.get('title') as CommandInteractionOption<CacheType>;
  const details = interaction.options.get('details') as CommandInteractionOption<CacheType>;

  if (user_name !== DISCORD_OWNER_NAME) {
   const { guild } = interaction;
   const members = await guild?.members.fetch();
   const user = members?.find(u => `${u.user.username}#${u.user.discriminator}` === DISCORD_OWNER_NAME);

   if (!user) {
    throw new Error('Strange! DISCORD_OWNER not found in the guild');
   }

   const dm = await user.createDM(true);
   await dm.send({
    embeds: [new MessageEmbed()
     .setTitle('New Issue Submitted')
     .setDescription('')
     .addFields([{
      name: 'Title',
      value: title?.value as string,
     }, {
      name: 'Description',
      value: details?.value as string,
     }, {
      name: 'Reported By',
      value: user_name,
     }]),
    ],
   });

   await interaction.reply({
    content: `Only ${userMention(user.id)} is authorised to create issues. He will be approving the request soon!`,
   });

   return;
  }

  const teams = await linear.teams();
  const team = teams.nodes[0];

  const issue = await linear.issueCreate({
   title: title?.value as string,
   description: details.value as string,
   teamId: team.id,
  });

  await interaction.reply({
   content: `Issue ${(await issue.issue)?.identifier} created and added to Triage!`,
  });
 }
};
