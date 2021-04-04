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

const localizer = momentLocalizer(moment);
const DndCalendar = withDragAndDrop(Calendar);

export default class Scheduler extends React.Component {
  constructor(props) {
    super();

    this.state = {
      editSavedModal: false,
      currentSavedEvent: null,

      editExistingModal: false,
      currentEvent: null,

      draggedEvent: null,
      savedEvents: props.savedEvents,
      events: props.events,
      hours: props.hours
    };
  }

  // "Add event" button

  addSavedEvent = () => {
    let savedEvents = this.state.savedEvents.slice(0);
    savedEvents.push({
      title: "New event",
      length: 1,
      hexColor: "#f7f7f7",
      notes: ""
    });

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
    const copy = { ...this.state.savedEvents[this.state.currentSavedEvent] };
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
    savedEvents[this.state.currentSavedEvent] = event;

    this.setState({
      savedEvents: savedEvents,
      editSavedModal: false,
      currentSavedEvent: null
    })
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

    this.setState({
      events: events,
      editExistingModal: false,
      currentEvent: null
    });
  }

  deleteEvent = () => {
    console.log(this.state.currentEvent);
    const index = this.state.events.findIndex(event => event.id === this.state.currentEvent);
    const events = this.state.events.slice(0);
    events.splice(index, 1);

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

    this.setState({
      events: this.state.events.concat([hour]),
    });
  }

  eventStyleGetter = (event, start, end, isSelected) => {
    var style = {
      backgroundColor: event.hexColor
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
                  backgroundColor: event.hexColor
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
            onClick={this.changeSavedEvent} />
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