import React from "react";
import $ from "jquery";

import "../Scripts/bundle.js";

export default class Home extends React.Component {
  componentDidMount() {
    $("#scheduler").click(function () {
      $("#ok").html("Clicking that button would redirect to the <b>schedule</b> page.")
      $("#editor").fadeOut(0);
      $("#ask").fadeOut(0);
    })
    $("#tips").click(function () {
      $("#ok").html("Clicking that button would redirect to the <b>tips</b> page.")
      $("#editor").fadeOut(0);
      $("#ask").fadeOut(0);
    })
    console.log(localStorage.getItem("on"));
    if (localStorage.getItem("on") == "true") {
      $("#editor").fadeOut(0);
      $("#ok").html("Welcome back!");
      $("#main").append('<button type="button" class="btn btn-primary btn-lg px-4 me-sm-3" id="cooko" style="border-radius: 25px; color: rgb(227, 99, 91); border: 3px solid rgb(227, 99, 91); background-color: rgb(182, 227, 174);"><b>Make me a first time user again (for debugging purposes only)</b></button>')
      $("#cooko").click(function () {
        localStorage.setItem("on", "false");
        $("#ok").html("Success. Refresh the page to reach the first time user landing page.")
      })
      $("#ask").fadeOut(0);
    }

    var faded = false;
    $("#schedule").click(function () {
      localStorage.setItem("on", "true");
      $("#ok").html("Now, the website would create the schedule. This button also sets the firstTimeUser cookie to false.")
      $("#editor").fadeOut(0);
      $("#ask").fadeOut(0);
    })
    $("#schedule").fadeOut(0);
    document.getElementById("editor").addEventListener("input", function () {
      if (!faded) {
        faded = true;
        $("#ask").fadeOut(200, "swing", function () {
          document.getElementById("ask").innerHTML = ", would you like to create a schedule?";
          $("#ask").fadeIn(200);
        });
        $("#schedule").fadeIn(900, "swing");
      }
    }, false);
  }

  render() {
    const current = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <div>
        <div className="px-4 py-5 my-5 text-center">
          <h1 className="display-5 fw-bold">Hello </h1>
          <h1 className="display-5 fw-bold" contentEditable="true" style={{"outline": "none"}}>stranger</h1>
          <h1 className="display-5 fw-bold">, what is your name?</h1>
          <div className="col-lg-6 mx-auto">
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <button type="button" className="btn btn-primary btn-lg px-4 me-sm-3"
                style={{
                  borderRadius: "25px",
                  color: "rgb(227, 99, 91)",
                  border: "3px solid rgb(227, 99, 91)",
                  backgroundColor: "rgb(182, 227, 174)"
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