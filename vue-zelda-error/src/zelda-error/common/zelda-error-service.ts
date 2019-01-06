import {ZeldaErrorSettings} from './types/zelda-error-property-types';
import {ZeldaIssue, ZeldaIssueStatus, ZeldaIssueType} from './types/zelda-error-types';

const LOG = (str: string) => console.log(`[ZELDA_ERROR] ${str}`);
const WARN = (str: string) => console.warn(`[ZELDA_ERROR] ${str}`);

export const ZeldaErrorService = {
  loadIssues: async (settings: ZeldaErrorSettings,
                     situation: string,
                     callback: (issues: ZeldaIssue[]) => void): Promise<void> => {
    console.log(`[ZELDA_ERROR] Set situation: ${situation}`);

    if (!settings.dbIntegration.loadIssues) {
      WARN(`getIssues not defined.`);
      return;
    }

    LOG(`loading issues of ${situation}.`);

    const showIssues = (issues: ZeldaIssue[]) => {
      ZeldaErrorService.sortIssues(issues);
      LOG(`${issues.length} issues found.`);
      callback(issues);
    };

    await settings.dbIntegration.loadIssues(situation, showIssues);
  },

  sortIssues: (issues: ZeldaIssue[]) => {
    issues.sort((a: ZeldaIssue, b: ZeldaIssue) => {
      if (a.status !== b.status) {
        // ステータスが異なるならステータス順
        const order = ['open', 'next_patch', 'fixed'];
        return order.indexOf(a.status) - order.indexOf(b.status);
      }

      switch (a.status) {
        case 'open':
          // openならvote降順
          return b.vote - a.vote;
        case 'next_patch':
        case 'fixed':
          if (!a.ticket.closedAt || !b.ticket.closedAt) {
            break;
          }
          // closeならclose日降順
          return new Date(b.ticket.closedAt).getMilliseconds() - new Date(a.ticket.closedAt).getMilliseconds();
      }
      return 0;
    });
  },

  createIssue: async (settings: ZeldaErrorSettings,
                      situation: string,
                      title: string,
                      type: ZeldaIssueType) => {
    let issue = await ZeldaErrorService.newIssue(settings, situation, title, type);

    // Post ticket
    issue = await ZeldaErrorService.createTicket(settings, issue);

    // Notification
    ZeldaErrorService
      .postNotificationOnCreate(settings, issue)
      .catch(console.warn);

    // Add to DB
    ZeldaErrorService.saveNewIssue(settings, issue).catch(console.warn);

    return issue;
  },

  newIssue: async (settings: ZeldaErrorSettings,
                   situation: string,
                   title: string,
                   type: ZeldaIssueType): Promise<ZeldaIssue> => {
    let id: string | void;
    if (settings.dbIntegration.nextId) {
      id = await settings.dbIntegration.nextId(situation).catch(WARN);
    }

    if (!id) {
      id = Math.random().toString(36).slice(-8);
    }

    const issue: ZeldaIssue = {
      id,
      situation,
      title,
      type,
      status: ZeldaIssueStatus.open,
      vote: 1,
      ticket: {id: -1},
      props: null,
    };

    if (settings.issueExtension.getPropsOfIssue) {
      issue.props = await settings.issueExtension.getPropsOfIssue(issue);
    }

    return issue;
  },

  createTicket: async (settings: ZeldaErrorSettings, issue: ZeldaIssue): Promise<ZeldaIssue> => {
    if (!settings.ticketIntegration.onCreateIssue) {
      return await issue;
    }

    LOG(`creating ticket about issue ${issue.id}`);
    issue.ticket = await settings.ticketIntegration.onCreateIssue(issue);

    LOG(`ticket created: ${JSON.stringify(issue.ticket)}`);
    return await issue;
  },

  postNotificationOnCreate: async (settings: ZeldaErrorSettings, issue: ZeldaIssue) => {
    if (!settings.notificationIntegration.onCreateIssue) {
      return;
    }

    LOG(`notification about issue ${issue.id}`);
    await settings.notificationIntegration.onCreateIssue(issue).catch(WARN);
  },

  saveNewIssue: async (settings: ZeldaErrorSettings, issue: ZeldaIssue) => {
    if (!settings.dbIntegration.addIssue) {
      LOG(`addIssue not defined in DB Integration.`);
      return;
    }

    LOG(`add issue to ${issue.situation} / ${issue.id}`);
    await settings.dbIntegration.addIssue(issue);
  },

  vote: async (settings: ZeldaErrorSettings, issue: ZeldaIssue) => {
    issue.vote++;
    LOG(`vote issue ${issue.situation} / ${issue.id}`);

    if (!settings.ticketIntegration.onVoteIssue) {
      LOG(`onVoteIssue not defined in Ticket Integration.`);
    } else {
      LOG(`TICKET vote issue ${issue.situation} / ${issue.id}`);
      settings.ticketIntegration.onVoteIssue(issue).catch(console.warn);
    }

    if (!settings.notificationIntegration.onVoteIssue) {
      LOG(`voteIssue not defined in NOTIFICATION Integration.`);
    } else {
      LOG(`NOTIFICATION vote issue ${issue.situation} / ${issue.id}`);
      settings.notificationIntegration.onVoteIssue(issue).catch(console.warn);
    }

    if (!settings.dbIntegration.updateIssue) {
      LOG(`updateIssue not defined in DB Integration.`);
    } else {
      LOG(`DB vote issue ${issue.situation} / ${issue.id}`);
      settings.dbIntegration.updateIssue(issue, {vote: issue.vote}).catch(console.warn);
    }
  },
};
