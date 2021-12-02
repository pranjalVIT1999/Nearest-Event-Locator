var positions = [];
var venues = [];
var apikey = "nnfhgT4zJPgWPtTG";
var radius = 5;
var pagenum = 1;
var totalEvents = 0;
var Latitude = sessionStorage.getItem("Latitude");
var Longitude = sessionStorage.getItem("Longitude");
var bullseye;
var map;
$(document).ready(function() {
  // Grabs and stores user location to find events near them immediately
  var eventdate = "Today";
  var queryURL =
    "http://api.eventful.com/json/events/search?app_key=" +
    apikey +
    "&date=" +
    eventdate +
    "&where=" +
    Latitude +
    "," +
    Longitude +
    "&within=" +
    radius;
  $("#idEventsList").empty();
  $("#idButtons").empty();
  sessionStorage.clear();
  // creates a map with the user's location as the center
  if (Latitude !== null && Longitude !== null) {
    bullseye = [Longitude, Latitude];
    mapboxgl.accessToken =
      "pk.eyJ1IjoicGhpbGlwczEiLCJhIjoiY2plcmE0NHF5MHlxcTMzcW52NjcyMTNrayJ9.HeoED9-4G8ML-EB-aCdnwQ";
    map = new mapboxgl.Map({
      container: "map", // HTML container id
      style: "mapbox://styles/mapbox/streets-v9", // style URL
      center: bullseye, // starting position as [lng, lat]
      zoom: 10
    });
  }
  updateEventsObj(queryURL);

  // Below is the code for the date picker in the nav bar
  $("#date-input").pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 2, // Creates a dropdown of 15 years to control year,
    today: "Today",
    clear: "Clear",
    close: "Ok",
    format: "mm/dd/yyyy",
    closeOnSelect: true // Close upon selecting a date,
  });
});

// Takes in user input to formulate get request
$("#submitButton").on("click", function(e) {
  positions = [];
  e.preventDefault();
  pagenum = 1;
  $("#idEventsList").empty();
  $("#idButtons").empty();
  var eventdate = $("#date-input")
    .val()
    .trim();
  var location = $("#location-input")
    .val()
    .trim()
    .replace(", ", "+")
    .replace(" ", "+");
  var queryURL =
    "http://api.eventful.com/json/events/search?app_key=" +
    apikey +
    "&date=" +
    eventdate +
    "&location=" +
    location +
    "&within=" +
    radius;
  updateEventsObj(queryURL);
});

// Next button grabs info on additional events when number of events exceeds ten
$(document).on("click", "#NextButton", function(event) {
  pagenum += 1;
  $("#idEventsList").empty();
  $("#idButtons").empty();
  var eventdate = $("#date-input")
    .val()
    .trim();
  var location = $("#location-input")
    .val()
    .trim();
  var queryURL =
    "http://api.eventful.com/json/events/search?app_key=" +
    apikey +
    "&date=" +
    eventdate +
    "&location=" +
    location +
    "&page_number=" +
    pagenum +
    "&within=" +
    radius;
  updateEventsObj(queryURL);
});

// Button goes to the previous page
$(document).on("click", "#PreviousButton", function(event) {
  pagenum -= 1;
  $("#idEventsList").empty();
  $("#idButtons").empty();
  var eventdate = $("#date-input")
    .val()
    .trim();
  var location = $("#location-input")
    .val()
    .trim();
  var queryURL =
    "http://api.eventful.com/json/events/search?app_key=" +
    apikey +
    "&date=" +
    eventdate +
    "&location=" +
    location +
    "&page_number=" +
    pagenum +
    "&within=" +
    radius;
  updateEventsObj(queryURL);
});

