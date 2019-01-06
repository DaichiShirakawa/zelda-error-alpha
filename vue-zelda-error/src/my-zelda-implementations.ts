import {ZeldaErrorDefaultLabels, ZeldaErrorLabels} from '@/zelda-error/common/types/zelda-error-lang-types';
import {
  ZeldaErrorDBIntegration,
  ZeldaErrorNotificationIntegration,
  ZeldaErrorStyles,
  ZeldaErrorTicketIntegration,
  ZeldaIssueExtension,
} from '@/zelda-error/common/types/zelda-error-property-types';
import {ZeldaErrorDBMock} from '@/zelda-error/common/zelda-error-sample-integrations/zelda-error-db-mock';
import {ZeldaErrorNotificationSlack} from '@/zelda-error/common/zelda-error-sample-integrations/zelda-error-notification-slack';
import {ZeldaErrorTicketGitLab} from '@/zelda-error/common/zelda-error-sample-integrations/zelda-error-ticket-gitlab';

/**
 * このソースはZeldaErrorを利用するために必要な、
 * アプリ固有の実装を記述しています。
 *
 * それぞれのinterfaceについては、
 * zelda-error-property-types.ts を参照してください
 */

export const MyZeldaStyles: ZeldaErrorStyles = {
  zeldaButtonTop: 24,
  zeldaButtonRight: 24,
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
