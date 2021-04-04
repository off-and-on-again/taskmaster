import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { Button } from "react-bootstrap";
import { Slider } from "@material-ui/core";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import "./Scheduler.css";
import EditSavedEvent from "../components/EditSavedEvent.jsx";
import EditExistingEvent from "../components/EditExistingEvent.jsx";
import Event from "../components/Event.jsx";

import db from '../Scripts/db';


const localizer = momentLocalizer(moment);
const DndCalendar = withDragAndDrop(Calendar);

export default class Scheduler extends React.Component {
  constructor(props) {
    super();

    this.state = {
      editSavedModal: false,
      currentSavedIndex: null,

      editExistingModal: false,
      currentEvent: null,

      draggedEvent: null,
      savedEvents: props.savedEvents,
      events: props.events.map(event => this.toCurrentWeek(event)),
      hours: props.hours
    };
  }

  componentDidMount() {
    db.table('startedEvents').toArray().then((savedEvents) => {
      this.setState({ savedEvents });
    });

    db.table('events').toArray().then((events) => {
      this.setState({ events });
    });

  }

  handleAddSavedEvent = (id, title, length, hexColor, notes) => {

    const savedEvent = {
      id, 
      title,
      length,
      hexColor,
      notes
    };
    db.table('startedEvents').add(savedEvent).then();
  }

  handleAddEvent = (id, title, allDay, start, end, hexColor, notes) => {
    const newEvent = {
      id,
      title,
      allDay,
      start,
      end,
      hexColor,
      notes,
    };
    db.table('events').add(newEvent).then();
  }

  handleDeleteStartedEvent = (id) => {
    db.table('savedEvents').delete(id);
  }

  handleDeleteEvent = (id) => {

    db.tables('events').delete(id);

  }

  handleToggledStartedEvent = (id, title, length, hexColor, notes) => {
    db.table('savedEvents')
    .update(id, { id, title, length, hexColor, notes });
  }

  handleToggledEvent = (id, title, allDay, start, end, hexColor, notes) => {

    db.table('events')
    .update(id, { id, title, allDay, start, end, hexColor, notes });

  }

  // Helper functions (move these to App)

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

      const difference = now.diff(start, "minutes");

