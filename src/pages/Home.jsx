import React from "react";

export default class Home extends React.Component {
  render() {
    const current = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <div id="home">
        <div className="px-4 py-5 my-5 text-center">
          <h1 className="display-5 fw-bold">Hello </h1>
          <h1 className="display-5 fw-bold" contentEditable="true" style={{"outline": "none"}}>stranger</h1>
          <h1 className="display-5 fw-bold">, what is your name?</h1>
          <div className="col-lg-6 mx-auto">
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <button type="button" className="btn btn-primary btn-lg px-4 me-sm-3"
                style={{
                  "borderRadius": "25px",
                  "color": "rgb(227, 99, 91)",
                  "border": "3px solid rgb(227, 99, 91)",
                  "backgroundColor": "rgb(182, 227, 174)"
                }}>
                <b>Create Schedule</b>
              </button>
            </div>
          </div>
        </div>

        <div id="foo">
          <img className="d-block mx-auto mb-4" src="icon.png" alt="" width="300" height="80" />
        </div>

        <div id="another">
          <h1 className="display-5 fw-bold" style={{ color: "red" }}>
            {current}
          </h1>
        </div>
      </div>
    );
  }
}