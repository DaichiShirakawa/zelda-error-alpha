import {ZeldaErrorLabels} from './zelda-error-lang-types';
import {ZeldaIssue, ZeldaIssueTicket} from './zelda-error-types';

/**
 * ZELDA_ERRORにロジックを注入するためのinterfaceです
 * 詳しくは各interfaceを参照してください
 */
export interface ZeldaErrorSettings {
  styles: ZeldaErrorStyles,
  issueExtension: ZeldaIssueExtension,
  ticketIntegration: ZeldaErrorTicketIntegration,
  notificationIntegration: ZeldaErrorNotificationIntegration,
  dbIntegration: ZeldaErrorDBIntegration,
  localeLabels: { [locale: string]: ZeldaErrorLabels },
}

/**
 * ガジェットの配置に関するスタイリングを記述できます
 * 他にも設定項目が必要なら拡張を検討します
 */
export interface ZeldaErrorStyles {
  zeldaButtonTop?: number,
  zeldaButtonRight?: number,
  panelWidth?: number,
  panelHeight?: number,
}

/**
 * ZeldaIssueデータの拡張を記述できます
 */
export interface ZeldaIssueExtension {
  /**
   * ZeldaIssueデータに付与する任意のデータをObject形式で返します。
   * ここで返した値は issue.props フィールドに記録されます。
   */
  getPropsOfIssue?: (issue: ZeldaIssue) => Promise<any>,
}

/**
 * 外部Ticket/Issue管理サービス (GitHub, GitLab, JIRA, ...)
 * のデータの作成や更新のために、APIアクセスを記述します
 */
export interface ZeldaErrorTicketIntegration {
  /**
   * 新たなZeldaIssueの作成時にcallされます。
   * 外部サービスでTicketを作成し、その情報をZeldaIssueTicketとして返してください。
   * issue.ticket フィールドに記録されます。
   * @param issue ticket フィールドはまだ空であることに注意してください
   */
  onCreateIssue?: (issue: ZeldaIssue) => Promise<ZeldaIssueTicket>,

  /**
   * ZeldaIssueのvote時にcallされます。
   * @param issue
   */
  onVoteIssue?: (issue: ZeldaIssue) => Promise<void>,
}

/**
 * 外部コミュニケーションサービス (Chat like Slack, EMail, ...)
 * への通知のために、APIアクセスを記述します
 */
export interface ZeldaErrorNotificationIntegration {
  /**
   * 新たなZeldaIssueの作成時にcallされます。
   * @param issue
   */
  onCreateIssue?: (issue: ZeldaIssue) => Promise<void>,

  /**
   * ZeldaIssueのvote時にcallされます。
   * @param issue
   */
  onVoteIssue?: (issue: ZeldaIssue) => Promise<void>,
}

/**
 * 外部DBサービス (FileSystems, DynamoDB, Firebase DB, ...)
 * への記録のために、APIアクセスを記述します
 */
export interface ZeldaErrorDBIntegration {
  /**
   * 新たなZeldaIssueの作成時にcallされます。
   * issue.id を明示的に決めたい場合は実装してください。
   * 実装がない場合、issue.id は ZeldaErrorDBIntegration.addIssue()でidを返すまで空のままになります。
   *
   * @param situation
   * @return 新たなZeldaIssueのid
   */
  nextId?: (situation: string) => Promise<string>,

  /**
   * ZELDA_ERRORのsituationがupdateされた時にcallされます。
   * situationのissuesをDBからロードした後、
   * showIssues(issues)をcallすることでコンポーネントに描画できます。
   *
   * issuesのreturnではなく、showIssues()でcallbackしているのは、
   * 継続的なlistenなどの挙動を想定しているからです。
   * (例えば複数回showIssues(allOfLoadedIssues)をcallすることができます)
   *
   * @param situation
   * @param showIssues
   */
  loadIssues?: (situation: string, showIssues: (issues: ZeldaIssue[]) => void) => Promise<void>,

  /**
   * 新たなZeldaIssueの作成時にcallされます。
   * issueをDBに記録し、そのidを返してください。
   * ZeldaErrorDBIntegration.nextId()によって既にidが決定されている場合も、
   * そのまま return issue.id してください。
   *
   * @param issue
   * @return 新たなZeldaIssueのid
   */
  addIssue?: (issue: ZeldaIssue) => Promise<string>,

  /**
   * ZeldaIssueのupdate時にcallされます。
   * DB上のissueに対応するデータを更新してください。
   * @param issue updateされたissue
   * @param updated issueのうち、updateされたフィールドのみのobject
   */
  updateIssue?: (issue: ZeldaIssue, updated: any) => Promise<void>,
}