      if (closestEvent === null || difference < closestTime) {
        closestEvent = event;
        closestTime = difference;
      }
    }

    return (closestEvent, closestTime);
  }

  // True helper functions within Scheduler

  getContrastColour = (hex) => {
    console.log(hex);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const [r, g, b] = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    const brightness = r * 0.299 + g * 0.587 + b * 0.114;
    return brightness > 186 ? "#000000" : "#FFFFFF";
  }

  // "Add event" button

  addSavedEvent = () => {
    let savedEvents = this.state.savedEvents.slice(0);
    let idList = savedEvents.map(a => a.id);
    let newId;
    
    if (idList.length === 0) {
      newId = 0;
    } else {
      newId = Math.max(...idList) + 1;
    }

    const newEvent = {
      id: newId,
      title: "New event",
      length: 1,
      hexColor: "#f7f7f7",
      notes: ""
    };

    savedEvents.push(newEvent);

    this.handleAddSavedEvent(newId, "New Event", 1, "#f7f7f7", "");

    this.setState({
      savedEvents: savedEvents
    });
  }

  // Stuff that happens when we perform actions
  // on each individual saved event

  handleDragStart = event => {
    this.setState({
      draggedEvent: event
    });
  }

  getSavedEvent = () => {
    const copy = { ...this.state.savedEvents[this.state.currentSavedIndex] };
    return copy;
  }

  editSavedEvent = index => {
    this.setState({
      editSavedModal: true,
      currentSavedEvent: index
    });
  }

  changeSavedEvent = (event, willChange) => {
    if (!willChange) {
      this.setState({
        editSavedModal: false,
        currentSavedEvent: null
      });

      return;
    }

    let savedEvents = this.state.savedEvents.slice(0);
    savedEvents[this.state.currentSavedIndex] = event;

    this.handleToggledStartedEvent(event.id, event.title, event.length, event.notes, event.hexColor);

    this.setState({
      savedEvents: savedEvents,
      editSavedModal: false,
      currentSavedEvent: null
    })
  }

  deleteSavedEvent = () => {
    const events = this.state.events.slice(0);

    this.handleDeleteSavedEvent(this.state.currentSavedIndex);

    events.splice(this.state.currentSavedIndex, 1);

    this.setState({
      events: events,
      editExistingModal: false,
      currentEvent: null
    });
  }

  // Same stuff that happens for existing events on the
  // calendar instead

  getExistingEvent = () => {
    const index = this.state.events.findIndex(event => event.id == this.state.currentEvent);
    const copy = { ...this.state.events[index] };
    return copy;
  }

  changeEvent = (event, willChange) => {
    if (!willChange) {
      this.setState({
        editExistingModal: false,
        currentEvent: null
      });

      return;
    }

    let events = this.state.events.slice(0);
    const index = events.findIndex(e => e.id === this.state.currentEvent);
    events[index] = { ...events[index], ...event };

    this.handleToggledEvent(event.id, event.title, event.isAllDay, event.start, event.end, event.notes, event.hexColor);

    this.setState({
      events: events,
      editExistingModal: false,
      currentEvent: null
    });
  }

  deleteEvent = () => {
    const index = this.state.events.findIndex(event => event.id === this.state.currentEvent);
    const events = this.state.events.slice(0);
    events.splice(index, 1);

    this.handleDeleteEvent(index);

    this.setState({
      events: events,
      editExistingModal: false,
      currentEvent: null
    });
  }

  // Range slider

  handleChange = (event, value) => {
    this.setState({
      hours: value
    });
  }

  // Calendar stuff

  dragFromOutsideItem = () => {
    return this.state.draggedEvent;
  }

  onEventDrop = ({ event, start, end }) => {
    const { events } = this.state;

    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    event.start = start;
    event.end = end;

    this.handleToggledEvent(event.id, event.title, event.isAllDay, event.start, event.end, event.notes, event.hexColor);

    this.setState({
      events: nextEvents
    });
  };

  onEventResize = ({ event, start, end }) => {
    const { events } = this.state;

    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    this.handleToggledEvent(event.id, event.title, event.isAllDay, start, end, event.notes, event.hexColor);

    this.setState({
      events: nextEvents
    });
  };

  onDoubleClickEvent = (event, e) => {
    console.log(event);
    this.setState({
      editExistingModal: true,
      currentEvent: event.id
    });
  }

  onDropFromOutside = ({ start, end, allDay }) => {
    const { draggedEvent } = this.state;
    const eventEnd = moment(start).add(draggedEvent.length, "hours");

    const event = {
      title: draggedEvent.title,
      start,
      end: eventEnd.toDate(),
      isAllDay: allDay,
      hexColor: draggedEvent.hexColor,
      notes: draggedEvent.notes
    };

    this.setState({ draggedEvent: null });
    this.newEvent(event);
  }

  newEvent = event => {
    let idList = this.state.events.map(a => a.id);
    let newId;
    
    if (idList.length === 0) {
      newId = 0;
    } else {
      newId = Math.max(...idList) + 1;
    }

    let hour = {
      id: newId,
      title: event.title,
      allDay: event.isAllDay,
      start: event.start,
      end: event.end,
      hexColor: event.hexColor,
      notes: event.notes
    };

    this.handleAddEvent(newId, event.title, event.isAllDay, event.start, event.end, event.hexColor, event.notes);

    this.setState({
      events: this.state.events.concat([hour]),
    });
  }

  eventStyleGetter = (event, start, end, isSelected) => {
    var style = {
      backgroundColor: event.hexColor,
      color: this.getContrastColour(event.hexColor)
    };

    return {
      style: style
    };
  }

  render() {
    let minTime = new Date();
    minTime.setHours(this.state.hours[0], 0, 0);

    let maxTime = new Date();
    maxTime.setHours(this.state.hours[1], 0, 0);

    return (
      <div id="scheduler">
        <div id="schedulerHeader" className="row">
          <Button color="primary" onClick={this.addSavedEvent} className="col-lg-1">Add new event</Button>
          <div id="savedEventList" className="col-lg-9">
            {this.state.savedEvents.map((event, index) => (
              <div
                className="savedEvent"
                draggable="true"
                key={index}
                onDragStart={() => this.handleDragStart(event)}
                onDoubleClick={() => this.editSavedEvent(index)}
                style={{
                  backgroundColor: event.hexColor,
                  color: this.getContrastColour(event.hexColor)
                }}>
                {event.title}
              </div>
            ))}
          </div>
          <div className="col-lg-2">
            <Slider
              min={0}
              max={23}
              value={this.state.hours}
              onChange={this.handleChange}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              getAriaValueText={() => `${this.state.hours}:00`} />
          </div>
        </div>
        {this.state.editSavedModal && (
          <EditSavedEvent
            event={this.getSavedEvent()}
            onClick={this.changeSavedEvent}
            onDelete={this.deleteSavedEvent} />
        )}
        {this.state.editExistingModal && (
          <EditExistingEvent
            event={this.getExistingEvent()}
            onClick={this.changeEvent}
            onDelete={this.deleteEvent} />
        )}
        <DndCalendar
          tooltipAccessor={null}
          id="calendar"
          selectable
          resizable
          defaultDate={moment().toDate()}
          defaultView="week"
          views={["week"]}
          toolbar={false}
          events={this.state.events}
          localizer={localizer}
          min={minTime}
          max={maxTime}
          onEventDrop={this.onEventDrop}
          onEventResize={this.onEventResize}
          onDoubleClickEvent={this.onDoubleClickEvent}
          onDropFromOutside={this.onDropFromOutside}
          dragFromOutsideItem={this.dragFromOutsideItem}
          eventPropGetter={this.eventStyleGetter}
          components={{event: Event}} />
      </div>
    );
  }
}
