import {Component} from '@angular/core';
import {
  MyZeldaDBIntegration,
  MyZeldaErrorLabels,
  MyZeldaIssueExtension,
  MyZeldaNotificationIntegration,
  MyZeldaStyles,
  MyZeldaTicketIntegration
} from "./my-zelda-implementations";
import {ZeldaErrorSettings} from "./zelda-error/common/types/zelda-error-property-types";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular ZELDA_ERROR';
  zeldaSituation: string = '';
  zeldaSettings: ZeldaErrorSettings = {
    styles: MyZeldaStyles,
    issueExtension: MyZeldaIssueExtension,
    ticketIntegration: MyZeldaTicketIntegration,
    notificationIntegration: MyZeldaNotificationIntegration,
    dbIntegration: MyZeldaDBIntegration,
    localeLabels: MyZeldaErrorLabels,
  };

  onRouterActivate($event) {
    this.zeldaSituation = $event.constructor.name;
  }
}
