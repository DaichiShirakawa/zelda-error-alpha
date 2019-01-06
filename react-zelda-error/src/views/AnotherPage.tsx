import * as React from "react";
import {Component} from "react";
import {withRouter} from "react-router";

interface P {
  history: any,
}

class AnotherPage extends Component<P, {}> {
  constructor(props: any) {
    super(props);
  }

  private onClickLink = () => {
    this.props.history.push('/');
  };

  public render() {
    return (
      <div>
        <h3>AnotherPage</h3>

        <span style={{borderBottom: '1px solid', cursor: 'pointer'}}
              onClick={this.onClickLink}>
          go to HelloPage
        </span>
      </div>
    );
  }
}

export default withRouter(AnotherPage);
