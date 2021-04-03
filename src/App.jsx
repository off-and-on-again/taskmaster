import React from "react";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./pages/Home.jsx";

// Bootstrap
import "./bundle.js";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div class="container">
          <header class="d-flex justify-content-center py-3">
            <ul class="nav nav-pills">
              <li class="nav-item">
                <Link to="/" class="nav-link active">
                  Home
              </Link>
              </li>
              <li class="nav-item"><a href="#" class="nav-link">Schedule</a></li>
              <li class="nav-item"><a href="#" class="nav-link">Tips</a></li>
            </ul>
          </header>
        </div>

        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}