import React from "react";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Scheduler from "./pages/Scheduler.jsx";

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
                <Link to="/" className="nav-link active">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/scheduler" className="nav-link">Schedule</Link>
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
              events={[]}
              hours={[8, 20]} />
          </Route>
        </Switch>
      </Router>
    );
  }
}