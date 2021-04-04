import React from "react";
import { NavLink, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Scheduler from "./pages/Scheduler.jsx";
import { unpackData } from "../Scripts/scheduler.js";

// Bootstrap
import "./bundle.js";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="container">
          <header className="d-flex justify-content-center py-3">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <NavLink exact to="/" className="nav-link" activeClassName="active">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/scheduler" className="nav-link" activeClassName="active">Schedule</NavLink>
              </li>
              <li className="nav-item"><a href="#" className="nav-link">Tips</a></li>
            </ul>
          </header>
        </div>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/scheduler">
            <Scheduler
              savedEvents={unpackData(0)}
              events={unpackData(1)}
              hours={[8, 20]} />
          </Route>
        </Switch>
      </Router>
    );
  }
}