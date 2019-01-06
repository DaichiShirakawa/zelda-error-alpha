import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ZeldaErrorDefaultLabels, ZeldaErrorLabels} from "./common/types/zelda-error-lang-types";
import {ZeldaErrorSettings} from "./common/types/zelda-error-property-types";
import {ZeldaIssue, ZeldaIssueStatus, ZeldaIssueType} from "./common/types/zelda-error-types";
import {ZeldaErrorService} from "./common/zelda-error-service";

@Component({
  selector: 'zelda-error',
  templateUrl: './zelda-error.component.html',
  styleUrls: ['./common/ZeldaError.scss']
})
export class ZeldaErrorComponent implements OnInit {
  @Input() public situation!: string;
  @Input() public settings!: ZeldaErrorSettings;
  @Input() public locale: string = 'en';
  @Input() public showTicketLink: boolean = true;

  private labels: ZeldaErrorLabels = ZeldaErrorDefaultLabels.ja;
  private open: boolean = false;
  private loading: boolean = false;
  private iconBackground: 'success' | 'warn' | 'error' = 'success';
  private issues: ZeldaIssue[] = [];
  private voted: { [issueId: string]: boolean } = {};
  private issueTitle: string = '';
  private issueSending: boolean = false;
  private hideEternally: boolean = false;

  ngOnInit() {
    this.labels = this.settings.localeLabels[this.locale];
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.hideEternally || !changes.situation || !this.situation) {
      return;
    }

    this.loading = true;

    // load issues of situation
    await ZeldaErrorService.loadIssues(this.settings, this.situation, (issues) => {
      this.issues = issues;
      this.loading = false;
      this.updateButtonBG();
    });
  }

  updateButtonBG() {
    if (this.issues.some((issue) => issue.status === ZeldaIssueStatus.open)) {
      if (this.issues.some((issue) => issue.type === ZeldaIssueType.error)) {
        this.iconBackground = 'error';
      } else {
        this.iconBackground = 'warn';
      }
    } else {
      this.iconBackground = 'success';
    }
  }

  onToggleZelda() {
    this.open = !this.open;
  }

  async onVote(issue: ZeldaIssue) {
    if (issue.status !== ZeldaIssueStatus.open || this.voted[issue.id]) {
      return;
    }

    issue = this.issues.find((each: ZeldaIssue) => each.id === issue.id);
    ZeldaErrorService.vote(this.settings, issue).then();

    this.voted[issue.id] = true;
  }

  onChangeTitle(issueTitle: string) {
    this.issueTitle = issueTitle;
  }

  async onAddIssue(type: ZeldaIssueType | string) {
    const title = this.issueTitle.trim();
    if (title.length <= 0) {
      return;
    }

    this.issueSending = true;

    const result = await confirm(type === 'error'
      ? this.labels.confirmRegisterError
      : this.labels.confirmRegisterRequest);
    if (!result) {
      this.issueSending = false;
      return;
    }

    this.addIssue(title, type as ZeldaIssueType).then();
  }

  async addIssue(title: string, type: ZeldaIssueType) {
    try {
      this.issueSending = true;

      const issue = await ZeldaErrorService.createIssue(
        this.settings,
        this.situation,
        title,
        type,
      );

      this.issues.push(issue);
      ZeldaErrorService.sortIssues(this.issues);

      this.issueTitle = '';
      this.voted[issue.id] = true;

    } finally {
      this.issueSending = false;
      this.updateButtonBG();
    }
  }

  async onHideEternally() {
    this.hideEternally = await confirm(this.labels.confirmHide);
  }

  get openIssueLength(): number {
    return this.issues.filter((issue) => issue.status === ZeldaIssueStatus.open).length;
  }

  get issueButtons(): any[] {
    return this.issues.map(this.toIssueButton);
  }

  toIssueButton = (issue: ZeldaIssue): any => {
    let button: any = {
      issue,
      label: '',
      classes: ['disabled', 'bg-info'],
    };

    switch (issue.status) {
      case 'next_patch':
        button = {
          issue,
          label: this.labels.issueWaitingPatch,
          classes: ['disabled', 'bg-info'],
        };
        break;
      case 'fixed':
        button = {
          issue,
          label: this.labels.issueFixed,
          classes: ['disabled', 'bg-success'],
        };
        break;
      default:
        button = {
          issue,
          label: `+${issue.vote}`,
          classes: ['vote', this.voted[issue.id] ? 'disabled' : '', `bg-${(issue.type === 'error') ? 'error' : 'warn'}`],
        };
        break;
    }

    return button;
  }
}
