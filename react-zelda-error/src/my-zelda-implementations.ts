import {ZeldaErrorDefaultLabels, ZeldaErrorLabels} from "./zelda-error/common/types/zelda-error-lang-types";
import {
  ZeldaErrorDBIntegration,
  ZeldaErrorNotificationIntegration,
  ZeldaErrorStyles,
  ZeldaErrorTicketIntegration,
  ZeldaIssueExtension
} from "./zelda-error/common/types/zelda-error-property-types";
import {ZeldaErrorDBMock} from "./zelda-error/common/zelda-error-sample-integrations/zelda-error-db-mock";
import {ZeldaErrorNotificationSlack} from "./zelda-error/common/zelda-error-sample-integrations/zelda-error-notification-slack";
import {ZeldaErrorTicketGitLab} from "./zelda-error/common/zelda-error-sample-integrations/zelda-error-ticket-gitlab";

export const MyZeldaStyles: ZeldaErrorStyles = {
  zeldaButtonTop: 32,
  zeldaButtonRight: 32,
  panelWidth: 400,
  panelHeight: 400,
};


export const MyZeldaIssueExtension: ZeldaIssueExtension = {
  getPropsOfIssue: async (): Promise<any> => {
    // ログインユーザー、解像度、ブラウザの種類、などissue解決に役立つデータを詰め込む
    return {
      myProp1: 1,
      myProp2: {
        a: 'b',
        c: 'd',
      },
      myProp3: [1, 2, 3],
    };
  },
};

export const MyZeldaTicketIntegration: ZeldaErrorTicketIntegration
  = ZeldaErrorTicketGitLab('zelda-error%2Fzelda-error-vue', 'JrdcLxLcuSYB_8Hns8QC');

export const MyZeldaNotificationIntegration: ZeldaErrorNotificationIntegration
  = ZeldaErrorNotificationSlack('https://hooks.slack.com/services/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');

export const MyZeldaDBIntegration: ZeldaErrorDBIntegration
  = ZeldaErrorDBMock();

export const MyZeldaErrorLabels: { [locale: string]: ZeldaErrorLabels }
  = ZeldaErrorDefaultLabels;
