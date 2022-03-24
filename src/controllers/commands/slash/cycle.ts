import { Cycle, IssueConnection } from '@linear/sdk';
import moment from 'moment';
import cache from '../../../clients/cache';
import linear from '../../../clients/linear';
import logger from '../../../utils/logger';

export interface ActiveCycleDetails {
  cycle_number: number,
  pending_week_days: number,
  cycle_starts_at: string,
  cycle_ends_at: string,
  progress: string,
  total_issues: string,
  all_active_cycle_issues: IssueConnection,

  inprogress_issues: IssueConnection,
  completed_issues: IssueConnection,
  pending_issues: IssueConnection,

  active_cycle: Cycle,
}

export const getActiveCycleDetails = async (): Promise<ActiveCycleDetails| null> => {
 try {
  const cached_details = cache.get<ActiveCycleDetails|null>('active_cycle_details');
  if (!cached_details) {
   const cycles = await (await linear.cycles()).nodes;
   const now = moment();

   const active_cycle = cycles.find(cy => {
    let startDate = moment(cy.startsAt);
    let endDate = moment(cy.endsAt);
    const isBetween = now.isBetween(startDate, endDate);

    return !cy.completedAt && isBetween;
   });

   if (!active_cycle) {
    logger.info('It\'s a Cooldown week!');
    return null;
   }

   const endDate = moment(active_cycle.endsAt);
   const pending_days = endDate.diff(now, 'days');
   const pending_week_days = pending_days - Math.floor((pending_days / 7) * 2);

   const cycle_starts_at = active_cycle?.startsAt.toDateString();
   const cycle_ends_at = active_cycle.endsAt.toDateString();

   const all_active_cycle_issues = await linear.issues({
    filter: { cycle: { id: { eq: active_cycle?.id } } },
   });

   const [inprogress_issues, completed_issues, pending_issues] = await Promise.all([
    linear.issues({
     filter: {
      cycle: { id: { eq: active_cycle?.id } },
      state: { type: { eq: 'started' } },
     },
    }),
    linear.issues({
     filter: {
      cycle: { id: { eq: active_cycle?.id } },
      state: { type: { eq: 'completed' } },
     },
    }),
    linear.issues({
     filter: {
      cycle: { id: { eq: active_cycle?.id } },
      state: { type: { eq: 'unstarted' } },
     },
    }),
   ]);

   const active_cycle_details = {
    cycle_number: active_cycle?.number,
    pending_week_days,
    cycle_starts_at,
    cycle_ends_at,
    progress: `${String(active_cycle?.progress * 100)}%`,

    total_issues: `${String(all_active_cycle_issues.nodes.length)}`,
    inprogress_issues,
    completed_issues,
    pending_issues,

    active_cycle,
    all_active_cycle_issues,
   };
   cache.set('active_cycle_details', active_cycle_details, 60 * 60 * 4);
   return active_cycle_details;
  }
  return cached_details;
 } catch (error) {
  logger.error(error);
  return error;
 }
};