// Info button opens modal and grabs content to display in it
$(document.body).on("click", ".modal-trigger", function(event) {
  $("#seatGeekLink").html("");
  $("#stubHubLink").html("");
  var name = $(this).attr("data-name");
  var address = $(this).attr("data-address");
  var city = $(this).attr("data-city");
  var region = $(this).attr("data-region");
  var venue = $(this).attr("data-venue");
  var description = $(this).attr("data-description");
  $("#name").html(name);
  $("#venue").html(venue);
  $("#address").html(address);
  var citystate = city + ", " + region;
  $("#city").html(citystate);
  $("#description").html(description);
  $("#modal1").modal();
  $("#modal1").modal("open");

  // Checks if tickets are available on StubHub and SeatGeek and displays info
  let stubToken = "Bearer 3a694bd9-46d5-3f1a-9589-053adb778c0f";
  let stubhubURL =
    "https://api.stubhub.com/search/catalog/events/v3?fieldlist=ticketinfo,venue,name&parking=false&q=" +
    name +
    "&city=" +
    city;

  //Stubhub AJAX GET request
  $.ajax({
    url: stubhubURL,
    method: "GET",
    headers: { Authorization: stubToken }
  }).done(function(response) {
    //Stubhub variables
    let stubCurrency = "";
    let stubMin = 0;
    let stubMax = 0;
    let stubLink = "";

    //Sets response to stubData and makes sure something is returned
    let stubData = response.events;

    if (stubData.length >= 1) {
      //Venue URL
      stubLink = "https://www.stubhub.com/" + stubData[0].venue.webURI;

      //Sets currency
      stubCurrency = stubData[0].ticketInfo.minPriceWithCurrencyCode.currency;

      //Sets min value
      stubMin = stubData[0].ticketInfo.minPriceWithCurrencyCode.amount;

      //Sets max value
      stubMax = stubData[0].ticketInfo.maxPriceWithCurrencyCode.amount;

      let nf = new Intl.NumberFormat(["en-US"], {
        style: "currency",
        currency: stubCurrency,
        currencyDisplay: "symbol",
        maximumFractionDigit: 2,
        minimumFractionDigits: 2
      });

      //Reformats min price into $ddd.cc format
      let stubMinFormatted = nf.format(stubMin);

      //Appends button to card
      let stubButton =
        "<a href=" +
        '"' +
        stubLink +
        '"' +
        "> As low as: " +
        stubMinFormatted +
        "</a>";
      $("#stubHubLink").append(stubButton);
    } else {
      //lets user know that no tickets were found

      let stubButton =
        '<a href="https://www.stubhub.com">Sorry, we could not find tickets.</a>';
      $("#stubHubLink").append(stubButton);
    }
  });

  //SeatGeek territory
  let seatgeekURL =
    "https://api.seatgeek.com/2/venues?client_id=NzUzODA4OXwxNTEzODc4OTMwLjk3&city=" +
    city +
    "&q=" +
    venue;

  //Seatgeek AJAX GET request
  $.ajax({
    url: seatgeekURL,
    method: "GET"
  }).done(function(response) {
    //Seatgeek variables
    let seatVenueName = "";
    let seatVenueURL = "";

    //Sets response to seatData and makes sure something is returned
    let seatData = response.venues;

    if (seatData.length >= 1) {
      //Sets venue name
      seatVenueName = seatData[0].name;

      //Sets venue ticket url
      seatVenueURL = seatData[0].url;

      //Appends the button to card
      let seatButton = "<a href=" + seatVenueURL + ">" + seatVenueName + "</a>";
      $("#seatGeekLink").append(seatButton);
    } else {
      //Lets user know that no tickets were found

      let seatButton =
        '<a href="https://www.seatgeek.com">Sorry, we could not find tickets</a>';
      $("#seatGeekLink").append(seatButton);
    }
  });
});

