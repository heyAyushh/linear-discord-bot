import { Issue, WorkflowState } from '@linear/sdk';
import { ButtonInteraction, CacheType } from 'discord.js';
import { getActiveCycleDetails } from './cycle';

export const getActiveIssue = async (page: number): Promise<{
  page: number,
  total: number,
  issue: Issue,
  issue_state: WorkflowState
}> => {
 const active_cycle_details = await getActiveCycleDetails();
 const total = active_cycle_details?.all_active_cycle_issues.nodes.length ?? 0;
 const issue = active_cycle_details?.all_active_cycle_issues.nodes[page - 1];
 if (!issue) {
  throw new Error('retrieving issue failed!');
 }
 const issue_state = await issue.state;
 if (!issue_state) {
  throw new Error('retrieving issue_state failed!');
 }
 return {
  page: page + 1,
  total,
  issue,
  issue_state,
 };
};

export const getIssuePage = (
 interaction: ButtonInteraction<CacheType>,
): number => {
 const pageField = interaction.message.embeds[0].fields?.pop()?.value;
 const page = pageField?.includes('page') ? Number(pageField.split(':')[1].split('/')[0]) : 0;
 return page;
};
