import * as React from "react";
import {Component} from "react";
import {Route, Switch} from "react-router";
import {HashRouter} from "react-router-dom";
import './App.scss';
import logo from './logo.svg';
import RouterRoot from "./RouterRoot";


interface P {
  location?: any,
}

class App extends Component<P, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Welcome to React ZELDA_ERROR</h1>
        </header>

        <HashRouter>
          <Switch>
            <Route path="/" name="RouterRootName" component={RouterRoot}/>
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default App;
