import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default class EditExistingEvent extends React.Component {
  constructor(props) {
    super();

    this.state = {
      title: props.event.title,
      notes: props.event.notes,
      hexColor: props.event.hexColor
    }
  }

  handleChange = (event, changed) => {
    switch (changed) {
      case "title":
        this.setState({ title: event.target.value });
        break;
      case "notes":
        this.setState({ notes: event.target.value });
        break;
      case "hexColor":
        this.setState({ hexColor: event.target.value });
        break;
    }
  }

  constructEvent = () => {
    const object = {
      title: this.state.title,
      notes: this.state.notes,
      hexColor: this.state.hexColor
    };

    return object;
  }

  render() {
    return (
      <Modal className="editSavedEvent" show onHide={() => this.props.onClick(this.constructEvent(), false)}>
        <Modal.Header>
          <Modal.Title>Edit Saved Event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="savedEventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                defaultValue={this.props.event.title}
                onChange={event => this.handleChange(event, "title")} />
            </Form.Group>
            <Form.Group controlId="savedEventLength">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                defaultValue={this.props.event.notes}
                onChange={event => this.handleChange(event, "notes")} />
            </Form.Group>
            <Form.Group controlId="savedEventColor">
              <Form.Label>Event colour</Form.Label>
              <Form.Control
                type="color"
                defaultValue={this.props.event.hexColor}
                onChange={event => this.handleChange(event, "hexColor")} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={this.props.onDelete}>Delete</Button>
          <Button variant="primary" onClick={() => this.props.onClick(this.constructEvent(), true)}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}