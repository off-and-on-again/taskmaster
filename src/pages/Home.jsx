import React from "react";
import $ from "jquery";

import "../Scripts/bundle.js";
import db from '../Scripts/db';

export default class Home extends React.Component {
  componentDidMount() {
    $("#scheduler").click(function () {
      window.location.href = "/scheduler";
    });

    if (localStorage.getItem("on") != null) {
      $("#editor").fadeOut(0);
      let their_name = localStorage.getItem("on");
      $("#ok").html("Welcome back, " + their_name + ".");
      $("#schedule").fadeOut(0);
      $("#ask").fadeOut(0);
      $("#main").append(`<button type="button" class="btn btn-primary btn-lg px-4 me-sm-3" onclick="window.location.href='/scheduler'" style="border-radius: 25px; color: rgb(227, 99, 91); border: 3px solid rgb(227, 99, 91); background-color: rgb(182, 227, 174);"><b>View my schedule</b></button>`);
    } else {
      $("#scheduler").fadeOut(0);
      var faded = false;
      $("#schedule").click(function () {
        let their_name = $("#editor").html();
        localStorage.setItem("on", their_name.substring(3, their_name.length - 4));
        their_name = localStorage.getItem("on");
        $("#ok").html("Thanks, " + their_name + ".")
        $("#editor").fadeOut(0);
        $("#ask").fadeOut(0);
        $("#schedule").fadeOut(0);
        $("#main").append(`<button type="button" class="btn btn-primary btn-lg px-4 me-sm-3" onclick="window.location.href='/scheduler'" style="border-radius: 25px; color: rgb(227, 99, 91); border: 3px solid rgb(227, 99, 91); background-color: rgb(182, 227, 174);"><b>Start creating my schedule</b></button>`);
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
  }

  render() {
    const current = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <div>
        <div class="px-4 py-5 my-5 text-center" id="main">
          <h1 class="display-5 fw-bold" id="ok">Hello </h1>
          <h1 class="display-5 fw-bold" id="editor" contenteditable="true" style={{outline: "none"}}><u>stranger</u></h1>
          <h1 class="display-5 fw-bold" id="ask">, what is your name?</h1>
          <div class="col-lg-6 mx-auto">
            <div class="d-grid gap-2 d-sm-flex justify-content-sm-center" style={{paddingTop: "20px"}}>
              <button type="button" class="btn btn-primary btn-lg px-4 me-sm-3" id="schedule" style={{
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
          <img class="d-block mx-auto mb-4" src={window.location.origin + "/actual.svg"} alt="" width="200" height="200" />
        </div>

        <div id="another">
          <h1 class="display-5 fw-bold" style={{color: "red"}}>
            {current}
          </h1>
        </div>
      </div>
    );
  }
}