// Performs get request and displays info on relevant events
function updateEventsObj(queryURL) {
  $.ajax({
    url: "https://cors-anywhere.herokuapp.com/" + queryURL,
    method: "GET"
  }).done(function(response) {
    var results = JSON.parse(response);
    totalEvents = parseInt(results.total_items);
    if (pagenum == 1) {
      if (totalEvents >= 10) index = 10;
      else index = totalEvents;
    }
    if (pagenum > 1) {
      if (totalEvents / (pagenum * 10) >= 1) index = 10;
      else index = totalEvents % 10;
    }
    for (var i = 0; i < index; i++) {
      var places = [
        results.events.event[i].latitude,
        results.events.event[i].longitude
      ];
      // Mapbox takes in coordinates in lng,lat format so must reverse coordinates from api
      positions.push(places.reverse());
      venues.push(results.events.event[i].venue_name);

      // Creating the number icons
      var eventsDiv = $("<ul class='collection'>");
      var litag = $("<li class='collection-item avatar'>");
      var EventNum = pagenum * 10 + i + 1 - 10;
      var newSpan = $("<span class='fa-stack fa-2x'>");
      var circle = $("<i class='fa fa-circle fa-stack-2x icon-cog thumbnail'>");
      var number = $("<strong class='fa-stack-1x white-text'>").html(EventNum);
      newSpan.append(circle);
      newSpan.append(number);

      // Grabbing info that populates event list
      var eventHeader = $("<p>").html(results.events.event[i].title);
      eventHeader.prepend(newSpan);
      litag.append(eventHeader);
      var venuetag = $("<p>");
      var venuename = "Venue: " + results.events.event[i].venue_name;
      venuetag.append(venuename);
      venuetag.append($("<br>"));
      var venueaddress = "Address: " + results.events.event[i].venue_address;
      venuetag.append(venueaddress);
      venuetag.append($("<br>"));
      var city =
        results.events.event[i].city_name +
        ", " +
        results.events.event[i].region_abbr;
      venuetag.append(city);
      litag.append(venuetag);
      var atag = $("<a href='#!' class='secondary-content'>");
      var itag = $("<i class='material-icons infoClick'>info</i>");
      itag.attr("data-name", results.events.event[i].title);
      itag.attr("data-venue", results.events.event[i].venue_name);
      itag.attr("data-address", results.events.event[i].venue_address);
      itag.attr("data-city", results.events.event[i].city_name);
      itag.attr("data-region", results.events.event[i].region_abbr);
      itag.attr("data-description", results.events.event[i].description);
      itag.addClass("modal-trigger");
      itag.attr("data-target", "modal1");
      atag.append(itag);
      var atagclose = $("</a>");
      atag.append(atagclose);
      var litagclose = $("</li>");
      atag.append(litagclose);
      litag.append(atag);
      eventsDiv.append(litag);

      // Append the completed event list to the events div
      $("#idEventsList").append(eventsDiv);
    }

    if (Latitude === null || Longitude === null) {
      bullseye = positions[0];
      mapboxgl.accessToken =
        "pk.eyJ1IjoicGhpbGlwczEiLCJhIjoiY2plcmE0NHF5MHlxcTMzcW52NjcyMTNrayJ9.HeoED9-4G8ML-EB-aCdnwQ";

      map = new mapboxgl.Map({
        container: "map", // HTML container id
        style: "mapbox://styles/mapbox/streets-v9", // style URL
        center: bullseye, // starting position as [lng, lat]
        zoom: 10
      });
    }

    positions.forEach(function(point) {
      // create a HTML element for each feature
      var el = document.createElement("div");
      el.className = "marker";
      var venueIndex = positions.indexOf(point);
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(point)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            "<h6>" + venues[venueIndex] + "</h6>"
          )
        )
        .addTo(map);
    });

    if (pagenum > 1) {
      var buttonsDiv = $("<br><div class='buttonsDiv'>");
      var prevbutton = $(
        "<button name='previous' class='waves-effect waves-light btn center-align' id='PreviousButton'>< Previous</button>"
      );
      buttonsDiv.append(prevbutton);

      if (totalEvents / (pagenum * 10) >= 1) {
        var nextbutton = $(
          "<button name='next' class='waves-effect waves-light btn center-align' id='NextButton'>Next ></button>"
        );
        buttonsDiv.append(nextbutton);
      }
      $("#idButtons").append(buttonsDiv);
    } else {
      if (totalEvents > 10) {
        var buttonsDiv = $("<br><div class='buttonsDiv'>");
        var nextbutton = $(
          "<button name='next' class='waves-effect waves-light btn center-align' id='NextButton'>Next ></button>"
        );
        buttonsDiv.append(nextbutton);
        $("#idButtons").append(buttonsDiv);
      }
    }
  });
}
