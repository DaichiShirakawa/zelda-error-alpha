import {ZeldaErrorNotificationIntegration} from '../types/zelda-error-property-types';
import {ZeldaIssue} from '../types/zelda-error-types';

/**
 * Sample implementation for integration to Slack.
 * @see https://api.slack.com/incoming-webhooks
 *
 * @param hooksSlackApiUrl
 * (ex) https://hooks.slack.com/services/XXXX/XXXX/XXXXXXXX
 */
export const ZeldaErrorNotificationSlack = (
  hooksSlackApiUrl: string,
): ZeldaErrorNotificationIntegration => ({
  onCreateIssue: async (issue: ZeldaIssue): Promise<void> => {
    const message
      = `${issue.type === 'error' ? ':japanese_ogre: *[不具合' : ':innocent: *[改善点'}`
      + ` at ${issue.situation}]* ${issue.title}`
      + (issue.props.senderAccount ? ` (by ${issue.props.senderAccount}, ${issue.props.build})` : `(by ${issue.props.build})`)
      + '\n'
      + `*Issue:* ${issue.ticket.url}`;

    await fetch(hooksSlackApiUrl, {
      method: 'POST',
      headers: {Accept: 'application/json'},
      body: JSON.stringify({text: message}),
    });
  },

  onVoteIssue: async (issue: ZeldaIssue): Promise<void> => {
    const message
      = `*VOTED [${issue.situation}]* ${issue.title}`
      + (issue.props.senderAccount ? ` (by ${issue.props.senderAccount}, ${issue.props.build})` : `(by ${issue.props.build})`)
      + '\n'
      + `*Issue:* ${issue.ticket.url}`;

    await fetch(hooksSlackApiUrl, {
      method: 'POST',
      headers: {Accept: 'application/json'},
      body: JSON.stringify({text: message}),
    });
  },
});
