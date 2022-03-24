export type IssueType = 'unstarted' | 'started' | 'completed';

export type LinearWebhookPayload = {
  type: 'Issue',
  action: 'create' | 'update',
  createdAt: Date,
  data: {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    number: number,
    title: 'test',
    priority: 0,
    boardOrder: 0,
    sortOrder: -45629.19,
    teamId: string,
    previousIdentifiers: [],
    creatorId: string,
    stateId: string,
    priorityLabel: 'No priority' | 'Urgent' | 'High' | 'Medium' | 'Low',
    subscriberIds: string[],
    labelIds: string[],
    state: {
      id: string,
      name: 'Todo',
      color: '#e2e2e2',
      type: 'unstarted'
    },
    team: {
      'id': 'ea534989-14aa-454a-aab1-b659e97a9855',
      'name': 'vscode-anchor',
      'key': 'VCA'
    }
  },
  url: string,
  'organizationId': string
} | {
  type: 'Comment',
  action: 'create' | 'update',
  createdAt: Date,
  data: {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    body: string,
    issueId: string,
    userId: string,
    issue: {
      id: string,
      title: 'test'
    },
    user: {
      id: string,
      name: string
    }
  },
  url: string,
  organizationId: string,
}
