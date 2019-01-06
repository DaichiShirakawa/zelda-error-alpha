import * as React from "react";
import {Component, Fragment} from "react";
import {Redirect, Route, Switch, withRouter} from "react-router";
import {
  MyZeldaDBIntegration,
  MyZeldaIssueExtension,
  MyZeldaNotificationIntegration,
  MyZeldaStyles,
  MyZeldaTicketIntegration
} from "./my-zelda-implementations";
import AppRoutes from "./routes";
import {ZeldaErrorDefaultLabels} from "./zelda-error/common/types/zelda-error-lang-types";
import ZeldaError from "./zelda-error/ZeldaError";

interface P {
  location?: any,
}

class RouterRoot extends Component<P, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const r = AppRoutes.find(route => this.props.location.pathname === route.path);
    const situation = r ? r.name : 'Route Not Found';

    return (
      <Fragment>
        <ZeldaError
          situation={situation}
          locale={'en'}
          settings={{
            issueExtension: MyZeldaIssueExtension,
            ticketIntegration: MyZeldaTicketIntegration,
            notificationIntegration: MyZeldaNotificationIntegration,
            dbIntegration: MyZeldaDBIntegration,
            styles: MyZeldaStyles,
            localeLabels: ZeldaErrorDefaultLabels,
          }}/>

        <Switch>
          {AppRoutes.map((route: any, idx: number) => (
            <Route key={idx}
                   path={route.path}
                   exact={route.exact}
                   render={(props: any) => <route.component {...props} />}/>
          ))}
          <Redirect from="/" to="/zelda-viewer"/>
        </Switch>
      </Fragment>
    );
  }
}

export default withRouter(RouterRoot);
