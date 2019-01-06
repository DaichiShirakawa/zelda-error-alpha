import {ZeldaIssueStatus} from "./types/zelda-error-types";
<template>
  <div class='zelda-error' v-if="!hideEternally">
    <div class='invisible-background'
         @click="onToggleZelda"
         v-if="open"></div>

    <div class="zelda-button"
         :class="[`bg-${iconBackground}`]"
         @click="onToggleZelda"
         :style="{
         top: `${settings.styles.zeldaButtonTop || 24}px`,
         right: `${settings.styles.zeldaButtonRight || 24}px`
         }">
      <img src="./common/triangle.png"/>
      <span>{{issues.filter(issue => issue.status === 'open'/*ZeldaIssueStatus.open*/).length}}</span>
    </div>

    <div class="zelda-panel"
         :class="{open: open}"
         :style="{
    top: `${settings.styles.zeldaButtonTop || 24}px`,
    right: `${settings.styles.zeldaButtonRight || 24}px`,
    width: `${settings.styles.panelWidth || 400}px`,
    height: `${settings.styles.panelHeight || 400}px`,
    }">

      <div class='header' :style="{width: settings.styles.panelWidth - 20}">
        <span>[{{situation}}]</span>
        <div class='hide-button bg-info'
             @click="onHideEternally">
          {{labels.hideButtonPrefix}}<img src="./common/triangle.png"/>{{labels.hideButtonSuffix}}
        </div>
      </div>

      <h3 class='loading' v-if="loading">Loading...</h3>

      <div class='issues' v-if="!loading">
        <div class='issue' v-for="button in issueButtons"
             :class="[(button.issue.status === 'open' /*ZeldaIssueStatus.open*/) ? 'open' : 'closed']"
             :key="button.issue.id">
          <div class="button"
               :class="button.classes"
               @click="onVote(button.issue)">
            {{button.label}}
          </div>
          <span class='title'>
            <a v-if="showTicketLink && button.issue.ticket != null && button.issue.ticket.url != null"
               :href="button.issue.ticket.url"
               target="_blank">#{{button.issue.ticket.id}}</a>
            <span v-else>#{{button.issue.ticket ? button.issue.ticket.id : '???'}}</span>
            {{' ' + button.issue.title}}
          </span>
        </div>
      </div>

      <div class='footer'>
        <input title="issueTitle"
               :placeholder="labels.formPlaceholder"
               :value="issueTitle"
               @change="onChangeTitle"
               :disabled="issueSending"/>
        <div>
          <button class="request bg-warn"
                  :class="[issueSending ? 'disabled' : '']"
                  :disabled="issueSending"
                  @click="onAddIssue('request' /*ZeldaIssueType.request*/)">
            <span>{{labels.registerRequest}}</span>
          </button>
          <button class="error bg-error"
                  :class="[issueSending ? 'disabled' : '']"
                  :disabled="issueSending"
                  @click="onAddIssue('error' /*ZeldaIssueType.error*/)">
            <span>{{labels.registerError}}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from "vue-property-decorator";
  import {ZeldaErrorDefaultLabels, ZeldaErrorLabels} from "./common/types/zelda-error-lang-types";
  import {ZeldaErrorSettings} from "./common/types/zelda-error-property-types";
  import {ZeldaIssue, ZeldaIssueStatus, ZeldaIssueType} from "./common/types/zelda-error-types";
  import {ZeldaErrorService} from "./common/zelda-error-service";

  @Component
  export default class ZeldaError extends Vue {
    @Prop() public situation!: string;
    @Prop() public settings!: ZeldaErrorSettings;
    @Prop({default: "en"}) public locale: string;
    @Prop({default: true}) public showTicketLink: boolean;

    private labels: ZeldaErrorLabels = ZeldaErrorDefaultLabels.ja;
    private open: boolean = false;
    private loading: boolean = false;
    private iconBackground: "success" | "warn" | "error" = "success";
    private issues: ZeldaIssue[] = [];
    private voted: { [issueId: string]: boolean } = {};
    private issueTitle: string = "";
    private issueSending: boolean = false;
    private hideEternally: boolean = false;

    public created() {
      this.labels = this.settings.localeLabels[this.locale];
      this.onChangeSituation().then();
    }

    @Watch("situation")
    protected async onChangeSituation() {
      if (this.hideEternally) {
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

    protected updateButtonBG() {
      if (this.issues.some((issue) => issue.status === ZeldaIssueStatus.open)) {
        if (this.issues.some((issue) => issue.type === ZeldaIssueType.error)) {
          this.iconBackground = "error";
        } else {
          this.iconBackground = "warn";
        }
      } else {
        this.iconBackground = "success";
      }
    }

    protected onToggleZelda() {
      this.open = !this.open;
    }

    protected async onVote(issue: ZeldaIssue) {
      if (issue.status !== ZeldaIssueStatus.open || this.voted[issue.id]) {
        return;
      }

      issue = this.issues.find((each: ZeldaIssue) => each.id === issue.id)!;
      ZeldaErrorService.vote(this.settings, issue).then();

      this.voted[issue.id] = true;
    }

    protected async onAddIssue(type: ZeldaIssueType | string) {
      const title = this.issueTitle.trim();
      if (title.length <= 0) {
        return;
      }

      this.issueSending = true;

      const result = await confirm(type === "error"
        ? this.labels.confirmRegisterError
        : this.labels.confirmRegisterRequest);
      if (!result) {
        this.issueSending = false;
        return;
      }

      this.addIssue(title, type as ZeldaIssueType).then();
    }

    protected async addIssue(title: string, type: ZeldaIssueType) {
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

        this.issueTitle = "";
        this.voted[issue.id] = true;

      } finally {
        this.issueSending = false;
        this.updateButtonBG();
      }
    }

    protected async onHideEternally() {
      this.hideEternally = await confirm(this.labels.confirmHide);
    }

    protected onChangeTitle(event: any) {
      this.issueTitle = event.target.value;
    }

    protected get issueButtons(): any[] {
      return this.issues.map(this.toIssueButton);
    }

    protected toIssueButton(issue: ZeldaIssue): any {
      let button: any = {
        issue,
        label: "",
        classes: ["disabled", "bg-info"],
      };

      switch (issue.status) {
        case "next_patch":
          button = {
            issue,
            label: this.labels.issueWaitingPatch,
            classes: ["disabled", "bg-info"],
          };
          break;
        case "fixed":
          button = {
            issue,
            label: this.labels.issueFixed,
            classes: ["disabled", "bg-success"],
          };
          break;
        default:
          button = {
            issue,
            label: `+${issue.vote}`,
            classes: ["vote", this.voted[issue.id] ? "disabled" : "", `bg-${(issue.type === "error") ? "error" : "warn"}`],
          };
          break;
      }

      return button;
    }
  }
</script>

<style scoped lang="scss">
  @import "common/ZeldaError";
</style>
