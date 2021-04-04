import React from "react";
import { NavLink, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Scheduler from "./pages/Scheduler.jsx";
import moment from "moment";

import db from "./Scripts/db.js";

export default class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      savedEvents: [],
      events: []
    }
  }

  loadDatabase = () => {
    db.table('startedEvents').toArray().then((savedEvents) => {
      this.setState({ savedEvents });
    });

    db.table('events').toArray().then((events) => {
      this.setState({ events });
    });
  }

  componentDidMount() {
    this.loadDatabase();
  }

  toCurrentWeek = event => {
    const newEvent = { ...event };
    const sunday = moment().startOf("week");
    const start = moment(event.start);
    const end = moment(event.end);

    while (start.isBefore(sunday)) {
      start.add(1, "week");
      end.add(1, "week");
    }

    newEvent.start = start.toDate();
    newEvent.end = end.toDate();

    return newEvent;
  }

  getCurrentEvents = () => {
    const now = moment();
    let currentEvents = [];

    for (let event of this.state.events) {
      const start = moment(event.start);
      const end = moment(event.end);

      if (now.isBetween(start, end)) {
        currentEvents.push(event);
      }
    }

    return currentEvents;
  }

  // Returns two things, the information of the event closest to now
  // and the time until that event in minutes
  getNextEvent = () => {
    const now = moment();
    let closestEvent = null;
    let closestTime = NaN;

    for (let event of this.state.events) {
      const start = moment(event.start);
      
      while (start.isBefore(now)) {
        start.add(1, "week");
      }

      const difference = start.diff(now, "minutes");

      if (closestEvent === null || difference < closestTime) {
        closestEvent = event;
        closestTime = difference;
      }
    }

    return [closestEvent, closestTime];
  }

  render() {
    return (
      <Router>
        <div className="container">
          <header className="d-flex justify-content-center py-3">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <NavLink exact to="/" className="nav-link" activeClassName="active" onClick={this.loadDatabase}>Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/scheduler" className="nav-link" activeClassName="active" onClick={this.loadDatabase}>Schedule</NavLink>
              </li>
            </ul>
          </header>
        </div>

        <Switch>
          <Route exact path="/">
            <Home
              currentEvents={this.getCurrentEvents()}
              nextEvent={this.getNextEvent()} />
          </Route>
          <Route path="/scheduler">
            <Scheduler
              savedEvents={this.state.savedEvents}
              events={this.state.events}
              hours={[8, 20]} />
          </Route>
        </Switch>
      </Router>
    );
  }
}