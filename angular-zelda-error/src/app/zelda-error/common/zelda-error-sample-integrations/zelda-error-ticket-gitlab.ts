import {ZeldaErrorTicketIntegration} from '../types/zelda-error-property-types';
import {ZeldaIssue, ZeldaIssueTicket} from '../types/zelda-error-types';

/**
 * Sample implementation for integration to GitLab issues.
 * @see https://docs.gitlab.com/ee/api/issues.html
 *
 * @param projectId GitLab > Your Project > Settings > General > Project ID
 * @param privateToken GitLab > User Settings > Access Tokens > personal access token with enable "api"
 */
export const ZeldaErrorTicketGitLab = (
  projectId: string,
  privateToken: string,
): ZeldaErrorTicketIntegration => ({
  onCreateIssue: async (issue: ZeldaIssue): Promise<ZeldaIssueTicket> => {
    const title = `[ZELDA:${issue.situation}] ${issue.title}`;
    const labels = (issue.type === 'error') ? 'Zelda,Emergency,Bug' : 'Zelda,Request';
    const description = `ScreenName: ${issue.situation}<br>`
      + `Build: ${issue.props.build}<br>`
      + `DisplaySize: ${JSON.stringify(issue.props.displaySize)}<br>`
      + `Browser: ${issue.props.browser}<br>`
      + `Sender: ${issue.props.senderAccount}<br>`
      + `ZeldaIssueId: ${issue.id}<br>`;

    const gitlabResponse: any = await fetch(
      `https://gitlab.com/api/v4/projects/${projectId}/issues`
      + `?private_token=${privateToken}`
      + `&title=${title}`
      + `&labels=${labels}`
      + `&description=${description}`,
      {method: 'POST'})
      .catch((e) => {
        console.error(`FAILED to post new ZeldaIssue to GitLab.`, e);
      });

    const gitlabIssue: any = await gitlabResponse.json();

    return {
      id: gitlabIssue.iid,
      url: gitlabIssue.web_url,
      createdAt: new Date(gitlabIssue.created_at),
    };
  },

  onVoteIssue: async (issue: ZeldaIssue): Promise<void> => {
    const loginUserName = 'Ganondorf';
    const content = `[ZELDA:system]<br>`
      + `voted by ${loginUserName}`;


    await fetch(
      `https://gitlab.com/api/v4/projects/${projectId}/issues/${issue.ticket.id}/notes`
      + `?private_token=${privateToken}`
      + `&body=${content}`,
      {
        method: 'POST',
        body: content,
      })
      .catch((e) => {
        console.error(`FAILED to update ZeldaIssue of GitLab #${issue.ticket.id}`, e);
      });
  },
});
