$('svg').on('mousemove', function(e) {
  $('.a').attr('cx', e.pageX).attr('cy', e.pageY)
})
///////////////////////////////////////////////
// var img = document.getElementsByTagName("image")[0];
// var imgPos = img.getBoundingClientRect();
// var imgX = imgPos.left;
// var imgY = imgPos.top;
// var rect = document.getElementsByTagName("rect")[1];
// var rectHalfWidth = rect.getAttribute("width") / 2;
// var rectHalfHeight = rect.getAttribute("height") / 2;
// img.addEventListener("mousemove", function(e) {
//   rect.setAttribute("x", e.clientX - imgX - rectHalfWidth);
//   rect.setAttribute("y", e.clientY - imgY - rectHalfHeight);
// }, false);
///////////////////////////////////////////////

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};
const options_2 = {
  month: 'long',
};
const options_3 = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};
var cal = {
  // (A) PROPERTIES
  mName: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // Month Names
  data: null, // Events for the selected period
  sDay: 0, // Current selected day
  sMth: 0, // Current selected month
  sYear: 0, // Current selected year
  sMon: false, // Week start on Monday?
  dateStr: " ",
  d1: " ",
  daysInMth: 0,
  // (B) DRAW CALENDAR FOR SELECTED MONTH
  list: function() {
    // Get the value of the input field with id="numb"
    cal.dateStr = document.getElementById("numb").value; // Get the value of the input field with id="numb"
    ////////////////////////////////
    while (cal.dateStr == "") {
      var now = new Date(),
        nowMth = now.getMonth()
      cal.dateStr = now + "/" + nowMth + "/";
    }
    var msec = Date.parse(cal.dateStr); //turns inputed date into ms
    cal.d1 = new Date(msec); //turn ms into usable date
    // If x is Not a Number or less than one or greater than 10
    if (isNaN(cal.d1) == true) {
      leap = "Input not valid";
      document.getElementById("demo1").innerHTML = cal.d1;
      document.getElementById("demo2").innerHTML = leap;
      document.getElementById("demo3").innerHTML = " ";
    } else {
      var event = cal.d1; //makes it a callabke event with varable constants
      cal.sDay = String(cal.d1.getDate()).padStart(2, '0'); //makes day from string
      cal.sMth = String(cal.d1.getMonth() + 0).padStart(2, '0'); //January is 0!
      cal.sYear = cal.d1.getFullYear(); //gets year from string
      cal.d1 = cal.sMth + '/' + cal.sDay + '/' + cal.sYear;
      // (B1) BASIC CALCULATIONS - DAYS IN MONTH, START + END DAY
      // Note - Jan is 0 & Dec is 11 in JS.
      // Note - Sun is 0 & Sat is 6
      // cal.sMth = parseInt(document.getElementById("cal-mth").value); // selected month
      cal.sDay = parseInt(cal.sDay);
      cal.sMth = parseInt(cal.sMth);
      cal.sYear = parseInt(cal.sYear); // selected year
      cal.daysInMth = new Date(cal.sYear, cal.sMth + 1, 0).getDate(), // number of days in selected month
        startDay = new Date(cal.sYear, cal.sMth, 1).getDay(), // first day of the month
        endDay = new Date(cal.sYear, cal.sMth, cal.daysInMth).getDay(); // last day of the month

      // (B2) LOAD DATA FROM LOCALSTORAGE
      cal.data = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
      if (cal.data == null) {
        localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
        cal.data = {};
      } else {
        cal.data = JSON.parse(cal.data);
      }

      // (B3) DRAWING CALCULATIONS
      // Determine the number of blank squares before start of month
      var squares = [];
      if (cal.sMon && startDay != 1) {
        var blanks = startDay == 0 ? 7 : startDay;
        for (var i = 1; i < blanks; i++) {
          squares.push("b");
        }
      }
      if (!cal.sMon && startDay != 0) {
        for (var i = 0; i < startDay; i++) {
          squares.push("b");
        }
      }

      // Populate the days of the month
      for (var i = 1; i <= cal.daysInMth; i++) {
        squares.push(i);
      }

      // Determine the number of blank squares after end of month
      if (cal.sMon && endDay != 0) {
        var blanks = endDay == 6 ? 1 : 7 - endDay;
        for (var i = 0; i < blanks; i++) {
          squares.push("b");
        }
      }
      if (!cal.sMon && endDay != 6) {
        var blanks = endDay == 0 ? 6 : 6 - endDay;
        for (var i = 0; i < blanks; i++) {
          squares.push("b");
        }
      }

      // (B4) DRAW HTML CALENDAR
      // Container
      var container = document.getElementById("cal-container"),
        cTable = document.createElement("table");
      cTable.id = "calendar";
      container.innerHTML = "";
      container.appendChild(cTable);

      // First row - Day names
      var cRow = document.createElement("tr"),
        cCell = null,
        days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
      if (cal.sMon) {
        days.push(days.shift());
      }
      for (var d of days) {
        cCell = document.createElement("td");
        cCell.innerHTML = d;
        cRow.appendChild(cCell);
      }
      cRow.classList.add("head");
      cTable.appendChild(cRow);

      // Days in Month
      var total = squares.length;
      cRow = document.createElement("tr");
      cRow.classList.add("day");
      for (var i = 0; i < total; i++) {
        cCell = document.createElement("td");
        if (squares[i] == "b") {
          cCell.classList.add("blank");
        } else {
          cCell.innerHTML = "<div class='dd'>" + squares[i] + "</div>";
          if (cal.data[squares[i]]) {
            cCell.innerHTML += "<div class='evt'>" + cal.data[squares[i]] + "</div>";
          }
          cCell.addEventListener("click", function() {
            cal.show(this);
          });
        }
        cRow.appendChild(cCell);
        if (i != 0 && (i + 1) % 7 == 0) {
          cTable.appendChild(cRow);
          cRow = document.createElement("tr");
          cRow.classList.add("day");
        }
      }
      document.getElementById("demo1").innerHTML = cal.d1;
      document.getElementById("demo2").innerHTML = "there are " + cal.daysInMth + " days in " + event.toLocaleDateString(undefined, options_2);
      document.getElementById("demo3").innerHTML = event.toLocaleDateString(undefined, options);
    }
    // (B5) REMOVE ANY PREVIOUS ADD/EDIT EVENT DOCKET
    cal.close();
  },

  // (C) SHOW EDIT EVENT DOCKET FOR SELECTED DAY
  show: function(el) {
    // (C1) FETCH EXISTING DATA
    cal.sDay = el.getElementsByClassName("dd")[0].innerHTML;

    // (C2) DRAW EVENT FORM
    var tForm = "<h1>" + (cal.data[cal.sDay] ? "EDIT" : "ADD") + " EVENT</h1>";
    tForm += "<div id='evt-date'>" + cal.sDay + " " + cal.mName[cal.sMth] + " " + cal.sYear + "</div>";
    tForm += "<textarea id='evt-details' required>" + (cal.data[cal.sDay] ? cal.data[cal.sDay] : "") + "</textarea>";
    tForm += "<input type='button' value='Close' onclick='cal.close()'/>";
    tForm += "<input type='button' value='Delete' onclick='cal.del()'/>";
    tForm += "<input type='submit' value='Save'/>";

    // (C3) ATTACH EVENT FORM
    var eForm = document.createElement("form");
    eForm.addEventListener("submit", cal.save);
    eForm.innerHTML = tForm;
    var container = document.getElementById("cal-event");
    container.innerHTML = "";
    container.appendChild(eForm);
  },

  // (D) CLOSE EVENT DOCKET
  close: function() {
    document.getElementById("cal-event").innerHTML = "";
  },

  // (E) SAVE EVENT
  save: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    cal.data[cal.sDay] = document.getElementById("evt-details").value;
    localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, JSON.stringify(cal.data));
    cal.list();
  },

  // (F) DELETE EVENT FOR SELECTED DATE
  del: function() {
    if (confirm("Remove event?")) {
      delete cal.data[cal.sDay];
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, JSON.stringify(cal.data));
      cal.list();
    }
  }
};

// (G) INIT - DRAW MONTH & YEAR SELECTOR
window.addEventListener("load", function() {
  // (G1) DATE NOW
  // var now = new Date(),
  //   nowMth = now.getMonth(),
  //   nowYear = parseInt(now.getFullYear());
  // (G4) START - DRAW CALENDAR
  document.getElementById("cal-set").addEventListener("click", cal.list);
  cal.list();
});