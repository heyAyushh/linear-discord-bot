import { Issue } from '@linear/sdk';
import linear from '../../clients/linear';

export const getIssueById = async (
 issue_id: Issue['id'],
): Promise<Issue> => {
 const issue = await linear.issue(issue_id);
 return issue;
};
