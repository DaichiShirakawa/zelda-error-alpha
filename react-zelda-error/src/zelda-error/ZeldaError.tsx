import * as React from 'react';
import {Component, Fragment} from 'react';
import triangle from './common/triangle.png';
import {ZeldaErrorLabels} from "./common/types/zelda-error-lang-types";
import {ZeldaErrorSettings} from "./common/types/zelda-error-property-types";
import {ZeldaIssue, ZeldaIssueStatus, ZeldaIssueType} from "./common/types/zelda-error-types";
import {ZeldaErrorService} from "./common/zelda-error-service";
import "./common/ZeldaError.scss";

interface P {
  situation: string,
  settings: ZeldaErrorSettings,
  locale?: string;
  showTicketLink?: boolean;
}

interface S {
  labels: ZeldaErrorLabels,
  open: boolean,
  loading: boolean,
  situation: string,
  iconBackground: 'success' | 'warn' | 'error',
  issues: ZeldaIssue[],
  voted: { [issueId: string]: boolean }
  issueTitle: string,
  issueSending: boolean,
  hideEternally: boolean,
}

let _labels: ZeldaErrorLabels = {} as ZeldaErrorLabels;

export default class ZeldaError extends Component<P, S> {
  public props: P;
  public state: S;

  public static defaultProps: P = {
    locale: 'ja',
    showTicketLink: true,
  } as P;

  constructor(props: P) {
    super(props);

    this.state = {
      labels: props.settings.localeLabels[this.props.locale!],
      open: false,
      loading: false,
      situation: '',
      iconBackground: 'success',
      issues: [],
      voted: {},
      issueTitle: '',
      issueSending: false,
      hideEternally: false,
    };

    _labels = this.state.labels;
  }

  public componentWillMount() {
    this.onChangeSituation(this.props.situation).catch(console.warn);
  }

  public componentWillReceiveProps(nextProps: P) {
    if (nextProps.situation) {
      this.onChangeSituation(nextProps.situation).catch(console.warn);
    }
  }

  protected async onChangeSituation(situation: string) {
    if (this.state.hideEternally
      || this.state.situation === situation) {
      return;
    }

    this.setState({
      situation,
      loading: true,
    });

    // load issues of situation
    await ZeldaErrorService.loadIssues(this.props.settings, situation, (issues) => {
      this.setState({
          issues,
          loading: false,
        },
        () => this.updateButtonBG());
    });
  }

  protected updateButtonBG = () => {
    if (this.state.issues.some(issue => issue.status === ZeldaIssueStatus.open)) {
      if (this.state.issues.some(issue => issue.type === ZeldaIssueType.error)) {
        this.setState({iconBackground: 'error'});
      } else {
        this.setState({iconBackground: 'warn'});
      }
    } else {
      this.setState({iconBackground: 'success'});
    }
  };

  protected onToggleZelda = () => {
    this.setState({open: !this.state.open});
  };

  protected onVote = async (issue: ZeldaIssue) => {
    if (issue.status !== ZeldaIssueStatus.open || this.state.voted[issue.id]) {
      return;
    }

    issue = this.state.issues.find(each => each.id === issue.id)!;
    ZeldaErrorService.vote(this.props.settings, issue).catch(console.warn);

    this.setState({
      issues: this.state.issues,
      voted: {
        ...this.state.voted,
        [issue.id]: true,
      }
    });
  };

  protected onAddIssue = async (type: ZeldaIssueType) => {
    const title = this.state.issueTitle.trim();
    if (title.length <= 0) {
      return;
    }

    this.setState({issueSending: true});

    const result = await confirm(type === 'error' ? _labels.confirmRegisterError : _labels.confirmRegisterRequest);
    if (!result) {
      this.setState({issueSending: false});
      return;
    }

    this.addIssue(title, type).then();
  };

  protected addIssue = async (title: string, type: ZeldaIssueType) => {
    try {
      this.setState({issueSending: true});

      const issue = await ZeldaErrorService.createIssue(
        this.props.settings,
        this.state.situation,
        title,
        type,
      );

      this.state.issues.push(issue);
      ZeldaErrorService.sortIssues(this.state.issues);

      this.setState({
        issues: this.state.issues,
        issueTitle: '',
        voted: {...this.state.voted, [issue.id]: true},
      });

    } finally {
      this.setState({issueSending: false});
      this.updateButtonBG();
    }
  };

