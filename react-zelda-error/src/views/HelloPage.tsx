import * as React from "react";
import {Component} from "react";
import {withRouter} from "react-router";

interface P {
  history: any,
}

class HelloPage extends Component<P, {}> {
  constructor(props: any) {
    super(props);
  }

  private onClickLink = () => {
    this.props.history.push('/another');
  };

  public render() {
    return (
      <div>
        <h3>HelloPage</h3>

        <span style={{borderBottom: '1px solid', cursor: 'pointer'}}
              onClick={this.onClickLink}>
          go to AnotherPage
        </span>
      </div>
    );
  }
}

export default withRouter(HelloPage);
