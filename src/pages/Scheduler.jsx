import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DndCalendar = withDragAndDrop(Calendar);

export default class Scheduler extends React.Component {
  constructor(props) {
    super();

    this.state = {
      events: props.events,
      hours: props.hours
    };
  }

  render() {
    let minTime = new Date();
    minTime.setHours(this.state.hours[0], 0, 0);

    let maxTime = new Date();
    maxTime.setHours(this.state.hours[1], 0, 0);

    return (
      <DndCalendar
        selectable
        resizable
        defaultDate={moment().toDate()}
        defaultView="week"
        views={["week"]}
        toolbar={false}
        events={this.state.events}
        localizer={localizer}
        min={minTime}
        max={maxTime} />
    );
  }
}