  protected onHideEternally = async () => {
    const hideEternally = await confirm(_labels.confirmHide);
    this.setState({hideEternally});
  };

  protected onChangeTitle = (event: any) => {
    this.setState({issueTitle: event.target.value});
  };

  protected toIssueButton = (issue: ZeldaIssue): any => {
    let button: any = {
      issue,
      classes: 'bg-info disabled',
      label: '',
    };

    switch (issue.status) {
      case 'next_patch':
        button = {
          issue,
          classes: 'bg-info disabled',
          label: _labels.issueWaitingPatch,
        };
        break;
      case 'fixed':
        button = {
          issue,
          classes: 'bg-success disabled',
          label: _labels.issueFixed,
        };
        break;
      default:
        button = {
          issue,
          classes: `vote bg-${(issue.type === 'error') ? 'error' : 'warn'} ${this.state.voted[issue.id] ? 'disabled' : ''}`,
          label: `+${issue.vote}`,
        };
        break;
    }

    return button;
  };

  public render() {
    if (this.state.hideEternally) {
      return <Fragment/>;
    }

    const {
      styles,
    } = this.props.settings;

    const {
      showTicketLink,
    } = this.props;

    const {
      open,
      situation,
      issues,
      loading,
      issueTitle,
      issueSending,
      iconBackground,
    } = this.state;

    return (
      <div className={'zelda-error'}>
        <div className={'invisible-background'}
             onClick={this.onToggleZelda}
             style={{visibility: open ? 'visible' : 'hidden'}}/>

        <div className={`zelda-button bg-${iconBackground}`}
             onClick={this.onToggleZelda}
             style={{
               top: styles.zeldaButtonTop,
               right: styles.zeldaButtonRight,
             }}>
          <img src={triangle}/>
          <span>{issues.filter(issue => issue.status === ZeldaIssueStatus.open).length}</span>
        </div>

        <div className={`zelda-panel ${open && 'open'}`}
             style={{
               top: styles.zeldaButtonTop,
               right: styles.zeldaButtonRight,
               width: styles.panelWidth,
               height: styles.panelHeight,
             }}>

          <div className={'header'} style={{width: styles.panelWidth! - 20}}>
            <span>[{situation}]</span>
            <div className={'hide-button bg-info'}
                 onClick={this.onHideEternally}>
              {_labels.hideButtonPrefix}<img src={triangle}/>{_labels.hideButtonSuffix}
            </div>
          </div>

          {loading && <h3 className={'loading'}>Loading...</h3>}
          {!loading &&
          <div className={'issues'}>
            {issues.map(this.toIssueButton).map((button: any) =>
              <div className={`issue ${(button.issue.status === ZeldaIssueStatus.open) ? 'open' : 'closed'}`}
                   key={button.issue.id}>
                <div className={`button ${button.classes}`}
                     onClick={() => this.onVote(button.issue)}>
                  {button.label}
                </div>
                <span className={'title'}>
                  {(showTicketLink && button.issue.ticket && button.issue.ticket.url) ?
                    <a href={button.issue.ticket.url} target={'_blank'}>#{button.issue.ticket.id}</a>
                    :
                    <span>#{button.issue.ticket ? button.issue.ticket.id : '???'}</span>
                  }
                  {' ' + button.issue.title}
                </span>
              </div>
            )}
          </div>
          }

          <div className={'footer'}>
            <input placeholder={_labels.formPlaceholder}
                   value={issueTitle}
                   onChange={this.onChangeTitle}
                   disabled={issueSending}/>
            <div style={{flexDirection: 'row', width: '100%'}}>
              <button className={`request bg-warn ${issueSending && 'disabled'}`}
                      disabled={issueSending}
                      onClick={() => this.onAddIssue(ZeldaIssueType.request)}>
                <span>{_labels.registerRequest}</span>
              </button>
              <button className={`error bg-error ${issueSending && 'disabled'}`}
                      disabled={issueSending}
                      onClick={() => this.onAddIssue(ZeldaIssueType.error)}>
                <span>{_labels.registerError}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
